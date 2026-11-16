<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/text-logo.svg">
    <img width="280" src="./.github/text-logo-light.svg" alt="Skill Icons">
  </picture>
</p>

<h3 align="center">Ícones de tecnologias em um único SVG, para README, portfólio e currículo</h3>

<p align="center">
  Fork de <a href="https://github.com/tandpfun/skill-icons">tandpfun/skill-icons</a> mantido por <a href="https://gcruz.dev.br">gcruz.dev</a> ·
  <strong>270 ícones</strong> · 19 categorias · temas claro e escuro · 85 animações
</p>

<div align="center">

[![Site](https://img.shields.io/badge/Site-icons.gcruz.dev.br-4f46e5?style=for-the-badge)](https://icons.gcruz.dev.br)
[![CI](https://img.shields.io/github/actions/workflow/status/https-shini/skill-icons/wrangler-action.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/https-shini/skill-icons/actions/workflows/wrangler-action.yml)
[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green?style=for-the-badge)](LICENSE)

</div>

![Montador do site: busca, ícones selecionados, preview ao vivo e snippet em Markdown](docs/images/cover.webp)

<p align="center">
  <a href="https://icons.gcruz.dev.br"><strong>Acessar o site</strong></a> ·
  <a href="#referência-da-api">Referência da API</a> ·
  <a href="#lista-de-ícones">Lista de ícones</a> ·
  <a href="DEPLOY.md">Publicar a sua instância</a>
</p>

---

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Problema e proposta](#problema-e-proposta)
- [Funcionalidades](#funcionalidades)
- [Capturas de tela](#capturas-de-tela)
- [Tecnologias](#tecnologias)
- [Como usar](#como-usar)
- [Referência da API](#referência-da-api)
- [Ícones da marca `<gcruz.dev/>`](#ícones-da-marca-gcruzdev)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução local](#instalação-e-execução-local)
- [Testes e validações](#testes-e-validações)
- [Build e deploy](#build-e-deploy)
- [Lista de ícones](#lista-de-ícones)
- [Adicionar um ícone](#adicionar-um-ícone)
- [Documentação complementar](#documentação-complementar)
- [Créditos e licença](#créditos-e-licença)

## Sobre o projeto

O Skill Icons gera, a partir de uma única URL, um SVG com vários ícones de tecnologias lado a lado — pronto para ser colado em um README do GitHub, num portfólio ou num currículo. Uma requisição devolve o badge completo; não é preciso versionar imagens nem montar nada à mão.

Este fork amplia o projeto original com 270 IDs (459 arquivos SVG, 189 deles com par claro/escuro), 81 aliases, 19 categorias, uma biblioteca de 85 animações vetoriais e um site estático para buscar, montar, copiar e baixar os ícones. Os ícones adicionados aqui — como `oracle`, `sql`, `jwt`, `render` e os da marca `gcruz` — não existem no domínio oficial `skillicons.dev`.

## Problema e proposta

Exibir a stack de um desenvolvedor costuma exigir dezenas de imagens soltas, cada uma com tamanho, fundo e estilo diferentes. O Skill Icons padroniza todos os ícones (mesmo _viewBox_, raio e área útil) e os compõe no servidor em um único SVG, com tema e quantidade por linha configuráveis pela própria URL.

## Funcionalidades

- **Composição por URL** — `/icons?i=ts,react,nodejs` devolve um único SVG com os ícones na ordem pedida.
- **Temas claro e escuro** — `theme=light|dark` para os 189 ícones com par; os demais usam a cor da própria marca.
- **Layout configurável** — `perline` de 1 a 50 ícones por linha (padrão 15).
- **Animações vetoriais opcionais** — `animation=true` aplica uma de 85 animações em 8 universos; `model=` escolhe o modelo. Sem o parâmetro, a saída é estática.
- **Site com montador** — busca por nome, alias ou categoria, preview ao vivo e snippets em Markdown, HTML e URL.
- **Download no navegador** — SVG, PNG ou WebP, um arquivo ou um `.zip` com a seleção, sem endpoint extra.
- Catálogo por categoria, galeria de animações, página da marca, design system e changelog.
- 81 aliases de nome curto (`js`, `ts`, `py`, `k8s`…) e erros `400` que identificam o parâmetro inválido.
- Duas plataformas de publicação a partir do mesmo código: Vercel e Cloudflare Workers.

## Capturas de tela

|                            Página inicial                            |                                    Saída real da API                                     |
| :------------------------------------------------------------------: | :--------------------------------------------------------------------------------------: |
| ![Página inicial do site com o montador](docs/images/01-inicio.webp) | ![SVG devolvido pela API nos temas escuro e claro](docs/images/02-resultado-da-api.webp) |
|                             **Catálogo**                             |                                 **Galeria de animações**                                 |
|  ![Catálogo de ícones por categoria](docs/images/03-catalogo.webp)   |        ![Laboratório de movimento com 85 modelos](docs/images/04-animacoes.webp)         |
|                              **Marca**                               |                                    **Design system**                                     |
|  ![Página da marca gcruz.dev com tokens](docs/images/05-marca.webp)  |    ![Design system com tokens de cor e contraste](docs/images/06-design-system.webp)     |
|                            **Tema claro**                            |                                       **Celular**                                        |
|   ![Página inicial no tema claro](docs/images/07-tema-claro.webp)    |  <img src="docs/images/mobile-inicio.webp" alt="Página inicial no celular" width="260">  |

> Capturas do site publicado em [icons.gcruz.dev.br](https://icons.gcruz.dev.br).

## Tecnologias

- **JavaScript (ESM)** — lógica de resolução de nomes, composição do SVG e animações (`lib/`).
- **SVG** — ícones normalizados em `256 × 256` e saída composta.
- **Vercel Functions** — entradas da API em `api/*.mjs` e site estático em `public/`.
- **Cloudflare Workers** — entrada alternativa em `index.js`, publicada com **Wrangler**.
- **HTML/CSS** — site estático sem framework, composto em build a partir de `site/`.
- **node:test** — testes do catálogo, do montador e das animações.
- **Playwright** — verificações do site, de responsividade e visuais das animações.
- **Prettier** — formatação.
- **GitHub Actions** — validação do catálogo, contraste, normalização, testes, build e deploy no Workers.

## Como usar

Liste os IDs separados por vírgula no parâmetro `i` (ou `icons`):

```md
[![Minhas skills](https://icons.gcruz.dev.br/icons?i=js,html,css,wasm)](https://gcruz.dev.br)
```

<p>
  <img src="./icons/JavaScript.svg" width="48">
  <img src="./icons/HTML.svg" width="48">
  <img src="./icons/CSS.svg" width="48">
  <img src="./icons/WebAssembly.svg" width="48">
</p>

**Tema** — `theme` (ou `t`) define o fundo do badge; o padrão é `dark`:

```md
[![Minhas skills](https://icons.gcruz.dev.br/icons?i=java,kotlin,nodejs,figma&theme=light)](https://gcruz.dev.br)
```

<p>
  <img src="./icons/Java-Light.svg" width="48">
  <img src="./icons/Kotlin-Light.svg" width="48">
  <img src="./icons/NodeJS-Light.svg" width="48">
  <img src="./icons/Figma-Light.svg" width="48">
</p>

**Ícones por linha** — `perline` aceita de 1 a 50:

```md
[![Minhas skills](https://icons.gcruz.dev.br/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)](https://gcruz.dev.br)
```

**Centralizar** — o SVG se redimensiona sozinho; qualquer técnica de centralização de imagem funciona:

```html
<p align="center">
  <a href="https://gcruz.dev.br">
    <img src="https://icons.gcruz.dev.br/icons?i=git,kubernetes,docker,c,vim" />
  </a>
</p>
```

**Animações** — opcionais e restritas ao SVG (PNG e WebP são estáticos):

```text
https://icons.gcruz.dev.br/icons?i=react,ts,python&animation=true
https://icons.gcruz.dev.br/icons?i=gemini&animation=true&model=explosao-reconstroi
```

O movimento pausa fora da área visível e respeita `prefers-reduced-motion`. A galeria em [icons.gcruz.dev.br/animacoes](https://icons.gcruz.dev.br/animacoes) permite comparar modelos com qualquer ícone.

> [!IMPORTANT]
> `icons.gcruz.dev.br` é a instância **deste fork**. Para usar na sua própria infraestrutura, publique uma instância seguindo o [DEPLOY.md](DEPLOY.md) e troque o domínio nos exemplos.

## Referência da API

| Rota                   | Devolve                                                    |
| :--------------------- | :--------------------------------------------------------- |
| `/icons?i=js,html`     | O SVG composto. Aceita `i` ou `icons`                      |
| `/icons?i=all`         | Todos os ícones                                            |
| `&theme=light`         | Fundo claro nos ícones com par. Padrão `dark`. Aceita `t`  |
| `&perline=9`           | Ícones por linha, de 1 a 50. Padrão 15                     |
| `&animation=true`      | Versão animada; `&model=<id>` escolhe o modelo             |
| `/api/icons`           | JSON com a lista de IDs                                    |
| `/api/manifest`        | JSON com ID, existência de tema e arquivo de cada variante |
| `/api/svgs`            | JSON com todos os SVGs crus                                |
| `/api/animations`      | JSON com os modelos de animação e seus conceitos           |
| `/svg/<Arquivo>.svg`   | O SVG individual, estático e em cache na CDN               |
| `/brand/<arquivo>.svg` | Os assets da marca                                         |

| Requisição inválida | Resposta                          |
| :------------------ | :-------------------------------- |
| `?i=js,naoexiste`   | `400 Unknown icon: naoexiste`     |
| `?perline=0`        | `400` — fora do intervalo 1–50    |
| `?theme=azul`       | `400` — apenas `dark` ou `light`  |
| `/icons` sem `i`    | `400` — nenhum ícone especificado |

Os aliases ficam em `ICON_ALIASES`, em [`lib/catalog.mjs`](lib/catalog.mjs).

## Ícones da marca `<gcruz.dev/>`

A marca é tipográfica, em JetBrains Mono convertida em `<path>`, e três IDs estão disponíveis na API como qualquer outro ícone:

| ID      | Exibe          | Legível a partir de | Uso                                     |
| :------ | :------------- | :------------------ | :-------------------------------------- |
| `gcruz` | `<gcruz/>`     | 48 px               | Badge principal, com o nome por extenso |
| `gctag` | `<gc/>`        | 24 px               | Assinatura curta                        |
| `gc`    | monograma `gc` | 16 px               | Espaços mínimos                         |

```md
[![Stack](https://icons.gcruz.dev.br/icons?i=gctag,ts,react,nodejs&perline=4)](https://gcruz.dev.br)
```

Todos os assets, tokens, pesos e regras de uso estão em [`brand/`](brand/) e na especificação [`brand/README.md`](brand/README.md); a página [/marca](https://icons.gcruz.dev.br/marca) mostra as variações nos dois temas.

## Arquitetura

A mesma biblioteca (`lib/`) atende às duas plataformas. O build empacota os SVGs de `icons/` em `dist/`, e cada entrada (função da Vercel ou Worker) resolve nomes e aliases, valida os parâmetros e concatena os ícones em um SVG com grade calculada por `perline`.

```text
icons/*.svg ──► build.js ──► dist/icons.{json,mjs}
                                 │
              ┌──────────────────┴──────────────────┐
              ▼                                     ▼
       api/*.mjs (Vercel)                   index.js (Cloudflare Worker)
              └──────────────► lib/icons.mjs ◄──────┘
                         resolução, validação e composição
                         lib/animation.mjs + motion-*.mjs (animações)

site/ (pages, partials, css, js) ──► scripts/build-pages.mjs ──► public/
```

<details>
<summary><strong>Estrutura de diretórios</strong></summary>

```text
icons/                     os 270 ícones (459 arquivos, contando os pares de tema)
brand/                     assets e especificação da marca <gcruz.dev/>
lib/                       resolução, composição, catálogo e animações
api/*.mjs                  entradas da Vercel
index.js                   entrada do Cloudflare Worker
site/
  css/tokens.css           fonte única de cor, tipografia, espaço e movimento
  js/                      tema, busca, montador, download, zip e galeria
  partials/ · pages/       cabeçalho, rodapé e uma página por arquivo
  fonts/                   JetBrains Mono e IBM Plex Sans (auto-hospedadas)
scripts/                   build do site, tabela do README, contraste, normalização,
                           responsividade e verificações com Playwright
tests/                     testes do catálogo, dos assets e das animações
docs/                      planos, inventário, biblioteca de animações e capturas
public/                    saída do build (não editar à mão)
```

</details>

## Pré-requisitos

- **Node.js 24** (definido em `engines` e usado na CI) e **Yarn** ou **npm**.
- Para as verificações de navegador: Playwright com Chromium.
- Para publicar no Workers: conta na Cloudflare e **Wrangler** (instalado como dependência de desenvolvimento).

## Instalação e execução local

```bash
git clone https://github.com/https-shini/skill-icons.git
```

```bash
cd skill-icons
```

```bash
npm install
```

```bash
npm run dev:web
```

O comando gera o build e sobe o site em http://localhost:4173, reproduzindo o roteamento da Vercel. Para testar a versão Cloudflare Workers, use `npm run dev`.

O projeto não exige variáveis de ambiente para rodar nem para publicar na Vercel. O deploy automático no Workers usa os secrets `CF_API_TOKEN` e `CF_ACCOUNT_ID` do GitHub Actions, descritos no [DEPLOY.md](DEPLOY.md).

## Testes e validações

| Comando                      | O que faz                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| `npm test`                   | Build + testes do catálogo, dos assets e das animações (`node:test`)                          |
| `npm run readme:check`       | Confere se a lista de ícones deste README está em dia com `icons/`                            |
| `npm run contraste:check`    | Verifica o contraste dos tokens do site                                                       |
| `npm run icones:check`       | Verifica a normalização dos SVGs                                                              |
| `npm run test:web`           | Verifica o site no navegador (com o site local ativo)                                         |
| `npm run responsivo`         | Percorre as páginas em 15 larguras e 2 temas: sem rolagem horizontal e alvos de toque ≥ 44 px |
| `npm run test:motion:visual` | Verificação visual das animações                                                              |

Na última verificação, `npm test` executou **18 testes, todos aprovados**, e a lista de ícones estava em dia com os 270 IDs.

## Build e deploy

| Plataforma              | Comando             | Observações                                                                 |
| ----------------------- | ------------------- | --------------------------------------------------------------------------- |
| Vercel (produção atual) | `npm run build:web` | Saída em `public/`; `/icons` é reescrito para `/api/render` (`vercel.json`) |
| Cloudflare Workers      | `npm run deploy`    | Usa `wrangler.toml`; também é publicado pela CI ao fazer push na `main`     |

O passo a passo, com domínio próprio e limites de tamanho, está em [DEPLOY.md](DEPLOY.md).

## Lista de ícones

Tabela gerada a partir de [`icons/`](./icons) por
[`scripts/readme-table.mjs`](./scripts/readme-table.mjs). Para regenerar:
`npm run readme`. O CI roda `npm run readme:check` e falha se ela estiver
defasada.

### Marca `<gcruz.dev/>`

Os ícones da marca. Detalhes e assets em [Ícones da marca](#ícones-da-marca-gcruzdev).

| Icon ID |                     Icon                      |
| :-----: | :-------------------------------------------: |
|  `gc`   |  <img src="./icons/GC-Dark.svg" width="48">   |
| `gcruz` | <img src="./icons/GCruz-Dark.svg" width="48"> |
| `gctag` | <img src="./icons/GCTag-Dark.svg" width="48"> |

### Linguagens

|    Icon ID     |                         Icon                         |
| :------------: | :--------------------------------------------------: |
|   `aiscript`   |   <img src="./icons/AiScript-Dark.svg" width="48">   |
|     `bash`     |     <img src="./icons/Bash-Dark.svg" width="48">     |
|      `c`       |         <img src="./icons/C.svg" width="48">         |
|   `clojure`    |   <img src="./icons/Clojure-Dark.svg" width="48">    |
| `coffeescript` | <img src="./icons/CoffeeScript-Dark.svg" width="48"> |
|     `cpp`      |        <img src="./icons/CPP.svg" width="48">        |
|   `crystal`    |   <img src="./icons/Crystal-Dark.svg" width="48">    |
|      `cs`      |        <img src="./icons/CS.svg" width="48">         |
|     `dart`     |     <img src="./icons/Dart-Dark.svg" width="48">     |
|    `elixir`    |    <img src="./icons/Elixir-Dark.svg" width="48">    |
|    `forth`     |       <img src="./icons/Forth.svg" width="48">       |
|   `fortran`    |      <img src="./icons/Fortran.svg" width="48">      |
|   `gherkin`    |   <img src="./icons/Gherkin-Dark.svg" width="48">    |
|      `go`      |      <img src="./icons/GoLang.svg" width="48">       |
|   `haskell`    |   <img src="./icons/Haskell-Dark.svg" width="48">    |
|     `haxe`     |     <img src="./icons/Haxe-Dark.svg" width="48">     |
|     `java`     |     <img src="./icons/Java-Dark.svg" width="48">     |
|      `js`      |    <img src="./icons/JavaScript.svg" width="48">     |
|    `julia`     |    <img src="./icons/Julia-Dark.svg" width="48">     |
|    `kotlin`    |    <img src="./icons/Kotlin-Dark.svg" width="48">    |
|    `latex`     |    <img src="./icons/LaTeX-Dark.svg" width="48">     |
|     `lua`      |     <img src="./icons/Lua-Dark.svg" width="48">      |
|    `matlab`    |    <img src="./icons/Matlab-Dark.svg" width="48">    |
|      `md`      |   <img src="./icons/Markdown-Dark.svg" width="48">   |
|     `nim`      |     <img src="./icons/Nim-Dark.svg" width="48">      |
|    `ocaml`     |       <img src="./icons/OCaml.svg" width="48">       |
|    `octave`    |    <img src="./icons/Octave-Dark.svg" width="48">    |
|     `perl`     |       <img src="./icons/Perl.svg" width="48">        |
|     `php`      |     <img src="./icons/PHP-Dark.svg" width="48">      |
|     `pkl`      |     <img src="./icons/Pkl-Dark.svg" width="48">      |
|  `powershell`  |  <img src="./icons/Powershell-Dark.svg" width="48">  |
|      `py`      |    <img src="./icons/Python-Dark.svg" width="48">    |
|      `r`       |      <img src="./icons/R-Dark.svg" width="48">       |
|    `regex`     |    <img src="./icons/Regex-Dark.svg" width="48">     |
|     `ruby`     |       <img src="./icons/Ruby.svg" width="48">        |
|     `rust`     |       <img src="./icons/Rust.svg" width="48">        |
|    `scala`     |    <img src="./icons/Scala-Dark.svg" width="48">     |
|   `solidity`   |     <img src="./icons/Solidity.svg" width="48">      |
|     `svg`      |     <img src="./icons/SVG-Dark.svg" width="48">      |
|    `swift`     |       <img src="./icons/Swift.svg" width="48">       |
|      `ts`      |    <img src="./icons/TypeScript.svg" width="48">     |
|      `v`       |      <img src="./icons/V-Dark.svg" width="48">       |
|     `vala`     |       <img src="./icons/Vala.svg" width="48">        |
|   `verilog`    |      <img src="./icons/Verilog.svg" width="48">      |
|     `wasm`     |    <img src="./icons/WebAssembly.svg" width="48">    |
|     `zig`      |     <img src="./icons/Zig-Dark.svg" width="48">      |

### Marcação e estilo

|      Icon ID       |                        Icon                         |
| :----------------: | :-------------------------------------------------: |
|    `bootstrap`     |    <img src="./icons/Bootstrap.svg" width="48">     |
|       `css`        |       <img src="./icons/CSS.svg" width="48">        |
|     `emotion`      |   <img src="./icons/Emotion-Dark.svg" width="48">   |
|       `html`       |       <img src="./icons/HTML.svg" width="48">       |
|       `less`       |    <img src="./icons/Less-Dark.svg" width="48">     |
|    `materialui`    | <img src="./icons/MaterialUI-Dark.svg" width="48">  |
|       `pug`        |     <img src="./icons/Pug-Dark.svg" width="48">     |
|       `sass`       |       <img src="./icons/Sass.svg" width="48">       |
| `styledcomponents` | <img src="./icons/StyledComponents.svg" width="48"> |
|     `tailwind`     | <img src="./icons/TailwindCSS-Dark.svg" width="48"> |
|     `vuetify`      |   <img src="./icons/Vuetify-Dark.svg" width="48">   |
|     `windicss`     |  <img src="./icons/WindiCSS-Dark.svg" width="48">   |

### Front-end

|    Icon ID    |                        Icon                         |
| :-----------: | :-------------------------------------------------: |
|  `alpinejs`   |  <img src="./icons/AlpineJS-Dark.svg" width="48">   |
|   `angular`   |   <img src="./icons/Angular-Dark.svg" width="48">   |
|    `astro`    |      <img src="./icons/Astro.svg" width="48">       |
|     `d3`      |     <img src="./icons/D3-Dark.svg" width="48">      |
|    `ember`    |      <img src="./icons/Ember.svg" width="48">       |
|   `gatsby`    |      <img src="./icons/Gatsby.svg" width="48">      |
|    `htmx`     |    <img src="./icons/Htmx-Dark.svg" width="48">     |
|   `jquery`    |      <img src="./icons/JQuery.svg" width="48">      |
|     `lit`     |     <img src="./icons/Lit-Dark.svg" width="48">     |
|   `lucide`    |   <img src="./icons/Lucide-Dark.svg" width="48">    |
|   `motion`    |   <img src="./icons/Motion-Dark.svg" width="48">    |
|   `nextjs`    |   <img src="./icons/NextJS-Dark.svg" width="48">    |
|   `nuxtjs`    |   <img src="./icons/NuxtJS-Dark.svg" width="48">    |
|    `p5js`     |       <img src="./icons/p5js.svg" width="48">       |
|    `pinia`    |    <img src="./icons/Pinia-Dark.svg" width="48">    |
| `processing`  | <img src="./icons/Processing-Dark.svg" width="48">  |
|    `react`    |    <img src="./icons/React-Dark.svg" width="48">    |
|  `reactivex`  |  <img src="./icons/ReactiveX-Dark.svg" width="48">  |
| `reactrouter` | <img src="./icons/ReactRouter-Dark.svg" width="48"> |
|    `redux`    |      <img src="./icons/Redux.svg" width="48">       |
|    `remix`    |    <img src="./icons/Remix-Dark.svg" width="48">    |
|   `solidjs`   |   <img src="./icons/SolidJS-Dark.svg" width="48">   |
|   `svelte`    |      <img src="./icons/Svelte.svg" width="48">      |
|   `threejs`   |   <img src="./icons/ThreeJS-Dark.svg" width="48">   |
|     `vue`     |    <img src="./icons/VueJS-Dark.svg" width="48">    |
|     `yew`     |     <img src="./icons/Yew-Dark.svg" width="48">     |

### Build e pacotes

|  Icon ID   |                       Icon                       |
| :--------: | :----------------------------------------------: |
|  `babel`   |     <img src="./icons/Babel.svg" width="48">     |
|  `cmake`   |  <img src="./icons/CMake-Dark.svg" width="48">   |
|  `gradle`  |  <img src="./icons/Gradle-Dark.svg" width="48">  |
|   `gulp`   |     <img src="./icons/Gulp.svg" width="48">      |
|  `maven`   |  <img src="./icons/Maven-Dark.svg" width="48">   |
|   `npm`    |   <img src="./icons/Npm-Dark.svg" width="48">    |
|   `pnpm`   |   <img src="./icons/Pnpm-Dark.svg" width="48">   |
| `rollupjs` | <img src="./icons/RollupJS-Dark.svg" width="48"> |
|   `vite`   |   <img src="./icons/Vite-Dark.svg" width="48">   |
| `webpack`  | <img src="./icons/Webpack-Dark.svg" width="48">  |
|   `yarn`   |   <img src="./icons/Yarn-Dark.svg" width="48">   |

### Back-end e APIs

|   Icon ID   |                       Icon                        |
| :---------: | :-----------------------------------------------: |
|   `actix`   |   <img src="./icons/Actix-Dark.svg" width="48">   |
|  `adonis`   |     <img src="./icons/Adonis.svg" width="48">     |
|  `apollo`   |     <img src="./icons/Apollo.svg" width="48">     |
| `appwrite`  |    <img src="./icons/Appwrite.svg" width="48">    |
|    `bun`    |    <img src="./icons/Bun-Dark.svg" width="48">    |
|   `deno`    |   <img src="./icons/DENO-Dark.svg" width="48">    |
|  `django`   |     <img src="./icons/Django.svg" width="48">     |
|  `dotnet`   |     <img src="./icons/DotNet.svg" width="48">     |
|  `elysia`   |  <img src="./icons/Elysia-Dark.svg" width="48">   |
|  `express`  | <img src="./icons/ExpressJS-Dark.svg" width="48"> |
|  `fastapi`  |    <img src="./icons/FastAPI.svg" width="48">     |
| `firebase`  | <img src="./icons/Firebase-Dark.svg" width="48">  |
|   `flask`   |   <img src="./icons/Flask-Dark.svg" width="48">   |
|  `graphql`  |  <img src="./icons/GraphQL-Dark.svg" width="48">  |
|   `jinja`   |   <img src="./icons/Jinja-Dark.svg" width="48">   |
|    `jwt`    |    <img src="./icons/JWT-Dark.svg" width="48">    |
|   `kafka`   |     <img src="./icons/Kafka.svg" width="48">      |
|   `ktor`    |   <img src="./icons/Ktor-Dark.svg" width="48">    |
|  `laravel`  |  <img src="./icons/Laravel-Dark.svg" width="48">  |
|  `nestjs`   |  <img src="./icons/NestJS-Dark.svg" width="48">   |
|   `nginx`   |     <img src="./icons/Nginx.svg" width="48">      |
|  `nodejs`   |  <img src="./icons/NodeJS-Dark.svg" width="48">   |
| `pydantic`  | <img src="./icons/Pydantic-Dark.svg" width="48">  |
| `rabbitmq`  | <img src="./icons/RabbitMQ-Dark.svg" width="48">  |
|   `rails`   |     <img src="./icons/Rails.svg" width="48">      |
|  `rocket`   |     <img src="./icons/Rocket.svg" width="48">     |
| `socketio`  | <img src="./icons/SocketIO-Dark.svg" width="48">  |
|  `spring`   |  <img src="./icons/Spring-Dark.svg" width="48">   |
| `supabase`  | <img src="./icons/Supabase-Dark.svg" width="48">  |
|  `symfony`  |  <img src="./icons/Symfony-Dark.svg" width="48">  |
|  `uvicorn`  |  <img src="./icons/Uvicorn-Dark.svg" width="48">  |
| `websocket` | <img src="./icons/WebSocket-Dark.svg" width="48"> |
|  `workers`  |  <img src="./icons/Workers-Dark.svg" width="48">  |

### Banco de dados

|     Icon ID     |                         Icon                          |
| :-------------: | :---------------------------------------------------: |
|   `cassandra`   |   <img src="./icons/Cassandra-Dark.svg" width="48">   |
|   `dynamodb`    |   <img src="./icons/DynamoDB-Dark.svg" width="48">    |
| `elasticsearch` | <img src="./icons/Elasticsearch-Dark.svg" width="48"> |
|   `hibernate`   |   <img src="./icons/Hibernate-Dark.svg" width="48">   |
|    `mongodb`    |      <img src="./icons/MongoDB.svg" width="48">       |
|     `mysql`     |     <img src="./icons/MySQL-Dark.svg" width="48">     |
|    `oracle`     |       <img src="./icons/Oracle.svg" width="48">       |
|  `planetscale`  |  <img src="./icons/PlanetScale-Dark.svg" width="48">  |
|   `postgres`    |  <img src="./icons/PostgreSQL-Dark.svg" width="48">   |
|    `prisma`     |       <img src="./icons/Prisma.svg" width="48">       |
|     `redis`     |     <img src="./icons/Redis-Dark.svg" width="48">     |
|   `sequelize`   |   <img src="./icons/Sequelize-Dark.svg" width="48">   |
|      `sql`      |      <img src="./icons/SQL-Dark.svg" width="48">      |
|    `sqlite`     |       <img src="./icons/SQLite.svg" width="48">       |

### DevOps e infraestrutura

|     Icon ID     |                         Icon                          |
| :-------------: | :---------------------------------------------------: |
|    `ansible`    |      <img src="./icons/Ansible.svg" width="48">       |
|   `bitbucket`   |   <img src="./icons/BitBucket-Dark.svg" width="48">   |
|    `docker`     |       <img src="./icons/Docker.svg" width="48">       |
|      `git`      |        <img src="./icons/Git.svg" width="48">         |
|    `github`     |    <img src="./icons/Github-Dark.svg" width="48">     |
| `githubactions` | <img src="./icons/GithubActions-Dark.svg" width="48"> |
|    `gitlab`     |    <img src="./icons/GitLab-Dark.svg" width="48">     |
|    `grafana`    |    <img src="./icons/Grafana-Dark.svg" width="48">    |
|     `ipfs`      |     <img src="./icons/IPFS-Dark.svg" width="48">      |
|    `jenkins`    |    <img src="./icons/Jenkins-Dark.svg" width="48">    |
|  `kubernetes`   |     <img src="./icons/Kubernetes.svg" width="48">     |
|      `nix`      |      <img src="./icons/Nix-Dark.svg" width="48">      |
|   `openshift`   |     <img src="./icons/OpenShift.svg" width="48">      |
|   `openstack`   |   <img src="./icons/OpenStack-Dark.svg" width="48">   |
|  `prometheus`   |     <img src="./icons/Prometheus.svg" width="48">     |
|    `sentry`     |       <img src="./icons/Sentry.svg" width="48">       |
|   `terraform`   |   <img src="./icons/Terraform-Dark.svg" width="48">   |

### Cloud e hospedagem

|   Icon ID    |                        Icon                        |
| :----------: | :------------------------------------------------: |
|    `aws`     |    <img src="./icons/AWS-Dark.svg" width="48">     |
|   `azure`    |   <img src="./icons/Azure-Dark.svg" width="48">    |
| `cloudflare` | <img src="./icons/Cloudflare-Dark.svg" width="48"> |
|    `gcp`     |    <img src="./icons/GCP-Dark.svg" width="48">     |
|   `heroku`   |     <img src="./icons/Heroku.svg" width="48">      |
|  `netlify`   |  <img src="./icons/Netlify-Dark.svg" width="48">   |
|   `render`   |     <img src="./icons/Render.svg" width="48">      |
|   `replit`   |   <img src="./icons/Replit-Dark.svg" width="48">   |
|   `vercel`   |   <img src="./icons/Vercel-Dark.svg" width="48">   |

### Testes e qualidade

|     Icon ID      |                          Icon                          |
| :--------------: | :----------------------------------------------------: |
|     `bandit`     |     <img src="./icons/Bandit-Dark.svg" width="48">     |
|     `biome`      |     <img src="./icons/Biome-Dark.svg" width="48">      |
|    `cypress`     |    <img src="./icons/Cypress-Dark.svg" width="48">     |
|     `eslint`     |       <img src="./icons/ESLint.svg" width="48">        |
|    `golangci`    |    <img src="./icons/GolangCI-Dark.svg" width="48">    |
|     `husky`      |     <img src="./icons/Husky-Dark.svg" width="48">      |
|      `jest`      |        <img src="./icons/Jest.svg" width="48">         |
|   `playwright`   |   <img src="./icons/Playwright-Dark.svg" width="48">   |
|    `postman`     |       <img src="./icons/Postman.svg" width="48">       |
|    `prettier`    |    <img src="./icons/Prettier-Dark.svg" width="48">    |
|     `radon`      |     <img src="./icons/Radon-Dark.svg" width="48">      |
|      `ruff`      |      <img src="./icons/Ruff-Dark.svg" width="48">      |
|    `selenium`    |      <img src="./icons/Selenium.svg" width="48">       |
| `testinglibrary` | <img src="./icons/TestingLibrary-Dark.svg" width="48"> |
|     `vitest`     |     <img src="./icons/Vitest-Dark.svg" width="48">     |

### Mobile e desktop

|     Icon ID     |                         Icon                          |
| :-------------: | :---------------------------------------------------: |
| `androidstudio` | <img src="./icons/AndroidStudio-Dark.svg" width="48"> |
|   `capacitor`   |     <img src="./icons/Capacitor.svg" width="48">      |
|   `electron`    |      <img src="./icons/Electron.svg" width="48">      |
|    `flutter`    |    <img src="./icons/Flutter-Dark.svg" width="48">    |
|      `gtk`      |      <img src="./icons/GTK-Dark.svg" width="48">      |
|      `qt`       |      <img src="./icons/QT-Dark.svg" width="48">       |
|     `tauri`     |     <img src="./icons/Tauri-Dark.svg" width="48">     |

### IA e dados

|   Icon ID    |                        Icon                         |
| :----------: | :-------------------------------------------------: |
|  `anaconda`  |  <img src="./icons/Anaconda-Dark.svg" width="48">   |
|   `claude`   |   <img src="./icons/Claude-Dark.svg" width="48">    |
|   `gemini`   |   <img src="./icons/Gemini-Dark.svg" width="48">    |
|  `jupyter`   |   <img src="./icons/Jupyter-Dark.svg" width="48">   |
|   `opencv`   |   <img src="./icons/OpenCV-Dark.svg" width="48">    |
| `openrouter` | <img src="./icons/OpenRouter-Dark.svg" width="48">  |
|  `pytorch`   |   <img src="./icons/PyTorch-Dark.svg" width="48">   |
|    `ros`     |     <img src="./icons/ROS-Dark.svg" width="48">     |
|  `sklearn`   | <img src="./icons/ScikitLearn-Dark.svg" width="48"> |
| `tensorflow` | <img src="./icons/TensorFlow-Dark.svg" width="48">  |

### Jogos e 3D

|      Icon ID      |                        Icon                        |
| :---------------: | :------------------------------------------------: |
|      `bevy`       |    <img src="./icons/Bevy-Dark.svg" width="48">    |
|     `blender`     |  <img src="./icons/Blender-Dark.svg" width="48">   |
| `gamemakerstudio` | <img src="./icons/GameMakerStudio.svg" width="48"> |
|      `godot`      |   <img src="./icons/Godot-Dark.svg" width="48">    |
|   `haxeflixel`    | <img src="./icons/HaxeFlixel-Dark.svg" width="48"> |
|  `robloxstudio`   |  <img src="./icons/RobloxStudio.svg" width="48">   |
|      `unity`      |   <img src="./icons/Unity-Dark.svg" width="48">    |
|     `unreal`      |  <img src="./icons/UnrealEngine.svg" width="48">   |

### Editores e IDEs

|    Icon ID     |                         Icon                         |
| :------------: | :--------------------------------------------------: |
|     `atom`     |       <img src="./icons/Atom.svg" width="48">        |
|    `clion`     |    <img src="./icons/CLion-Dark.svg" width="48">     |
|   `codepen`    |   <img src="./icons/CodePen-Dark.svg" width="48">    |
|   `eclipse`    |   <img src="./icons/Eclipse-Dark.svg" width="48">    |
|    `emacs`     |       <img src="./icons/Emacs.svg" width="48">       |
|     `idea`     |     <img src="./icons/Idea-Dark.svg" width="48">     |
|    `neovim`    |    <img src="./icons/NeoVim-Dark.svg" width="48">    |
|   `phpstorm`   |   <img src="./icons/PhpStorm-Dark.svg" width="48">   |
|   `pycharm`    |   <img src="./icons/PyCharm-Dark.svg" width="48">    |
|    `rider`     |    <img src="./icons/Rider-Dark.svg" width="48">     |
|   `sublime`    |   <img src="./icons/Sublime-Dark.svg" width="48">    |
|     `vim`      |     <img src="./icons/VIM-Dark.svg" width="48">      |
| `visualstudio` | <img src="./icons/VisualStudio-Dark.svg" width="48"> |
|    `vscode`    |    <img src="./icons/VSCode-Dark.svg" width="48">    |
|   `vscodium`   |   <img src="./icons/VSCodium-Dark.svg" width="48">   |
|   `webstorm`   |   <img src="./icons/WebStorm-Dark.svg" width="48">   |

### Hardware

|    Icon ID    |                        Icon                         |
| :-----------: | :-------------------------------------------------: |
|   `arduino`   |     <img src="./icons/Arduino.svg" width="48">      |
| `raspberrypi` | <img src="./icons/RaspberryPi-Dark.svg" width="48"> |

### Design e criação

|    Icon ID    |                       Icon                       |
| :-----------: | :----------------------------------------------: |
|   `ableton`   | <img src="./icons/Ableton-Dark.svg" width="48">  |
|     `ae`      | <img src="./icons/AfterEffects.svg" width="48">  |
|     `ai`      |  <img src="./icons/Illustrator.svg" width="48">  |
|     `au`      |   <img src="./icons/Audition.svg" width="48">    |
|   `autocad`   | <img src="./icons/AutoCAD-Dark.svg" width="48">  |
|    `figma`    |  <img src="./icons/Figma-Dark.svg" width="48">   |
| `fontawesome` |  <img src="./icons/FontAwesome.svg" width="48">  |
|     `pr`      |   <img src="./icons/Premiere.svg" width="48">    |
|     `ps`      |   <img src="./icons/Photoshop.svg" width="48">   |
|  `sketchup`   | <img src="./icons/Sketchup-Dark.svg" width="48"> |
|   `webflow`   |    <img src="./icons/Webflow.svg" width="48">    |
|  `wordpress`  |   <img src="./icons/Wordpress.svg" width="48">   |
|     `xd`      |      <img src="./icons/XD.svg" width="48">       |

### Sistemas operacionais

|  Icon ID  |                      Icon                       |
| :-------: | :---------------------------------------------: |
|  `apple`  |  <img src="./icons/Apple-Dark.svg" width="48">  |
|  `arch`   |  <img src="./icons/Arch-Dark.svg" width="48">   |
|   `bsd`   |   <img src="./icons/BSD-Dark.svg" width="48">   |
| `debian`  | <img src="./icons/Debian-Dark.svg" width="48">  |
|  `kali`   |  <img src="./icons/Kali-Dark.svg" width="48">   |
|  `linux`  |  <img src="./icons/Linux-Dark.svg" width="48">  |
|  `mint`   |  <img src="./icons/Mint-Dark.svg" width="48">   |
|  `plan9`  |  <img src="./icons/Plan9-Dark.svg" width="48">  |
| `redhat`  | <img src="./icons/RedHat-Dark.svg" width="48">  |
| `ubuntu`  | <img src="./icons/Ubuntu-Dark.svg" width="48">  |
| `windows` | <img src="./icons/Windows-Dark.svg" width="48"> |

### Social e comunidades

|     Icon ID     |                         Icon                          |
| :-------------: | :---------------------------------------------------: |
|  `activitypub`  |  <img src="./icons/ActivityPub-Dark.svg" width="48">  |
|     `bots`      |    <img src="./icons/DiscordBots.svg" width="48">     |
|     `devto`     |     <img src="./icons/DevTo-Dark.svg" width="48">     |
|    `discord`    |      <img src="./icons/Discord.svg" width="48">       |
|   `discordjs`   |   <img src="./icons/DiscordJS-Dark.svg" width="48">   |
|   `fediverse`   |   <img src="./icons/Fediverse-Dark.svg" width="48">   |
|     `gmail`     |     <img src="./icons/Gmail-Dark.svg" width="48">     |
|   `instagram`   |     <img src="./icons/Instagram.svg" width="48">      |
|   `linkedin`    |      <img src="./icons/LinkedIn.svg" width="48">      |
|   `mastodon`    |   <img src="./icons/Mastodon-Dark.svg" width="48">    |
|    `misskey`    |    <img src="./icons/Misskey-Dark.svg" width="48">    |
|    `spotify`    |    <img src="./icons/Spotify-Dark.svg" width="48">    |
| `stackoverflow` | <img src="./icons/StackOverflow-Dark.svg" width="48"> |
|    `twitter`    |      <img src="./icons/Twitter.svg" width="48">       |

### Produtividade e outros

|  Icon ID   |                       Icon                       |
| :--------: | :----------------------------------------------: |
|   `azul`   |     <img src="./icons/Azul.svg" width="48">      |
|  `notion`  |  <img src="./icons/Notion-Dark.svg" width="48">  |
| `obsidian` | <img src="./icons/Obsidian-Dark.svg" width="48"> |

## Adicionar um ícone

1. Coloque o SVG em `icons/` seguindo as convenções abaixo.
2. Inclua o ID em uma categoria de `scripts/categories.mjs`.
3. Rode `npm run readme` para regenerar a [lista de ícones](#lista-de-ícones) e `npm test` para validar.

Convenções:

- `viewBox="0 0 256 256"`, `width`/`height` 256 e `fill="none"` na raiz;
- fundo `<rect width="256" height="256" rx="60">` e arte entre as coordenadas 41 e 215;
- par temático `Nome-Dark.svg` (fundo `#242938`) + `Nome-Light.svg` (fundo `#F4F2ED`), ou arquivo único quando o logo funciona sobre a cor da marca;
- **sem hífen no nome** além do sufixo de tema — o ID vem de `split('-')[0]`;
- **sem** `<text>`, `<style>`, `class=` ou referências externas (texto vira `<path>`);
- evite `id` e `<defs>`; se precisar, prefixe com o nome do ícone, pois todos são concatenados em um único SVG.

## Documentação complementar

| Documento                                                            | Conteúdo                                         |
| -------------------------------------------------------------------- | ------------------------------------------------ |
| [DEPLOY.md](DEPLOY.md)                                               | Publicar na Vercel ou no Cloudflare Workers      |
| [brand/README.md](brand/README.md)                                   | Especificação da marca `<gcruz.dev/>`            |
| [docs/BIBLIOTECA_DE_ANIMACOES.md](docs/BIBLIOTECA_DE_ANIMACOES.md)   | Modelos, arquitetura e validação das animações   |
| [docs/MEU_ARSENAL.md](docs/MEU_ARSENAL.md)                           | Coleção de animações exclusivas por tecnologia   |
| [docs/ATUALIZACAO_DO_CATALOGO.md](docs/ATUALIZACAO_DO_CATALOGO.md)   | Ícones incluídos na última ampliação do catálogo |
| [docs/INVENTARIO_TECNICO.md](docs/INVENTARIO_TECNICO.md)             | Inventário técnico do repositório                |
| [docs/ROADMAP_DE_IMPLEMENTACAO.md](docs/ROADMAP_DE_IMPLEMENTACAO.md) | Roadmap                                          |
| [licenses/README.md](licenses/README.md)                             | Origem e licença dos ícones de terceiros         |

## Créditos e licença

Este repositório é um fork de [skillicons.dev](https://skillicons.dev), criado por [tandpfun](https://github.com/tandpfun) sob licença MIT. Se o projeto original foi útil para você, considere apoiar o autor: [ko-fi.com/thijsdev](https://ko-fi.com/Q5Q860KQ2).

Os logotipos de terceiros são marcas de seus respectivos donos e aparecem apenas para identificação; origens e licenças adicionais estão em [`licenses/`](licenses/). A marca `<gcruz.dev/>` e os assets em `brand/` são de Guilherme Cruz. As fontes do site — [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) e [IBM Plex Sans](https://github.com/IBM/plex) — são auto-hospedadas sob a licença [OFL-1.1](https://openfontlicense.org).

Distribuído sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE).
