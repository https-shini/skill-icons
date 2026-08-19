#!/usr/bin/env node
/**
 * Compõe as páginas estáticas: site/pages/*.html + site/partials/* -> public/.
 *
 * Por que existe: até aqui o site era um único public/index.html de 991 linhas
 * com o CSS e o JS inline. Com mais de uma página, cabeçalho e rodapé teriam de
 * ser copiados à mão em cada arquivo — e divergiriam na primeira alteração.
 *
 * Composição em build time, e não no cliente: o HTML chega pronto, sem salto de
 * layout e sem depender de JS para desenhar a navegação.
 *
 * Cada página declara seus metadados numa primeira linha de comentário:
 *
 *   <!--pagina {"titulo":"...","descricao":"...","nav":"builder"}-->
 *
 * `nav` marca qual link do cabeçalho recebe aria-current="page".
 */
import fs from 'node:fs';
import path from 'node:path';
import { iconNameList } from '../lib/icons.mjs';

const ROOT = path.join(import.meta.dirname, '..');
const SITE = path.join(ROOT, 'site');
const PUBLIC = path.join(ROOT, 'public');

const ler = (...p) => fs.readFileSync(path.join(...p), 'utf8');

const partials = {
  head: ler(SITE, 'partials', 'head.html'),
  header: ler(SITE, 'partials', 'header.html'),
  footer: ler(SITE, 'partials', 'footer.html'),
};

/**
 * O logotipo vira um <symbol> inline, com as cores trocadas por tokens.
 *
 * Antes era um <img> apontando para brand/wordmark-{tema}.svg, trocado por JS.
 * Dois problemas: em tema claro a página pintava com a variante escura (nome em
 * slate-50, invisível sobre fundo claro) até o script rodar, e eram duas
 * requisições por página. Como <symbol>, ele acompanha o tema pelo próprio CSS,
 * instantaneamente, e o rodapé o reaproveita com <use> sem custo nenhum.
 */
function simboloMarca() {
  const svg = ler(ROOT, 'brand', 'wordmark-dark.svg');
  const viewBox = svg.match(/viewBox="([^"]+)"/)[1];
  const corpo = svg
    .slice(svg.indexOf('>') + 1, svg.lastIndexOf('</svg>'))
    .replace(/fill="#f43f5e"/g, 'fill="var(--brand)"')
    .replace(/fill="#f8fafc"/g, 'fill="var(--text-1)"')
    .replace(/fill="#818cf8"/g, 'fill="var(--accent)"')
    // O fontTools emite coordenadas com toda a precisão de ponto flutuante
    // ("44.800000000000004"). Duas casas num viewBox de 704.8 já é abaixo de um
    // décimo de pixel na maior renderização da página, e corta 44% do arquivo.
    .replace(/-?\d+\.\d+/g, m => String(Math.round(parseFloat(m) * 100) / 100))
    .trim();
  return (
    `<svg style="display:none" aria-hidden="true">` +
    `<symbol id="marca-gcruz" viewBox="${viewBox}">${corpo}</symbol></svg>`
  );
}

const globais = {
  ano: String(new Date().getFullYear()),
  totalIcones: String(iconNameList.length),
  marca: simboloMarca(),
};

/** Troca {{chave}} pelos valores dados. Não recursivo de propósito. */
function preencher(texto, valores) {
  return texto.replace(/\{\{(\w+)\}\}/g, (m, chave) =>
    chave in valores ? valores[chave] : m
  );
}

/** Marca o link de navegação da página atual, no cabeçalho e no drawer. */
function marcarNav(html, nav) {
  if (!nav) return html;
  return html.replaceAll(
    `data-nav="${nav}"`,
    `data-nav="${nav}" aria-current="page"`
  );
}

function copiarDir(de, para) {
  fs.rmSync(para, { recursive: true, force: true });
  fs.cpSync(de, para, { recursive: true });
  return fs.readdirSync(para).length;
}

/**
 * Junta os quatro CSS num arquivo só e tira os comentários.
 *
 * A ordem importa: tokens define as variáveis que os outros três consomem.
 *
 * São 4 requisições a menos e, medido, 8027 -> 5311 B gzip: arquivos pequenos
 * comprimidos em separado repetem o dicionário, e os comentários deste projeto
 * são longos de propósito. Eles seguem no fonte, em site/css/, que é onde se
 * lê e se edita — public/ é saída de build.
 */
const ORDEM_CSS = ['tokens', 'base', 'components', 'paginas'];

function juntarCss(destino) {
  const junto = ORDEM_CSS.map(n => ler(SITE, 'css', `${n}.css`)).join('\n');
  const enxuto = junto
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, enxuto + '\n');
  return enxuto.length;
}

/** Escapa texto que vai virar HTML. */
function escapar(s) {
  return s.replace(
    /[&<>"]/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]
  );
}

/**
 * Renderiza site/changelog.json na marcação que a página do changelog espera.
 *
 * `versao` é escapado — títulos como "Badge <gc/>" seriam parseados como tag
 * desconhecida e sumiriam da página. `descricao` NÃO é: ali a marcação é
 * intencional (<code>, <em>), e o arquivo é nosso, não entrada de usuário.
 */
function changelog() {
  const dados = JSON.parse(ler(SITE, 'changelog.json'));
  const rotulo = {
    added: ['Adicionado', 'ok'],
    changed: ['Alterado', 'info'],
    fixed: ['Corrigido', 'warn'],
    removed: ['Removido', 'err'],
  };
  return dados
    .map(entrada => {
      const itens = entrada.mudancas
        .map(m => {
          const [texto, cor] = rotulo[m.tipo] ?? ['Outro', 'info'];
          return `
          <li>
            <span class="cl-tipo" data-cor="${cor}">${texto}</span>
            <span>${m.descricao}</span>
          </li>`;
        })
        .join('');
      return `
      <article class="cl-entrada">
        <div class="cl-meta">
          <h2 class="t-h3">${escapar(entrada.versao)}</h2>
          <time class="t-label" datetime="${entrada.data}">${entrada.data}</time>
        </div>
        <ul class="cl-lista">${itens}
        </ul>
      </article>`;
    })
    .join('\n');
}

const paginas = fs
  .readdirSync(path.join(SITE, 'pages'))
  .filter(f => f.endsWith('.html'));

fs.mkdirSync(PUBLIC, { recursive: true });

const escritas = [];
for (const arquivo of paginas) {
  const bruto = ler(SITE, 'pages', arquivo);
  const meta = bruto.match(/^<!--pagina\s+([\s\S]*?)-->\n?/);
  if (!meta)
    throw new Error(
      `site/pages/${arquivo} não declara <!--pagina {...}--> na primeira linha`
    );

  const { titulo, descricao, nav } = JSON.parse(meta[1]);
  const corpo = bruto.slice(meta[0].length);
  const valores = { ...globais, titulo, descricao };

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
${preencher(partials.head, valores)
  .trimEnd()
  .split('\n')
  .map(l => (l ? '    ' + l : l))
  .join('\n')}
  </head>
  <body>
    ${globais.marca}
${marcarNav(preencher(partials.header, valores), nav)}
    <main id="conteudo">
${preencher(corpo.replace('{{changelog}}', changelog), valores).trimEnd()}
    </main>
${marcarNav(preencher(partials.footer, valores), nav)}
  </body>
</html>
`;

  fs.writeFileSync(path.join(PUBLIC, arquivo), html);
  escritas.push(arquivo);
}

fs.rmSync(path.join(PUBLIC, 'css'), { recursive: true, force: true });
const css = juntarCss(path.join(PUBLIC, 'css', 'site.css'));
const js = copiarDir(path.join(SITE, 'js'), path.join(PUBLIC, 'js'));
const fontes = copiarDir(path.join(SITE, 'fonts'), path.join(PUBLIC, 'fonts'));

console.log(
  `public/: ${escritas.length} páginas (${escritas.join(', ')}) + ` +
    `css ${css}B + ${js} js + ${fontes} fontes`
);
