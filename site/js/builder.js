/**
 * Montador: busca, seleção, preview ao vivo, exportação e download.
 *
 * A seleção é a única fonte de estado; preview, snippets e download derivam
 * dela. Tudo persiste em localStorage para não perder progresso no reload.
 */
import { catalogo, buscar, destacar, arquivoDe } from './dados.js';
import { store } from './store.js';
import { toast, copiar } from './toast.js';
import { temaAtual, aoMudarTema } from './tema.js';
import { gerar, lote, salvar, nomeArquivo } from './download.js';

const TAMANHOS = [64, 128, 256, 512];
const MIN_LADO = 16;
const MAX_LADO = 1024;

const $ = s => document.querySelector(s);

export async function iniciarBuilder() {
  const raiz = $('#montador');
  if (!raiz) return;

  const { icones, categorias } = await catalogo();
  const porId = new Map(icones.map(i => [i.id, i]));

  const estado = {
    selecao: store.getJSON('selecao', []).filter(id => porId.has(id)),
    termo: '',
    categoria: store.get('categoria', '') || null,
    perline: Number(store.get('perline', '15')) || 15,
    formato: store.get('formato', 'svg'),
    lado: Number(store.get('lado', '256')) || 256,
  };

  const el = {
    busca: $('#busca'),
    filtros: $('#filtros'),
    contador: $('#contador'),
    resultados: $('#resultados'),
    escolhidos: $('#escolhidos'),
    resumo: $('#resumo-selecao'),
    limpar: $('#limpar'),
    perline: $('#perline'),
    preview: $('#preview'),
    saida: $('#saida'),
    formato: $('#formato'),
    lado: $('#lado'),
    presets: $('#presets'),
    baixarLote: $('#baixar-lote'),
    progresso: $('#progresso'),
  };

  let formatoSaida = 'markdown';
  let ativo = 0; // índice do tile com tabindex=0 (roving tabindex)

  /* ------------------------------------------------------------ filtros */

  el.filtros.innerHTML =
    `<button class="chip" type="button" data-cat="" aria-pressed="true">Todas</button>` +
    categorias
      .map(
        c =>
          `<button class="chip" type="button" data-cat="${c.slug}" aria-pressed="false">${c.titulo.replace(/`/g, '')}</button>`
      )
      .join('');

  el.filtros.addEventListener('click', e => {
    const chip = e.target.closest('[data-cat]');
    if (!chip) return;
    estado.categoria = chip.dataset.cat || null;
    store.set('categoria', estado.categoria ?? '');
    for (const c of el.filtros.children)
      c.setAttribute(
        'aria-pressed',
        String((c.dataset.cat || null) === estado.categoria)
      );
    renderResultados();
  });

  /* ------------------------------------------------------------- busca */

  el.busca.addEventListener('input', () => {
    estado.termo = el.busca.value;
    ativo = 0;
    renderResultados();
  });

  // "/" foca a busca de qualquer lugar da página, como no GitHub.
  document.addEventListener('keydown', e => {
    if (e.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) {
      e.preventDefault();
      el.busca.focus();
    }
  });

  /* --------------------------------------------------------- resultados */

  function visiveis() {
    return buscar(icones, estado.termo, estado.categoria);
  }

  function renderResultados() {
    const lista = visiveis();
    const tema = temaAtual();

    el.contador.textContent =
      lista.length === icones.length
        ? `${icones.length} ícones disponíveis`
        : `${lista.length} de ${icones.length} ${lista.length === 1 ? 'ícone' : 'ícones'}`;

    if (!lista.length) {
      el.resultados.innerHTML = `<p class="vazio t-small">Nenhum ícone para “${el.busca.value}”. Tente o nome da tecnologia ou um apelido como <code>js</code>, <code>k8s</code>, <code>ps</code>.</p>`;
      return;
    }

    el.resultados.innerHTML = lista
      .map((i, n) => {
        const sel = estado.selecao.includes(i.id);
        return `<button
            class="tile"
            type="button"
            role="checkbox"
            aria-checked="${sel}"
            aria-label="${i.id} — ${i.categoria.replace(/`/g, '')}"
            data-id="${i.id}"
            tabindex="${n === ativo ? 0 : -1}"
          >
            <img src="/svg/${arquivoDe(i, tema)}" alt="" width="48" height="48" loading="lazy" decoding="async" />
            <span class="tile-id">${destacar(i.id, estado.termo)}</span>
          </button>`;
      })
      .join('');
  }

  el.resultados.addEventListener('click', e => {
    const tile = e.target.closest('[data-id]');
    if (tile) alternar(tile.dataset.id);
  });

  /* Navegação por teclado na grade: um só tabindex=0 percorrendo a lista, para
     a tecla Tab não ter de atravessar 257 botões antes de sair da seção. */
  el.resultados.addEventListener('keydown', e => {
    const tiles = [...el.resultados.querySelectorAll('.tile')];
    if (!tiles.length) return;
    const atual = tiles.indexOf(document.activeElement);
    if (atual === -1) return;

    const colunas = Math.max(
      1,
      Math.round(el.resultados.clientWidth / (tiles[0].offsetWidth || 1))
    );
    const destino = {
      ArrowRight: atual + 1,
      ArrowLeft: atual - 1,
      ArrowDown: atual + colunas,
      ArrowUp: atual - colunas,
      Home: 0,
      End: tiles.length - 1,
    }[e.key];

    if (destino === undefined) return;
    e.preventDefault();
    const alvo = Math.min(tiles.length - 1, Math.max(0, destino));
    tiles[atual].tabIndex = -1;
    tiles[alvo].tabIndex = 0;
    tiles[alvo].focus();
    ativo = alvo;
  });

  /* ----------------------------------------------------------- seleção */

  function alternar(id) {
    const i = estado.selecao.indexOf(id);
    if (i === -1) estado.selecao.push(id);
    else estado.selecao.splice(i, 1);
    store.setJSON('selecao', estado.selecao);
    atualizarMarcas();
    renderSelecao();
    renderSaida();
  }

  function atualizarMarcas() {
    for (const t of el.resultados.querySelectorAll('[data-id]'))
      t.setAttribute(
        'aria-checked',
        String(estado.selecao.includes(t.dataset.id))
      );
  }

  function renderSelecao() {
    const n = estado.selecao.length;
    el.resumo.textContent = n
      ? `${n} ${n === 1 ? 'ícone selecionado' : 'ícones selecionados'}`
      : 'Nenhum ícone selecionado ainda';
    el.limpar.disabled = !n;
    el.baixarLote.disabled = !n;

    el.escolhidos.innerHTML = estado.selecao
      .map(
        id =>
          `<button class="chip" type="button" data-remove="${id}" aria-label="Remover ${id} da seleção">${id}<span class="x" aria-hidden="true">×</span></button>`
      )
      .join('');
  }

  el.escolhidos.addEventListener('click', e => {
    const chip = e.target.closest('[data-remove]');
    if (chip) alternar(chip.dataset.remove);
  });

  el.limpar.addEventListener('click', () => {
    estado.selecao = [];
    store.setJSON('selecao', []);
    atualizarMarcas();
    renderSelecao();
    renderSaida();
    toast('Seleção limpa');
  });

  /* -------------------------------------------- preview e exportação */

  el.perline.value = String(estado.perline);
  el.perline.addEventListener('input', () => {
    const v = Number(el.perline.value);
    if (!Number.isInteger(v) || v < 1 || v > 50) return;
    estado.perline = v;
    store.set('perline', String(v));
    renderSaida();
  });

  /**
   * Monta a query à mão em vez de usar URLSearchParams: ele percent-encoda a
   * vírgula (`i=js%2Cts`), e o snippet copiado precisa ficar legível — é o que
   * a pessoa vai ler no diff do README dela.
   */
  function url() {
    const p = [`i=${estado.selecao.join(',')}`];
    const tema = temaAtual();
    if (tema === 'light') p.push('theme=light');
    if (estado.perline !== 15) p.push(`perline=${estado.perline}`);
    return `${location.origin}/icons?${p.join('&')}`;
  }

  function snippet() {
    const u = url();
    const site = location.origin;
    if (formatoSaida === 'markdown') return `[![Minhas skills](${u})](${site})`;
    if (formatoSaida === 'html')
      return `<a href="${site}">\n  <img src="${u}" alt="Minhas skills" />\n</a>`;
    return u;
  }

  function renderSaida() {
    const vazio = !estado.selecao.length;
    el.preview.innerHTML = vazio
      ? `<p class="t-small vazio">O preview aparece assim que você escolher o primeiro ícone.</p>`
      : `<img src="${url()}" alt="Preview dos ícones selecionados" />`;
    el.saida.textContent = vazio ? '// escolha ao menos um ícone' : snippet();
  }

  for (const tab of document.querySelectorAll('[data-saida]'))
    tab.addEventListener('click', () => {
      formatoSaida = tab.dataset.saida;
      for (const t of document.querySelectorAll('[data-saida]'))
        t.setAttribute('aria-selected', String(t === tab));
      renderSaida();
    });

  $('#copiar-saida').addEventListener('click', () => {
    if (!estado.selecao.length) return toast('Nada para copiar', 'err');
    copiar(snippet(), 'Snippet copiado');
  });

  /* ---------------------------------------------------------- download */

  el.presets.innerHTML = TAMANHOS.map(
    t =>
      `<button class="chip" type="button" data-lado="${t}" aria-pressed="${t === estado.lado}">${t}px</button>`
  ).join('');

  el.lado.value = String(estado.lado);

  function definirLado(v) {
    const n = Math.min(
      MAX_LADO,
      Math.max(MIN_LADO, Math.round(Number(v) || 0))
    );
    estado.lado = n;
    el.lado.value = String(n);
    store.set('lado', String(n));
    for (const c of el.presets.children)
      c.setAttribute('aria-pressed', String(Number(c.dataset.lado) === n));
  }

  el.presets.addEventListener('click', e => {
    const chip = e.target.closest('[data-lado]');
    if (chip) definirLado(chip.dataset.lado);
  });
  el.lado.addEventListener('change', () => definirLado(el.lado.value));

  function aplicarFormato() {
    const raster = estado.formato !== 'svg';
    // Resolução não significa nada para SVG; desabilitar é mais honesto do que
    // deixar o campo ativo sem efeito.
    el.lado.disabled = !raster;
    for (const c of el.presets.children) c.disabled = !raster;
    el.presets.closest('.field').dataset.inativo = String(!raster);
  }

  el.formato.value = estado.formato;
  el.formato.addEventListener('change', () => {
    estado.formato = el.formato.value;
    store.set('formato', estado.formato);
    aplicarFormato();
  });
  aplicarFormato();

  el.baixarLote.addEventListener('click', async () => {
    if (!estado.selecao.length) return;
    const tema = temaAtual();
    const itens = estado.selecao.map(id => ({
      id,
      arquivo: arquivoDe(porId.get(id), tema),
    }));

    // Um ícone só não precisa de zip — devolve o arquivo direto.
    if (itens.length === 1) {
      try {
        const blob = await gerar(itens[0].arquivo, estado.formato, estado.lado);
        salvar(blob, nomeArquivo(itens[0].id, estado.formato, estado.lado));
        toast('Ícone baixado');
      } catch (e) {
        toast(e.message, 'err');
      }
      return;
    }

    el.baixarLote.dataset.loading = 'true';
    el.progresso.hidden = false;
    try {
      const { blob, falhas } = await lote(
        itens,
        estado.formato,
        estado.lado,
        (feito, total) => {
          el.progresso.value = feito;
          el.progresso.max = total;
          el.progresso.textContent = `${feito} de ${total}`;
        }
      );
      salvar(blob, `skill-icons-${estado.formato}-${itens.length}.zip`);
      toast(
        falhas.length
          ? `${itens.length - falhas.length} ícones no .zip; falhou: ${falhas.join(', ')}`
          : `${itens.length} ícones no .zip`,
        falhas.length ? 'err' : 'ok'
      );
    } catch (e) {
      toast(e.message, 'err');
    } finally {
      delete el.baixarLote.dataset.loading;
      el.progresso.hidden = true;
    }
  });

  /* --------------------------------------------------------- arranque */

  // O preview e os tiles seguem o tema; o snippet também, porque `theme=light`
  // entra na URL.
  aoMudarTema(() => {
    renderResultados();
    renderSaida();
  });

  renderResultados();
  renderSelecao();
  renderSaida();
}
