import { catalogo, normalizar, arquivoDe } from './dados.js';
import { temaAtual, aoMudarTema } from './tema.js';
import { assetUrl } from './assets.js';
import { copiar } from './toast.js';

/** A galeria instancia imagens animadas apenas na interação, via animacao.js. */
export async function iniciarGaleria() {
  const grid = document.getElementById('motion-grid');
  const search = document.getElementById('motion-search');
  const category = document.getElementById('motion-category');
  const iconChoice = document.getElementById('motion-icon');
  const count = document.getElementById('motion-count');
  const error = document.getElementById('motion-error');
  const collectionButtons = [
    ...document.querySelectorAll('[data-motion-collection]'),
  ];
  let collection =
    new URL(location.href).searchParams.get('colecao') === 'arsenal'
      ? 'arsenal'
      : '';
  let data,
    icons,
    pinned = null;
  const element = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  };
  const urlFor = (model, icon) => {
    const url = new URL('/icons', location.origin);
    url.searchParams.set('i', icon.id);
    url.searchParams.set('t', temaAtual());
    url.searchParams.set('animation', 'true');
    url.searchParams.set('model', model.id);
    return assetUrl(url.href);
  };
  const arsenalUrl = () => {
    const url = new URL('/icons', location.origin);
    url.searchParams.set(
      'i',
      data.collections.arsenal.groups.flatMap(g => g.ids).join(',')
    );
    url.searchParams.set('animation', 'true');
    url.searchParams.set('t', temaAtual());
    url.searchParams.set('perline', '8');
    return assetUrl(url.href);
  };
  function render() {
    if (!data || !icons) return;
    const q = normalizar(search.value.trim());
    const chosen = icons.find(i => i.id === iconChoice.value);
    const models = data.models.filter(
      m =>
        (!collection || m.collections?.includes(collection)) &&
        (!category.value || m.category === category.value) &&
        normalizar(
          `${m.title} ${m.concept} ${m.icon} ${icons.find(i => i.id === m.icon)?.alias.join(' ') ?? ''} ${data.categories[m.category]}`
        ).includes(q)
    );
    if (collection) {
      const order = data.collections[collection].groups.flatMap(g => g.ids);
      models.sort((a, b) => order.indexOf(a.icon) - order.indexOf(b.icon));
    }
    for (const b of collectionButtons)
      b.setAttribute(
        'aria-pressed',
        String(b.dataset.motionCollection === collection)
      );
    const arsenal = data.collections.arsenal;
    const brands = arsenal.groups.find(g => g.id === 'marca').ids.length;
    document.getElementById('motion-collection-description').textContent =
      collection
        ? `${arsenal.count - brands} tecnologias e ${brands} ícones da sua marca. Cada um tem uma animação padrão exclusiva, já aplicada nas URLs com animation=true.`
        : 'Explore todos os modelos ou compare diferentes movimentos com o mesmo ícone.';
    document.getElementById('motion-arsenal-actions').hidden =
      collection !== 'arsenal';
    document.getElementById('motion-download-arsenal').href = arsenalUrl();
    grid.replaceChildren();
    for (const model of models) {
      const icon = chosen ?? icons.find(i => i.id === model.icon);
      const card = element('article', 'motion-card');
      card.dataset.model = model.id;
      const top = element('div', 'motion-card-top');
      top.append(
        element('span', 't-label', data.categories[model.category]),
        element(
          'span',
          'motion-number',
          String(data.models.indexOf(model) + 1).padStart(2, '0')
        )
      );
      const preview = element('button', 'motion-preview');
      preview.type = 'button';
      preview.setAttribute('aria-pressed', String(pinned === model.id));
      preview.setAttribute(
        'aria-label',
        `${pinned === model.id ? 'Parar' : 'Fixar'} prévia: ${model.title}`
      );
      const img = element('img');
      img.width = 168;
      img.height = 168;
      img.alt = '';
      img.loading = 'lazy';
      img.src = assetUrl(`/svg/${arquivoDe(icon, temaAtual())}`);
      img.dataset.motionSrc = chosen
        ? urlFor(model, icon)
        : assetUrl(`/motion/${model.id}-${temaAtual()}.svg`);
      preview.append(
        img,
        element(
          'span',
          'motion-preview-caption',
          `${icon.id} · ${pinned === model.id ? 'parar prévia' : 'fixar prévia'}`
        )
      );
      preview.addEventListener('click', () => {
        pinned = pinned === model.id ? null : model.id;
        for (const b of grid.querySelectorAll('.motion-preview')) {
          const id = b.closest('[data-model]').dataset.model;
          const selected = id === pinned;
          b.setAttribute('aria-pressed', String(selected));
          const meta = data.models.find(m => m.id === id);
          b.setAttribute(
            'aria-label',
            `${selected ? 'Parar' : 'Fixar'} prévia: ${meta.title}`
          );
          b.querySelector('.motion-preview-caption').textContent =
            `${chosen?.id ?? meta.icon} · ${selected ? 'parar prévia' : 'fixar prévia'}`;
        }
      });
      const details = element('div', 'motion-card-details');
      details.append(
        element('h3', 't-h3', model.title),
        element('p', 'motion-concept', model.concept)
      );
      const actions = element('div', 'motion-card-actions');
      const copy = element('button', 'btn btn-sm btn-ghost', 'Copiar URL');
      copy.type = 'button';
      copy.addEventListener('click', () =>
        copiar(urlFor(model, icon), 'URL da animação copiada')
      );
      const download = element('a', 'btn btn-sm btn-ghost', 'Baixar SVG');
      download.href = chosen
        ? urlFor(model, icon)
        : assetUrl(`/motion/${model.id}-${temaAtual()}.svg`);
      download.download = `${icon.id}-${model.id}.svg`;
      actions.append(copy, download);
      details.append(actions);
      card.append(top, preview, details);
      grid.append(card);
    }
    const total = collection ? data.collections[collection].count : data.count;
    count.textContent = `${models.length} de ${total} modelos${chosen ? ` · comparando com ${chosen.id}` : ''}`;
    if (!models.length)
      grid.append(
        element(
          'p',
          'motion-empty',
          'Nenhum modelo encontrado. Experimente outra busca ou universo.'
        )
      );
  }
  async function load() {
    error.hidden = true;
    count.textContent = 'Carregando os modelos…';
    try {
      const [response, catalog] = await Promise.all([
        fetch(assetUrl('/animations.json')),
        catalogo(),
      ]);
      if (!response.ok) throw new Error('Biblioteca indisponível');
      data = await response.json();
      icons = catalog.icones;
      category.replaceChildren(
        new Option('Todos os universos', ''),
        ...Object.entries(data.categories).map(
          ([id, title]) => new Option(title, id)
        )
      );
      iconChoice.replaceChildren(
        new Option('Ícone sugerido por modelo', ''),
        ...icons.map(i => new Option(i.id, i.id))
      );
      render();
    } catch (e) {
      count.textContent = 'Biblioteca indisponível';
      error.hidden = false;
      console.error(e);
    }
  }
  for (const el of [search, category, iconChoice])
    el.addEventListener(el === search ? 'input' : 'change', () => {
      pinned = null;
      render();
    });
  for (const button of collectionButtons)
    button.addEventListener('click', () => {
      collection = button.dataset.motionCollection;
      pinned = null;
      category.value = '';
      search.value = '';
      iconChoice.value = '';
      const url = new URL(location.href);
      if (collection) url.searchParams.set('colecao', collection);
      else url.searchParams.delete('colecao');
      history.replaceState(null, '', url);
      render();
    });
  aoMudarTema(() => {
    if (data) render();
  });
  document
    .getElementById('motion-copy-arsenal')
    .addEventListener('click', () =>
      copiar(arsenalUrl(), 'URL do arsenal copiada')
    );
  document.getElementById('motion-retry').addEventListener('click', load);
  await load();
}
