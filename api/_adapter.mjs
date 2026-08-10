/**
 * Ponte entre a assinatura (req, res) do runtime Node da Vercel e o handler
 * baseado em Request/Response de lib/icons.mjs.
 *
 * A Vercel também aceita handlers Web-standard `(request) => Response` em
 * runtimes recentes, mas essa forma depende da versão do runtime da conta.
 * O adaptador funciona em qualquer uma.
 *
 * Arquivos com prefixo `_` não viram rota — a Vercel os ignora ao mapear api/.
 */
import { handle } from '../lib/icons.mjs';

/** Monta a URL absoluta que o `new URL()` de dentro do handler precisa. */
function absoluteUrl(req) {
  const proto = req.headers['x-forwarded-proto'] ?? 'https';
  const host =
    req.headers['x-forwarded-host'] ?? req.headers.host ?? 'localhost';
  return `${proto}://${host}${req.url}`;
}

/**
 * @param {string} route caminho que este arquivo representa (ex.: 'icons'),
 *   usado porque a Vercel reescreve /icons -> /api/render e o handler decide
 *   pelo pathname.
 */
export function serve(route) {
  return async function handler(req, res) {
    try {
      const url = new URL(absoluteUrl(req));
      // O handler roteia por pathname. Sob rewrite o pathname que chega é o do
      // arquivo (/api/render), então normalizamos para a rota pública.
      url.pathname = `/${route}`;

      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
      });

      const response = await handle(request);

      if (!response) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.end('Not found');
        return;
      }

      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      res.end(await response.text());
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(err?.stack ?? String(err));
    }
  };
}
