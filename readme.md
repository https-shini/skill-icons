<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.github/text-logo.svg">
    <img align="center" width="280" src="./.github/text-logo-light.svg" alt="Skill Icons">
  </picture>
</p>

<h3 align="center">Ícones de tecnologias em um único SVG, para README e currículo</h3>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./brand/compact-dark.svg">
    <img src="./brand/compact-light.svg" height="26" alt="gcruz.dev">
  </picture>
  &nbsp;·&nbsp; fork de <a href="https://skillicons.dev">skillicons.dev</a>
  &nbsp;·&nbsp; <strong>255 ícones</strong>
  &nbsp;·&nbsp; <a href="./DEPLOY.md">Vercel</a> ou Cloudflare Workers
</p>

<hr>

## Índice

- [Como funciona](#como-funciona)
- [Especificar ícones](#especificar-ícones)
- [Temas](#temas)
- [Ícones por linha](#ícones-por-linha)
- [Centralizar](#centralizar)
- [Ícones da marca `<gcruz.dev/>`](#ícones-da-marca-gcruzdev)
- [Referência da API](#referência-da-api)
- [Lista de ícones](#lista-de-ícones)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Adicionar um ícone](#adicionar-um-ícone)
- [Créditos e licença](#créditos-e-licença)

## Como funciona

Um endpoint recebe a lista de ícones e devolve **um único SVG** com todos eles
lado a lado. Uma requisição por badge, não uma por ícone.

```
https://icons.gcruz.dev.br/icons?i=ts,react,nodejs,docker
```

> [!IMPORTANT]
> `icons.gcruz.dev.br` é a instância **deste fork**. Troque pelo domínio da sua.
> Os 16 ícones criados aqui — entre eles `oracle`, `sql`, `jwt`, `render` e
> `gcruz` — **não existem em `skillicons.dev`**, que serve apenas o repositório
> oficial. Pedir um deles ao domínio oficial devolve `400`.
> Como publicar a sua instância: [DEPLOY.md](./DEPLOY.md).

As prévias deste README vêm dos arquivos do próprio repositório, então aparecem
mesmo antes de você publicar a instância.

## Especificar ícones

Liste os IDs separados por vírgula em `i` (ou `icons`). A lista completa está em
[Lista de ícones](#lista-de-ícones).

```md
[![Minhas skills](https://icons.gcruz.dev.br/icons?i=js,html,css,wasm)](https://gcruz.dev.br)
```

<p>
  <img src="./icons/JavaScript.svg" width="48">
  <img src="./icons/HTML.svg" width="48">
  <img src="./icons/CSS.svg" width="48">
  <img src="./icons/WebAssembly.svg" width="48">
</p>

`i=all` devolve todos os 255 de uma vez.

## Temas

Parte dos ícones tem variante clara e escura — são **174** dos 255. `theme` (ou
`t`) escolhe qual usar; o padrão é `dark`. O nome se refere ao **fundo** do badge.

```md
[![Minhas skills](https://icons.gcruz.dev.br/icons?i=java,kotlin,nodejs,figma&theme=light)](https://gcruz.dev.br)
```

<p>
  <img src="./icons/Java-Light.svg" width="48">
  <img src="./icons/Kotlin-Light.svg" width="48">
  <img src="./icons/NodeJS-Light.svg" width="48">
  <img src="./icons/Figma-Light.svg" width="48">
</p>

Os 81 ícones restantes usam a cor da própria marca como fundo e ficam idênticos
nos dois temas — `theme` simplesmente não os afeta.

## Ícones por linha

`perline` aceita de **1 a 50**; o padrão é 15. Fora desse intervalo a resposta é
`400`.

```md
[![Minhas skills](https://icons.gcruz.dev.br/icons?i=aws,gcp,azure,react,vue,flutter&perline=3)](https://gcruz.dev.br)
```

## Centralizar

O SVG é redimensionado automaticamente, então vale qualquer técnica de
centralização de imagem:

```html
<p align="center">
  <a href="https://gcruz.dev.br">
    <img src="https://icons.gcruz.dev.br/icons?i=git,kubernetes,docker,c,vim" />
  </a>
</p>
```

## Ícones da marca `<gcruz.dev/>`

A marca é **100% tipográfica** em JetBrains Mono. Os arquivos são os contornos
dos glifos convertidos em `<path>`: não dependem de fonte instalada e preservam a
proporção original. Todos os assets estão em [`brand/`](./brand/), e
[`brand/index.html`](./brand/index.html) é o documento de decisão do design
system, com escala, pesos e contexto de aplicação.

### No endpoint, como qualquer outro ícone

`gcruz` é um ID normal da API e se combina com os demais na mesma requisição:

```md
[![gcruz.dev](https://icons.gcruz.dev.br/icons?i=gcruz)](https://gcruz.dev.br)
[![Stack](https://icons.gcruz.dev.br/icons?i=gcruz,ts,react,nodejs&perline=4)](https://gcruz.dev.br)
```

<p>
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./icons/GCruz-Dark.svg">
    <img src="./icons/GCruz-Light.svg" width="48" alt="gcruz">
  </picture>
  <img src="./icons/TypeScript.svg" width="48">
  <img src="./icons/React-Dark.svg" width="48">
  <img src="./icons/NodeJS-Dark.svg" width="48">
</p>

No badge quadrado entra a variante **compacta** `<g/>`, e não o wordmark. Essa é a
regra do próprio design system para tamanho pequeno: com 12 caracteres, o wordmark
teria cerca de 4px de altura num badge de 48px. O wordmark completo vive em
`brand/`, onde a proporção é livre.

### Assets da marca

Variações definidas no design system:

| Nome                                          | Prévia                                                                                                                                                                           | Formato | Dimensões     | Link direto                                                                                                                                                                                               |
| :-------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wordmark**<br><code>wordmark</code>         | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/wordmark-dark.svg"><img src="./brand/wordmark-light.svg" width="200" alt="wordmark"></picture>             | `.svg`  | `704.8 × 101` | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-light.svg)         |
| **Wordmark 600**<br><code>wordmark-600</code> | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/wordmark-600-dark.svg"><img src="./brand/wordmark-600-light.svg" width="200" alt="wordmark-600"></picture> | `.svg`  | `704.4 × 101` | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-600-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-600-light.svg) |
| **Compacta**<br><code>compact</code>          | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/compact-dark.svg"><img src="./brand/compact-light.svg" width="90" alt="compact"></picture>                 | `.svg`  | `224.8 × 101` | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/compact-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/compact-light.svg)           |
| **Tile de app**<br><code>app-tile</code>      | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/app-tile-dark.svg"><img src="./brand/app-tile-light.svg" width="64" alt="app-tile"></picture>              | `.svg`  | `256 × 256`   | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/app-tile-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/app-tile-light.svg)         |
| **Favicon**<br><code>favicon</code>           | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/favicon-dark.svg"><img src="./brand/favicon-light.svg" width="48" alt="favicon"></picture>                 | `.svg`  | `64 × 64`     | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/favicon-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/favicon-light.svg)           |
| **Peso 400**<br><code>peso-400</code>         | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/peso-400-dark.svg"><img src="./brand/peso-400-light.svg" width="200" alt="peso-400"></picture>             | `.svg`  | `703 × 101`   | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/peso-400-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/peso-400-light.svg)         |
| **Peso 500**<br><code>peso-500</code>         | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/peso-500-dark.svg"><img src="./brand/peso-500-light.svg" width="200" alt="peso-500"></picture>             | `.svg`  | `703.8 × 101` | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/peso-500-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/peso-500-light.svg)         |

Variações **propostas** — não constam do DS v4.0, foram derivadas e estão aqui
para aprovação:

| Nome                                            | Prévia                                                                                                                                                                                          | Formato | Dimensões       | Link direto                                                                                                                                                                                                         |
| :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------ | :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vertical**<br><code>proposta-vertical</code>  | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/proposta-vertical-dark.svg"><img src="./brand/proposta-vertical-light.svg" width="120" alt="proposta-vertical"></picture> | `.svg`  | `344.8 × 186.3` | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-vertical-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-vertical-light.svg) |
| **Sem texto**<br><code>proposta-brackets</code> | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/proposta-brackets-dark.svg"><img src="./brand/proposta-brackets-light.svg" width="90" alt="proposta-brackets"></picture>  | `.svg`  | `164.8 × 94`    | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-brackets-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-brackets-light.svg) |
| **Monograma**<br><code>proposta-monogram</code> | <picture><source media="(prefers-color-scheme: dark)" srcset="./brand/proposta-monogram-dark.svg"><img src="./brand/proposta-monogram-light.svg" width="36" alt="proposta-monogram"></picture>  | `.svg`  | `45.1 × 74`     | [dark](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-monogram-dark.svg) · [light](https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-monogram-light.svg) |

### Código pronto

Os links da coluna _Link direto_ são servidos pelo GitHub com
`content-type: image/svg+xml` e funcionam imediatamente, sem depender do deploy.
Publicada a instância, os mesmos arquivos ficam também em `/brand/<arquivo>.svg`.

```html
<!-- Wordmark — Assinatura principal, peso 700. Use até 32px de altura. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-dark.svg"
  width="400"
  alt="gcruz.dev"
/>

<!-- Wordmark 600 — Mesma assinatura em peso 600, para display a partir de 40px. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-600-dark.svg"
  width="400"
  alt="gcruz.dev"
/>

<!-- Compacta — `<g/>`. Abaixo de 24px é a única variante legível. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/compact-dark.svg"
  width="180"
  alt="gcruz.dev"
/>

<!-- Tile de app — Ícone de aplicativo, quadrado, com tile e aresta. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/app-tile-dark.svg"
  width="128"
  alt="gcruz.dev"
/>

<!-- Favicon — Otimizado para 16px na aba do navegador. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/favicon-dark.svg"
  width="96"
  alt="gcruz.dev"
/>

<!-- Peso 400 — Só para comparação de pesos no documento do DS. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/peso-400-dark.svg"
  width="400"
  alt="gcruz.dev"
/>

<!-- Peso 500 — Só para comparação de pesos no documento do DS. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/peso-500-dark.svg"
  width="400"
  alt="gcruz.dev"
/>
```

Propostas:

```html
<!-- Vertical — `<gcruz` sobre `.dev/>`, empilhado. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-vertical-dark.svg"
  width="240"
  alt="gcruz.dev"
/>

<!-- Sem texto — Só os brackets, sem o nome. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-brackets-dark.svg"
  width="180"
  alt="gcruz.dev"
/>

<!-- Monograma — O `g` isolado, sem brackets. -->
<img
  src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/proposta-monogram-dark.svg"
  width="72"
  alt="gcruz.dev"
/>
```

Para alternar por tema, use `<picture>` — é o método documentado pelo GitHub para
imagem por esquema de cor:

```html
<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="
      https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-dark.svg
    "
  />
  <img
    src="https://raw.githubusercontent.com/https-shini/skill-icons/main/brand/wordmark-light.svg"
    width="320"
    alt="gcruz.dev"
  />
</picture>
```

### Tokens

| Elemento          | Dark      | Light     |
| :---------------- | :-------- | :-------- |
| Fundo             | `#070d19` | `#f2f4f8` |
| Brackets `<` `/>` | `#f43f5e` | `#be123c` |
| Nome `gcruz`      | `#f8fafc` | `#0f172a` |
| Sufixo `.dev`     | `#818cf8` | `#4f46e5` |
| Tile da compacta  | `#0f172a` | —         |

Peso **700 até 32px**, **600 acima de 40px**. Abaixo de 24px, use a compacta.

> [!NOTE]
> `peso-700` é byte a byte idêntico a `wordmark`, e `peso-600` a `wordmark-600` —
> são o mesmo arquivo sob dois nomes. Os pesos existem para a comparação no
> documento do DS; para uso real, prefira `wordmark` e `wordmark-600`.

## Referência da API

| Rota                   | Devolve                                                    |
| :--------------------- | :--------------------------------------------------------- |
| `/icons?i=js,html`     | O SVG composto. Aceita `i` ou `icons`.                     |
| `/icons?i=all`         | Todos os ícones.                                           |
| `&theme=light`         | Fundo claro nos ícones com par. Padrão `dark`. Aceita `t`. |
| `&perline=9`           | Ícones por linha, de 1 a 50. Padrão 15.                    |
| `/api/icons`           | JSON com a lista de IDs.                                   |
| `/api/manifest`        | JSON com ID, se tem tema e o arquivo de cada variante.     |
| `/api/svgs`            | JSON com todos os SVGs crus.                               |
| `/svg/<Arquivo>.svg`   | O SVG individual, estático e cacheado na CDN.              |
| `/brand/<arquivo>.svg` | Os assets da marca.                                        |

Erros:

| Requisição        | Resposta                                                   |
| :---------------- | :--------------------------------------------------------- |
| `?i=js,naoexiste` | `400 Unknown icon: naoexiste` — nomeia o que não resolveu. |
| `?perline=0`      | `400` — fora do intervalo 1–50.                            |
| `?theme=azul`     | `400` — só `dark` ou `light`.                              |
| `/icons` sem `i`  | `400` — nenhum ícone especificado.                         |

Atalhos de nome: 44 aliases estão definidos em `shortNames`, em
[`lib/icons.mjs`](./lib/icons.mjs) — `js`, `ts`, `py`, `k8s`, `rr`, `fa`, `ws`,
`rtl`, entre outros.

## Lista de ícones

Tabela gerada a partir de [`icons/`](./icons) por
[`scripts/readme-table.mjs`](./scripts/readme-table.mjs). Para regenerar:
`npm run readme`. O CI roda `npm run readme:check` e falha se ela estiver
defasada.

|      Icon ID       |                          Icon                          |
| :----------------: | :----------------------------------------------------: |
|     `ableton`      |    <img src="./icons/Ableton-Dark.svg" width="48">     |
|   `activitypub`    |  <img src="./icons/ActivityPub-Dark.svg" width="48">   |
|      `actix`       |     <img src="./icons/Actix-Dark.svg" width="48">      |
|      `adonis`      |       <img src="./icons/Adonis.svg" width="48">        |
|        `ae`        |    <img src="./icons/AfterEffects.svg" width="48">     |
|        `ai`        |     <img src="./icons/Illustrator.svg" width="48">     |
|     `aiscript`     |    <img src="./icons/AiScript-Dark.svg" width="48">    |
|     `alpinejs`     |    <img src="./icons/AlpineJS-Dark.svg" width="48">    |
|     `anaconda`     |    <img src="./icons/Anaconda-Dark.svg" width="48">    |
|  `androidstudio`   | <img src="./icons/AndroidStudio-Dark.svg" width="48">  |
|     `angular`      |    <img src="./icons/Angular-Dark.svg" width="48">     |
|     `ansible`      |       <img src="./icons/Ansible.svg" width="48">       |
|      `apollo`      |       <img src="./icons/Apollo.svg" width="48">        |
|      `apple`       |     <img src="./icons/Apple-Dark.svg" width="48">      |
|     `appwrite`     |      <img src="./icons/Appwrite.svg" width="48">       |
|       `arch`       |      <img src="./icons/Arch-Dark.svg" width="48">      |
|     `arduino`      |       <img src="./icons/Arduino.svg" width="48">       |
|      `astro`       |        <img src="./icons/Astro.svg" width="48">        |
|       `atom`       |        <img src="./icons/Atom.svg" width="48">         |
|        `au`        |      <img src="./icons/Audition.svg" width="48">       |
|     `autocad`      |    <img src="./icons/AutoCAD-Dark.svg" width="48">     |
|       `aws`        |      <img src="./icons/AWS-Dark.svg" width="48">       |
|       `azul`       |        <img src="./icons/Azul.svg" width="48">         |
|      `azure`       |     <img src="./icons/Azure-Dark.svg" width="48">      |
|      `babel`       |        <img src="./icons/Babel.svg" width="48">        |
|       `bash`       |      <img src="./icons/Bash-Dark.svg" width="48">      |
|       `bevy`       |      <img src="./icons/Bevy-Dark.svg" width="48">      |
|    `bitbucket`     |   <img src="./icons/BitBucket-Dark.svg" width="48">    |
|     `blender`      |    <img src="./icons/Blender-Dark.svg" width="48">     |
|    `bootstrap`     |      <img src="./icons/Bootstrap.svg" width="48">      |
|       `bots`       |     <img src="./icons/DiscordBots.svg" width="48">     |
|       `bsd`        |      <img src="./icons/BSD-Dark.svg" width="48">       |
|       `bun`        |      <img src="./icons/Bun-Dark.svg" width="48">       |
|        `c`         |          <img src="./icons/C.svg" width="48">          |
|    `capacitor`     |      <img src="./icons/Capacitor.svg" width="48">      |
|    `cassandra`     |   <img src="./icons/Cassandra-Dark.svg" width="48">    |
|      `clion`       |     <img src="./icons/CLion-Dark.svg" width="48">      |
|     `clojure`      |    <img src="./icons/Clojure-Dark.svg" width="48">     |
|    `cloudflare`    |   <img src="./icons/Cloudflare-Dark.svg" width="48">   |
|      `cmake`       |     <img src="./icons/CMake-Dark.svg" width="48">      |
|     `codepen`      |    <img src="./icons/CodePen-Dark.svg" width="48">     |
|   `coffeescript`   |  <img src="./icons/CoffeeScript-Dark.svg" width="48">  |
|       `cpp`        |         <img src="./icons/CPP.svg" width="48">         |
|     `crystal`      |    <img src="./icons/Crystal-Dark.svg" width="48">     |
|        `cs`        |         <img src="./icons/CS.svg" width="48">          |
|       `css`        |         <img src="./icons/CSS.svg" width="48">         |
|     `cypress`      |    <img src="./icons/Cypress-Dark.svg" width="48">     |
|        `d3`        |       <img src="./icons/D3-Dark.svg" width="48">       |
|       `dart`       |      <img src="./icons/Dart-Dark.svg" width="48">      |
|      `debian`      |     <img src="./icons/Debian-Dark.svg" width="48">     |
|       `deno`       |      <img src="./icons/DENO-Dark.svg" width="48">      |
|      `devto`       |     <img src="./icons/DevTo-Dark.svg" width="48">      |
|     `discord`      |       <img src="./icons/Discord.svg" width="48">       |
|    `discordjs`     |   <img src="./icons/DiscordJS-Dark.svg" width="48">    |
|      `django`      |       <img src="./icons/Django.svg" width="48">        |
|      `docker`      |       <img src="./icons/Docker.svg" width="48">        |
|      `dotnet`      |       <img src="./icons/DotNet.svg" width="48">        |
|     `dynamodb`     |    <img src="./icons/DynamoDB-Dark.svg" width="48">    |
|     `eclipse`      |    <img src="./icons/Eclipse-Dark.svg" width="48">     |
|  `elasticsearch`   | <img src="./icons/Elasticsearch-Dark.svg" width="48">  |
|     `electron`     |      <img src="./icons/Electron.svg" width="48">       |
|      `elixir`      |     <img src="./icons/Elixir-Dark.svg" width="48">     |
|      `elysia`      |     <img src="./icons/Elysia-Dark.svg" width="48">     |
|      `emacs`       |        <img src="./icons/Emacs.svg" width="48">        |
|      `ember`       |        <img src="./icons/Ember.svg" width="48">        |
|     `emotion`      |    <img src="./icons/Emotion-Dark.svg" width="48">     |
|      `eslint`      |       <img src="./icons/ESLint.svg" width="48">        |
|     `express`      |   <img src="./icons/ExpressJS-Dark.svg" width="48">    |
|     `fastapi`      |       <img src="./icons/FastAPI.svg" width="48">       |
|    `fediverse`     |   <img src="./icons/Fediverse-Dark.svg" width="48">    |
|      `figma`       |     <img src="./icons/Figma-Dark.svg" width="48">      |
|     `firebase`     |    <img src="./icons/Firebase-Dark.svg" width="48">    |
|      `flask`       |     <img src="./icons/Flask-Dark.svg" width="48">      |
|     `flutter`      |    <img src="./icons/Flutter-Dark.svg" width="48">     |
|   `fontawesome`    |     <img src="./icons/FontAwesome.svg" width="48">     |
|      `forth`       |        <img src="./icons/Forth.svg" width="48">        |
|     `fortran`      |       <img src="./icons/Fortran.svg" width="48">       |
| `gamemakerstudio`  |   <img src="./icons/GameMakerStudio.svg" width="48">   |
|      `gatsby`      |       <img src="./icons/Gatsby.svg" width="48">        |
|       `gcp`        |      <img src="./icons/GCP-Dark.svg" width="48">       |
|      `gcruz`       |     <img src="./icons/GCruz-Dark.svg" width="48">      |
|     `gherkin`      |    <img src="./icons/Gherkin-Dark.svg" width="48">     |
|       `git`        |         <img src="./icons/Git.svg" width="48">         |
|      `github`      |     <img src="./icons/Github-Dark.svg" width="48">     |
|  `githubactions`   | <img src="./icons/GithubActions-Dark.svg" width="48">  |
|      `gitlab`      |     <img src="./icons/GitLab-Dark.svg" width="48">     |
|      `gmail`       |     <img src="./icons/Gmail-Dark.svg" width="48">      |
|        `go`        |       <img src="./icons/GoLang.svg" width="48">        |
|      `godot`       |     <img src="./icons/Godot-Dark.svg" width="48">      |
|      `gradle`      |     <img src="./icons/Gradle-Dark.svg" width="48">     |
|     `grafana`      |    <img src="./icons/Grafana-Dark.svg" width="48">     |
|     `graphql`      |    <img src="./icons/GraphQL-Dark.svg" width="48">     |
|       `gtk`        |      <img src="./icons/GTK-Dark.svg" width="48">       |
|       `gulp`       |        <img src="./icons/Gulp.svg" width="48">         |
|     `haskell`      |    <img src="./icons/Haskell-Dark.svg" width="48">     |
|       `haxe`       |      <img src="./icons/Haxe-Dark.svg" width="48">      |
|    `haxeflixel`    |   <img src="./icons/HaxeFlixel-Dark.svg" width="48">   |
|      `heroku`      |       <img src="./icons/Heroku.svg" width="48">        |
|    `hibernate`     |   <img src="./icons/Hibernate-Dark.svg" width="48">    |
|       `html`       |        <img src="./icons/HTML.svg" width="48">         |
|       `htmx`       |      <img src="./icons/Htmx-Dark.svg" width="48">      |
|      `husky`       |     <img src="./icons/Husky-Dark.svg" width="48">      |
|       `idea`       |      <img src="./icons/Idea-Dark.svg" width="48">      |
|    `instagram`     |      <img src="./icons/Instagram.svg" width="48">      |
|       `ipfs`       |      <img src="./icons/IPFS-Dark.svg" width="48">      |
|       `java`       |      <img src="./icons/Java-Dark.svg" width="48">      |
|     `jenkins`      |    <img src="./icons/Jenkins-Dark.svg" width="48">     |
|       `jest`       |        <img src="./icons/Jest.svg" width="48">         |
|      `jquery`      |       <img src="./icons/JQuery.svg" width="48">        |
|        `js`        |     <img src="./icons/JavaScript.svg" width="48">      |
|      `julia`       |     <img src="./icons/Julia-Dark.svg" width="48">      |
|       `jwt`        |      <img src="./icons/JWT-Dark.svg" width="48">       |
|      `kafka`       |        <img src="./icons/Kafka.svg" width="48">        |
|       `kali`       |      <img src="./icons/Kali-Dark.svg" width="48">      |
|      `kotlin`      |     <img src="./icons/Kotlin-Dark.svg" width="48">     |
|       `ktor`       |      <img src="./icons/Ktor-Dark.svg" width="48">      |
|    `kubernetes`    |     <img src="./icons/Kubernetes.svg" width="48">      |
|     `laravel`      |    <img src="./icons/Laravel-Dark.svg" width="48">     |
|      `latex`       |     <img src="./icons/LaTeX-Dark.svg" width="48">      |
|       `less`       |      <img src="./icons/Less-Dark.svg" width="48">      |
|     `linkedin`     |      <img src="./icons/LinkedIn.svg" width="48">       |
|      `linux`       |     <img src="./icons/Linux-Dark.svg" width="48">      |
|       `lit`        |      <img src="./icons/Lit-Dark.svg" width="48">       |
|       `lua`        |      <img src="./icons/Lua-Dark.svg" width="48">       |
|     `mastodon`     |    <img src="./icons/Mastodon-Dark.svg" width="48">    |
|    `materialui`    |   <img src="./icons/MaterialUI-Dark.svg" width="48">   |
|      `matlab`      |     <img src="./icons/Matlab-Dark.svg" width="48">     |
|      `maven`       |     <img src="./icons/Maven-Dark.svg" width="48">      |
|        `md`        |    <img src="./icons/Markdown-Dark.svg" width="48">    |
|       `mint`       |      <img src="./icons/Mint-Dark.svg" width="48">      |
|     `misskey`      |    <img src="./icons/Misskey-Dark.svg" width="48">     |
|     `mongodb`      |       <img src="./icons/MongoDB.svg" width="48">       |
|      `mysql`       |     <img src="./icons/MySQL-Dark.svg" width="48">      |
|      `neovim`      |     <img src="./icons/NeoVim-Dark.svg" width="48">     |
|      `nestjs`      |     <img src="./icons/NestJS-Dark.svg" width="48">     |
|     `netlify`      |    <img src="./icons/Netlify-Dark.svg" width="48">     |
|      `nextjs`      |     <img src="./icons/NextJS-Dark.svg" width="48">     |
|      `nginx`       |        <img src="./icons/Nginx.svg" width="48">        |
|       `nim`        |      <img src="./icons/Nim-Dark.svg" width="48">       |
|       `nix`        |      <img src="./icons/Nix-Dark.svg" width="48">       |
|      `nodejs`      |     <img src="./icons/NodeJS-Dark.svg" width="48">     |
|      `notion`      |     <img src="./icons/Notion-Dark.svg" width="48">     |
|       `npm`        |      <img src="./icons/Npm-Dark.svg" width="48">       |
|      `nuxtjs`      |     <img src="./icons/NuxtJS-Dark.svg" width="48">     |
|     `obsidian`     |    <img src="./icons/Obsidian-Dark.svg" width="48">    |
|      `ocaml`       |        <img src="./icons/OCaml.svg" width="48">        |
|      `octave`      |     <img src="./icons/Octave-Dark.svg" width="48">     |
|      `opencv`      |     <img src="./icons/OpenCV-Dark.svg" width="48">     |
|    `openshift`     |      <img src="./icons/OpenShift.svg" width="48">      |
|    `openstack`     |   <img src="./icons/OpenStack-Dark.svg" width="48">    |
|      `oracle`      |       <img src="./icons/Oracle.svg" width="48">        |
|       `p5js`       |        <img src="./icons/p5js.svg" width="48">         |
|       `perl`       |        <img src="./icons/Perl.svg" width="48">         |
|       `php`        |      <img src="./icons/PHP-Dark.svg" width="48">       |
|     `phpstorm`     |    <img src="./icons/PhpStorm-Dark.svg" width="48">    |
|      `pinia`       |     <img src="./icons/Pinia-Dark.svg" width="48">      |
|       `pkl`        |      <img src="./icons/Pkl-Dark.svg" width="48">       |
|      `plan9`       |     <img src="./icons/Plan9-Dark.svg" width="48">      |
|   `planetscale`    |  <img src="./icons/PlanetScale-Dark.svg" width="48">   |
|    `playwright`    |   <img src="./icons/Playwright-Dark.svg" width="48">   |
|       `pnpm`       |      <img src="./icons/Pnpm-Dark.svg" width="48">      |
|     `postgres`     |   <img src="./icons/PostgreSQL-Dark.svg" width="48">   |
|     `postman`      |       <img src="./icons/Postman.svg" width="48">       |
|    `powershell`    |   <img src="./icons/Powershell-Dark.svg" width="48">   |
|        `pr`        |      <img src="./icons/Premiere.svg" width="48">       |
|     `prettier`     |    <img src="./icons/Prettier-Dark.svg" width="48">    |
|      `prisma`      |       <img src="./icons/Prisma.svg" width="48">        |
|    `processing`    |   <img src="./icons/Processing-Dark.svg" width="48">   |
|    `prometheus`    |     <img src="./icons/Prometheus.svg" width="48">      |
|        `ps`        |      <img src="./icons/Photoshop.svg" width="48">      |
|       `pug`        |      <img src="./icons/Pug-Dark.svg" width="48">       |
|        `py`        |     <img src="./icons/Python-Dark.svg" width="48">     |
|     `pycharm`      |    <img src="./icons/PyCharm-Dark.svg" width="48">     |
|     `pydantic`     |    <img src="./icons/Pydantic-Dark.svg" width="48">    |
|     `pytorch`      |    <img src="./icons/PyTorch-Dark.svg" width="48">     |
|        `qt`        |       <img src="./icons/QT-Dark.svg" width="48">       |
|        `r`         |       <img src="./icons/R-Dark.svg" width="48">        |
|     `rabbitmq`     |    <img src="./icons/RabbitMQ-Dark.svg" width="48">    |
|      `rails`       |        <img src="./icons/Rails.svg" width="48">        |
|   `raspberrypi`    |  <img src="./icons/RaspberryPi-Dark.svg" width="48">   |
|      `react`       |     <img src="./icons/React-Dark.svg" width="48">      |
|    `reactivex`     |   <img src="./icons/ReactiveX-Dark.svg" width="48">    |
|   `reactrouter`    |  <img src="./icons/ReactRouter-Dark.svg" width="48">   |
|      `redhat`      |     <img src="./icons/RedHat-Dark.svg" width="48">     |
|      `redis`       |     <img src="./icons/Redis-Dark.svg" width="48">      |
|      `redux`       |        <img src="./icons/Redux.svg" width="48">        |
|      `regex`       |     <img src="./icons/Regex-Dark.svg" width="48">      |
|      `remix`       |     <img src="./icons/Remix-Dark.svg" width="48">      |
|      `render`      |       <img src="./icons/Render.svg" width="48">        |
|      `replit`      |     <img src="./icons/Replit-Dark.svg" width="48">     |
|      `rider`       |     <img src="./icons/Rider-Dark.svg" width="48">      |
|   `robloxstudio`   |    <img src="./icons/RobloxStudio.svg" width="48">     |
|      `rocket`      |       <img src="./icons/Rocket.svg" width="48">        |
|     `rollupjs`     |    <img src="./icons/RollupJS-Dark.svg" width="48">    |
|       `ros`        |      <img src="./icons/ROS-Dark.svg" width="48">       |
|       `ruby`       |        <img src="./icons/Ruby.svg" width="48">         |
|       `rust`       |        <img src="./icons/Rust.svg" width="48">         |
|       `sass`       |        <img src="./icons/Sass.svg" width="48">         |
|      `scala`       |     <img src="./icons/Scala-Dark.svg" width="48">      |
|     `selenium`     |      <img src="./icons/Selenium.svg" width="48">       |
|      `sentry`      |       <img src="./icons/Sentry.svg" width="48">        |
|    `sequelize`     |   <img src="./icons/Sequelize-Dark.svg" width="48">    |
|     `sketchup`     |    <img src="./icons/Sketchup-Dark.svg" width="48">    |
|     `sklearn`      |  <img src="./icons/ScikitLearn-Dark.svg" width="48">   |
|     `solidity`     |      <img src="./icons/Solidity.svg" width="48">       |
|     `solidjs`      |    <img src="./icons/SolidJS-Dark.svg" width="48">     |
|     `spotify`      |    <img src="./icons/Spotify-Dark.svg" width="48">     |
|      `spring`      |     <img src="./icons/Spring-Dark.svg" width="48">     |
|       `sql`        |      <img src="./icons/SQL-Dark.svg" width="48">       |
|      `sqlite`      |       <img src="./icons/SQLite.svg" width="48">        |
|  `stackoverflow`   | <img src="./icons/StackOverflow-Dark.svg" width="48">  |
| `styledcomponents` |  <img src="./icons/StyledComponents.svg" width="48">   |
|     `sublime`      |    <img src="./icons/Sublime-Dark.svg" width="48">     |
|     `supabase`     |    <img src="./icons/Supabase-Dark.svg" width="48">    |
|      `svelte`      |       <img src="./icons/Svelte.svg" width="48">        |
|       `svg`        |      <img src="./icons/SVG-Dark.svg" width="48">       |
|      `swift`       |        <img src="./icons/Swift.svg" width="48">        |
|     `symfony`      |    <img src="./icons/Symfony-Dark.svg" width="48">     |
|     `tailwind`     |  <img src="./icons/TailwindCSS-Dark.svg" width="48">   |
|      `tauri`       |     <img src="./icons/Tauri-Dark.svg" width="48">      |
|    `tensorflow`    |   <img src="./icons/TensorFlow-Dark.svg" width="48">   |
|    `terraform`     |   <img src="./icons/Terraform-Dark.svg" width="48">    |
|  `testinglibrary`  | <img src="./icons/TestingLibrary-Dark.svg" width="48"> |
|     `threejs`      |    <img src="./icons/ThreeJS-Dark.svg" width="48">     |
|        `ts`        |     <img src="./icons/TypeScript.svg" width="48">      |
|     `twitter`      |       <img src="./icons/Twitter.svg" width="48">       |
|      `ubuntu`      |     <img src="./icons/Ubuntu-Dark.svg" width="48">     |
|      `unity`       |     <img src="./icons/Unity-Dark.svg" width="48">      |
|      `unreal`      |    <img src="./icons/UnrealEngine.svg" width="48">     |
|     `uvicorn`      |    <img src="./icons/Uvicorn-Dark.svg" width="48">     |
|        `v`         |       <img src="./icons/V-Dark.svg" width="48">        |
|       `vala`       |        <img src="./icons/Vala.svg" width="48">         |
|      `vercel`      |     <img src="./icons/Vercel-Dark.svg" width="48">     |
|     `verilog`      |       <img src="./icons/Verilog.svg" width="48">       |
|       `vim`        |      <img src="./icons/VIM-Dark.svg" width="48">       |
|   `visualstudio`   |  <img src="./icons/VisualStudio-Dark.svg" width="48">  |
|       `vite`       |      <img src="./icons/Vite-Dark.svg" width="48">      |
|      `vitest`      |     <img src="./icons/Vitest-Dark.svg" width="48">     |
|      `vscode`      |     <img src="./icons/VSCode-Dark.svg" width="48">     |
|     `vscodium`     |    <img src="./icons/VSCodium-Dark.svg" width="48">    |
|       `vue`        |     <img src="./icons/VueJS-Dark.svg" width="48">      |
|     `vuetify`      |    <img src="./icons/Vuetify-Dark.svg" width="48">     |
|       `wasm`       |     <img src="./icons/WebAssembly.svg" width="48">     |
|     `webflow`      |       <img src="./icons/Webflow.svg" width="48">       |
|     `webpack`      |    <img src="./icons/Webpack-Dark.svg" width="48">     |
|    `websocket`     |   <img src="./icons/WebSocket-Dark.svg" width="48">    |
|     `webstorm`     |    <img src="./icons/WebStorm-Dark.svg" width="48">    |
|     `windicss`     |    <img src="./icons/WindiCSS-Dark.svg" width="48">    |
|     `windows`      |    <img src="./icons/Windows-Dark.svg" width="48">     |
|    `wordpress`     |      <img src="./icons/Wordpress.svg" width="48">      |
|     `workers`      |    <img src="./icons/Workers-Dark.svg" width="48">     |
|        `xd`        |         <img src="./icons/XD.svg" width="48">          |
|       `yarn`       |      <img src="./icons/Yarn-Dark.svg" width="48">      |
|       `yew`        |      <img src="./icons/Yew-Dark.svg" width="48">       |
|       `zig`        |      <img src="./icons/Zig-Dark.svg" width="48">       |

## Estrutura do repositório

```
icons/                   os 255 ícones (429 arquivos, contando os pares de tema)
brand/                   assets da marca <gcruz.dev/> + o documento do DS
lib/icons.mjs            lógica compartilhada: resolução de nomes e composição
index.js                 entrada do Cloudflare Worker
api/*.mjs                entradas da Vercel
public/index.html        a página: galeria, montador e documentação
scripts/                 gerador da tabela do readme e dos assets da Vercel
build.js                 empacota icons/ em dist/icons.{json,mjs}
```

## Adicionar um ícone

1. Coloque o SVG em `icons/` seguindo as convenções abaixo.
2. `npm run readme` para regenerar a tabela.
3. Publique.

Convenções, as mesmas dos 255 que já existem:

- `viewBox="0 0 256 256"`, `width`/`height` 256, `fill="none"` na raiz
- fundo `<rect width="256" height="256" rx="60">`
- arte entre as coordenadas 41 e 215
- par temático `Nome-Dark.svg` (fundo `#242938`) + `Nome-Light.svg` (`#F4F2ED`);
  se o logo funciona sobre a cor da marca, use um arquivo único com essa cor
- **sem hífen no nome** além do sufixo de tema — o ID vem de `split('-')[0]`, e um
  terceiro segmento é ignorado pelo resolvedor
- **sem** `<text>`, `<style>`, `class=` ou referência externa; texto vira `<path>`
- **evite `id`/`<defs>`**; se precisar, prefixe com o nome do ícone — o endpoint
  concatena todos os ícones num único SVG, e `id` repetido entre ícones colide

## Créditos e licença

Este repositório é um fork de [skillicons.dev](https://skillicons.dev), criado por
[tandpfun](https://github.com/tandpfun), sob licença MIT. Se o projeto original
foi útil para você, considere apoiar o autor dele:
[ko-fi.com/thijsdev](https://ko-fi.com/Q5Q860KQ2).

Os logotipos de terceiros são marcas dos respectivos donos e aparecem aqui apenas
para identificação. A marca `<gcruz.dev/>` e os assets em `brand/` são de
Guilherme Cruz. JetBrains Mono é licenciada sob OFL-1.1.
