#!/usr/bin/env node
/**
 * Servidor local que reproduz o roteamento da Vercel, para desenvolver a
 * página sem depender de `vercel dev` nem do wrangler.
 *
 * Ordem igual à da hospedagem: primeiro o estático de public/, depois as rotas
 * de função (`/icons`, `/api/*`), e o que sobrar cai no 404.html — que é o que
 * a Vercel faz com uma página 404 estática.
 *
 *   npm run dev:web            porta 4173
 *   PORT=5000 npm run dev:web
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handle } from '../lib/icons.mjs';

const PUBLIC = path.join(import.meta.dirname, '..', 'public');
const PORTA = Number(process.env.PORT) || 4173;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

/** Resolve um caminho de URL para um arquivo dentro de public/, ou null. */
function arquivo(pathname) {
  const limpo = decodeURIComponent(pathname).replace(/\/+$/, '') || '/index';
  const base = path.normalize(path.join(PUBLIC, limpo));
  // Impede escapar de public/ com ../
  if (!base.startsWith(PUBLIC)) return null;

  for (const tentativa of [base, base + '.html', path.join(base, 'index.html')])
    if (fs.existsSync(tentativa) && fs.statSync(tentativa).isFile())
      return tentativa;
  return null;
}

function enviarArquivo(res, caminho, status = 200) {
  const tipo = TIPOS[path.extname(caminho)] ?? 'application/octet-stream';
  res.writeHead(status, { 'content-type': tipo });
  fs.createReadStream(caminho).pipe(res);
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORTA}`);

  const estatico = arquivo(url.pathname);
  if (estatico) return enviarArquivo(res, estatico);

  const resposta = await handle(new Request(url));
  if (resposta) {
    const corpo = Buffer.from(await resposta.arrayBuffer());
    res.writeHead(resposta.status, Object.fromEntries(resposta.headers));
    return res.end(corpo);
  }

  const naoEncontrado = path.join(PUBLIC, '404.html');
  if (fs.existsSync(naoEncontrado))
    return enviarArquivo(res, naoEncontrado, 404);
  res.writeHead(404, { 'content-type': 'text/plain' });
  res.end('404');
});

servidor.listen(PORTA, () => {
  console.log(`http://localhost:${PORTA}`);
});
