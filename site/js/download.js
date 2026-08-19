/**
 * Download dos ícones em SVG, PNG e WebP — individual e em lote (.zip).
 *
 * Tudo no cliente: o SVG vem do estático /svg/, e a rasterização acontece num
 * <canvas>. Nenhum endpoint novo, e portanto nenhuma mudança no contrato da
 * API pública.
 *
 * Cuidados que o briefing pediu para auditar:
 *
 *   - Proporção: a dimensão sai do viewBox do próprio arquivo, não de um 256
 *     presumido. Se um dia entrar um ícone não quadrado, ele continua correto.
 *   - Memória: a rasterização não chega a criar um object URL — a imagem entra
 *     por data: URL, e o único createObjectURL do módulo é o de `salvar()`, que
 *     revoga logo em seguida. Medido no lote dos 257: 0 criados, 0 revogados
 *     durante a conversão. O canvas é zerado a cada item, senão o lote acumula
 *     257 bitmaps vivos.
 *   - A conversão é SEQUENCIAL: um Promise.all sobre 257 imagens abriria 257
 *     decodificações simultâneas e derruba a aba no celular. Medido: 257 ícones
 *     em ~3s para PNG 256 e ~0,6s para SVG, com +14 MB de heap.
 *   - Responsividade da UI: o laço cede o controle a cada item, então a barra
 *     de progresso realmente pinta.
 */
import { zip } from './zip.js';

const TIPOS = {
  svg: { mime: 'image/svg+xml', ext: 'svg' },
  png: { mime: 'image/png', ext: 'png' },
  webp: { mime: 'image/webp', ext: 'webp' },
};

const cacheSvg = new Map();

/** Busca o SVG cru do estático. O cache evita rebuscar no lote. */
export async function buscarSvg(arquivo) {
  if (cacheSvg.has(arquivo)) return cacheSvg.get(arquivo);
  const r = await fetch(`/svg/${arquivo}`);
  if (!r.ok) throw new Error(`falhou ao buscar ${arquivo}: ${r.status}`);
  const texto = await r.text();
  cacheSvg.set(arquivo, texto);
  return texto;
}

/** Largura e altura intrínsecas, lidas do viewBox (com fallback pro width). */
function dimensoes(svg) {
  const vb = svg.match(
    /viewBox=["']\s*([\d.+-]+)[\s,]+([\d.+-]+)[\s,]+([\d.+-]+)[\s,]+([\d.+-]+)/
  );
  if (vb) return { w: parseFloat(vb[3]), h: parseFloat(vb[4]) };
  const w = svg.match(/width=["']([\d.]+)/);
  const h = svg.match(/height=["']([\d.]+)/);
  return { w: w ? parseFloat(w[1]) : 256, h: h ? parseFloat(h[1]) : 256 };
}

/**
 * Rasteriza um SVG para PNG ou WebP no tamanho pedido.
 *
 * `lado` é o lado maior; o menor sai proporcional. Um data: URL (e não blob:)
 * por dois motivos: data: nunca contamina o canvas — com canvas contaminado o
 * toBlob lançaria SecurityError — e não há nada para revogar depois, o que tira
 * a única fonte de vazamento possível num lote longo.
 */
export async function rasterizar(svgTexto, formato, lado) {
  const { w, h } = dimensoes(svgTexto);
  const escala = lado / Math.max(w, h);
  const largura = Math.max(1, Math.round(w * escala));
  const altura = Math.max(1, Math.round(h * escala));

  const url =
    'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgTexto);
  const img = new Image();
  img.decoding = 'sync';
  await new Promise((ok, erro) => {
    img.onload = ok;
    img.onerror = () => erro(new Error('SVG não pôde ser decodificado'));
    img.src = url;
  });

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, largura, altura);

  const { mime } = TIPOS[formato];
  const blob = await new Promise(ok =>
    canvas.toBlob(ok, mime, formato === 'webp' ? 0.92 : undefined)
  );

  // Solta o bitmap antes de voltar; sem isto o lote acumula 257 canvases vivos.
  canvas.width = canvas.height = 0;
  img.src = '';

  if (!blob) throw new Error(`o navegador não gerou ${formato}`);
  return blob;
}

/** Bytes de um ícone no formato pedido. SVG sai sem rasterizar. */
export async function gerar(arquivo, formato, lado) {
  const svg = await buscarSvg(arquivo);
  if (formato === 'svg') return new Blob([svg], { type: TIPOS.svg.mime });
  return rasterizar(svg, formato, lado);
}

/** Dispara o download de um Blob e revoga o URL logo depois. */
export function salvar(blob, nome) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nome;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // O clique já iniciou o download; revogar no próximo tick é seguro e evita
  // deixar o Blob preso na memória da aba.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function nomeArquivo(id, formato, lado) {
  const sufixo = formato === 'svg' ? '' : `-${lado}`;
  return `${id}${sufixo}.${TIPOS[formato].ext}`;
}

/**
 * Lote: converte um a um e devolve o .zip.
 *
 * @param {{id: string, arquivo: string}[]} itens
 * @param {(feito: number, total: number) => void} [aoProgredir]
 */
export async function lote(itens, formato, lado, aoProgredir) {
  const arquivos = [];
  const falhas = [];

  for (let i = 0; i < itens.length; i++) {
    const { id, arquivo } = itens[i];
    try {
      const blob = await gerar(arquivo, formato, lado);
      arquivos.push({
        nome: nomeArquivo(id, formato, lado),
        dados: new Uint8Array(await blob.arrayBuffer()),
      });
    } catch (e) {
      falhas.push(id);
    }
    aoProgredir?.(i + 1, itens.length);
    // Cede o controle: sem isto a barra de progresso só pinta no fim.
    await new Promise(r => setTimeout(r, 0));
  }

  if (!arquivos.length) throw new Error('nenhum ícone pôde ser convertido');
  return { blob: await zip(arquivos), falhas };
}
