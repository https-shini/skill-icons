/**
 * Carrega e indexa o catálogo. Uma requisição para /manifest.json, gerada no
 * build por scripts/vercel-assets.mjs, já com tema, categoria e apelidos.
 *
 * O índice de busca é o mesmo que a API usa para resolver `?i=`: os apelidos
 * vêm de `shortNames` em lib/icons.mjs, não de uma segunda lista escrita à mão
 * que divergiria na primeira adição.
 */
let cache;

export async function catalogo() {
  if (cache) return cache;
  const r = await fetch('/manifest.json');
  if (!r.ok) throw new Error(`manifest indisponível (${r.status})`);
  const dados = await r.json();

  const titulos = new Map(dados.categorias.map(c => [c.slug, c.titulo]));
  const icones = dados.icons.map(i => ({
    ...i,
    categoria: titulos.get(i.cat) ?? i.cat,
    busca: normalizar([i.id, ...i.alias, titulos.get(i.cat) ?? ''].join(' ')),
  }));

  cache = { icones, categorias: dados.categorias, total: dados.count };
  return cache;
}

/** Sem acento e em minúsculas, para "césar" achar "cesar" e vice-versa. */
export function normalizar(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Busca por nome parcial, apelido e categoria, ordenada por relevância.
 *
 * A ordem importa mais do que parece: digitar "js" tem de trazer `javascript`
 * antes de `nextjs` e `discordjs`, senão o apelido fica inútil.
 */
export function buscar(icones, termo, categoria = null) {
  const base = categoria ? icones.filter(i => i.cat === categoria) : icones;
  const q = normalizar(termo.trim());
  if (!q) return base;

  const pontuados = [];
  for (const i of base) {
    let p = 0;
    if (i.id === q) p = 100;
    else if (i.alias.includes(q)) p = 90;
    else if (i.id.startsWith(q)) p = 70;
    else if (i.alias.some(a => a.startsWith(q))) p = 60;
    else if (i.id.includes(q)) p = 40;
    else if (i.busca.includes(q)) p = 20;
    if (p) pontuados.push([p, i]);
  }
  return pontuados
    .sort((a, b) => b[0] - a[0] || a[1].id.localeCompare(b[1].id))
    .map(([, i]) => i);
}

/** Envolve as ocorrências do termo em <mark>, escapando o resto. */
export function destacar(texto, termo) {
  const escapado = texto.replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );
  const q = normalizar(termo.trim());
  if (!q) return escapado;
  const alvo = normalizar(escapado);
  const i = alvo.indexOf(q);
  if (i === -1) return escapado;
  return (
    escapado.slice(0, i) +
    '<mark>' +
    escapado.slice(i, i + q.length) +
    '</mark>' +
    escapado.slice(i + q.length)
  );
}

/** Nome do arquivo SVG do ícone no tema pedido. */
export function arquivoDe(icone, tema) {
  return tema === 'light' ? icone.light : icone.dark;
}
