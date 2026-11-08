# Inventário técnico — skill-icons

> Registro histórico da auditoria inicial. As implementações posteriores estão em [ANIMACAO_DOS_ICONES.md](ANIMACAO_DOS_ICONES.md) e [ATUALIZACAO_DO_CATALOGO.md](ATUALIZACAO_DO_CATALOGO.md). Os achados e as contagens deste documento se referem à base auditada, não ao estado posterior às alterações.

**Base:** `6f6ed481f3cacc62b1a322e5ba19fa35958d28e3`, branch main.  
**Data:** 08/11/2026. Este inventário retrata o código anterior às mudanças futuras; as três páginas em docs e o novo README.md são a entrega documental. Consulte o [diagnóstico](ANALISE_E_PLANO_DE_MELHORIAS.md) para classificação dos achados e o [roadmap](ROADMAP_DE_IMPLEMENTACAO.md) para implementação.

## 1. Dimensão e linguagens

526 arquivos rastreados na base. Destes: 463 SVGs (433 em icons, 28 em brand e dois em .github), 12 JS, 15 MJS, nove HTML (seis páginas e três partials), quatro CSS, três JSON, cinco YML, quatro Markdown, dois WOFF2, dois PNG, um TOML, um lock e cinco arquivos sem extensão convencional. Não há código TypeScript, SQL, migrações, ORM, Dockerfile ou dependência de runtime declarada.

O ambiente da análise usou Node 24.22.1/npm 11.9.0 e Chromium do sistema. As ferramentas de auditoria ficaram em diretório separado; não foram adicionadas ao lock/package do projeto. 19 categorias particionam os 257 IDs; 44 aliases; 176 IDs têm variante light/dark e 81 têm arquivo único.

## 2. Estrutura de diretórios

```text
skill-icons/
├── .github/
│   ├── workflows/wrangler-action.yml      # checks + publicação Worker opcional (inválido na base)
│   ├── ISSUE_TEMPLATE/                   # bug-report, feature-request, suggest-icon
│   ├── FUNDING.yml                       # apoio ao projeto original
│   └── text-logo*.svg, example-*.png
├── api/
│   ├── _adapter.mjs                      # serve(route), ponte req/res → Request/Response
│   ├── render.mjs                        # rota pública /icons por rewrite
│   ├── icons.mjs                         # /api/icons
│   ├── manifest.mjs                      # /api/manifest
│   └── svgs.mjs                          # /api/svgs
├── brand/                                # 28 SVGs e README de identidade
├── icons/                                # 433 SVGs fonte
├── lib/icons.mjs                         # dados, aliases, render e handle
├── scripts/                              # 9 scripts MJS de build/qualidade/dev
├── site/
│   ├── pages/                            # index, design-system, marca, changelog, sobre, 404
│   ├── partials/                         # head, header, footer
│   ├── css/                              # tokens, base, components, paginas
│   ├── js/                               # 10 módulos browser
│   ├── fonts/                            # dois WOFF2 + documentação
│   └── changelog.json
├── build.js                              # CommonJS; geração do bundle de ícones
├── index.js                              # entrada Worker ESM, processada pelo Wrangler
├── package.json, yarn.lock                # duas devDependencies; Yarn lock v1
├── vercel.json, wrangler.toml
├── readme.md, DEPLOY.md, LICENSE          # documentação original e MIT
├── README.md                             # nova entrada documental desta entrega
├── docs/                                 # diagnóstico, roadmap e este inventário
├── dist/                                 # gerado/ignorado: icons.json e icons.mjs
└── public/                               # gerado/ignorado: HTML, CSS, JS, fontes, SVGs, marca, manifest
```

`dist/` e `public/` só surgem após build. `worker/`, `.wrangler/`, `.vercel/`, node_modules e arquivos de ambiente comuns são ignorados. A base não contém AGENTS.md. Não existem testes de comportamento rastreados; ícones com nomes de ferramentas de teste são apenas imagens.

## 3. Fontes de verdade e dados gerados

| Informação          | Fonte                                           | Consumidor/saída                       | Invariante                                                         |
| ------------------- | ----------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------ |
| Conteúdo SVG        | icons/*.svg                                     | build.js → dist/icons.json e icons.mjs | Chaves em minúsculas, ID derivado antes do primeiro hífen          |
| Aliases             | shortNames em lib/icons.mjs                     | API; manifesto; regex em readme-table  | Todo destino precisa existir                                       |
| Tema                | Sufixo -Dark/-Light dos nomes                   | themedIcons e manifest                 | ID temático exige os dois arquivos no manifesto web                |
| Categorias          | scripts/categories.mjs                          | tabela e manifest estático             | 257 IDs exatamente uma vez, verificado por readme:check            |
| Tokens visuais      | site/css/tokens.css                             | CSS final, design-system e contraste   | Dois temas e pares de contraste declarados                         |
| Conteúdo de páginas | site/pages + partials                           | public/*.html                          | Cada página declara comentário pagina com JSON na primeira linha   |
| CSS final           | tokens → base → components → paginas            | public/css/site.css                    | Ordem explícita, comentários removidos; não há bundler CSS externo |
| Histórico           | site/changelog.json                             | public/changelog.html                  | Texto de descrição aceita markup de fonte confiável no repo        |
| Tabela de ícones    | ícones + aliases + categorias + IDs já exibidos | seção Lista de ícones de readme.md     | Preserva aliases anteriormente publicados                          |
| Preferências        | localStorage si:*                               | builder/tema                           | Não há sincronização entre dispositivos nem backup remoto          |

O build lê todos os arquivos em icons sem filtro de extensão; o gerador de assets faz filtro `.svg`. Essa diferença é um risco para novas contribuições, não um arquivo inválido encontrado atualmente.

## 4. Arquivos de execução e módulos

### Backend

| Arquivo / tamanho em linhas na base        | Exportações ou papel                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| build.js / 25                              | Executa leitura de icons e grava JSON/ESM                                                    |
| index.js / 20                              | default.fetch; fallback fetch(request); catch expõe stack                                    |
| lib/icons.mjs / 211                        | icons, iconNameList, shortNames, themedIcons, generateSvg, parseShortNames, manifest, handle |
| api/_adapter.mjs / 57                      | serve(route), absoluteUrl interno; aplica rota pública ao rewrite                            |
| api/icons, manifest, render, svgs / 4 cada | Export default serve com rota fixa                                                           |

### Build, ferramentas e servidor

| Arquivo                       | Papel                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| scripts/build-pages.mjs       | 416 linhas; gera seis HTMLs; símbolo inline de marca, changelog e documentação dos tokens; junta CSS e copia módulos/fontes |
| scripts/categories.mjs        | 366 linhas de classificação CATEGORIES; título, slug, IDs e notas                                                           |
| scripts/contraste.mjs         | 78 linhas; verifica pares de cores, limites 4.5/3 e pares informativos                                                      |
| scripts/normalizar-icones.mjs | 214 linhas; normalização de fundos/cantos conhecidos; default modifica, --check/--dry não modificam                         |
| scripts/readme-table.mjs      | 177 linhas; gera ou verifica tabela; lê readme.md minúsculo                                                                 |
| scripts/responsivo.mjs        | 234 linhas; Chromium/Playwright opcional; 180 combinações de layout; --base=URL                                             |
| scripts/serve.mjs             | 74 linhas; estáticos, API e 404 local; porta padrão 4173                                                                    |
| scripts/tokens.mjs            | 132 linhas; paletas, grupos, luminancia, razao; parser por regex de CSS controlado                                          |
| scripts/vercel-assets.mjs     | 81 linhas; copia SVG/marca e gera manifest enriquecido                                                                      |

O diretório scripts contém nove arquivos MJS; o total de 15 MJS inclui cinco em api e um em lib.

### Frontend

| Módulo      | Linhas | Responsabilidade / dependências                                         |
| ----------- | ------ | ----------------------------------------------------------------------- |
| builder.js  | 378    | Montador e estado; dados, store, tema, toast, download                  |
| catalogo.js | 64     | Categorias/tiles/cópia; dados, tema, toast                              |
| dados.js    | 86     | Manifesto, normalização, busca, destaque e arquivo por tema             |
| download.js | 152    | Fetch SVG cacheado; rasterização canvas; download; lote sequencial; zip |
| marca.js    | 169    | Grupos de variações de marca e cópia de SVG/URL                         |
| site.js     | 131    | Bootstrap, imports dinâmicos, overlay/foco, menu, modais, cópias        |
| store.js    | 38     | Wrapper tolerante a localStorage/JSON; prefixo si:                      |
| tema.js     | 55     | Tema, persistência, matchMedia e ouvintes                               |
| toast.js    | 26     | Mensagem com timer e ação de cópia                                      |
| zip.js      | 140    | CRC32, cabeçalhos ZIP, central directory, EOCD; deflate-raw ou store    |

### UI e páginas

| Fontes                                  | Conteúdo                                                     |
| --------------------------------------- | ------------------------------------------------------------ |
| site/pages/index.html                   | Hero, montador, catálogo, documentação da API e exemplos     |
| site/pages/design-system.html           | Tokens, componentes demonstrativos e amostras                |
| site/pages/marca.html                   | Biblioteca visual e regras de identidade                     |
| site/pages/changelog.html               | Histórico derivado do JSON                                   |
| site/pages/sobre.html                   | Fork, diferenças, funcionamento e créditos                   |
| site/pages/404.html                     | Rota desconhecida com orientação                             |
| site/partials/head.html                 | SEO básico/Open Graph, fontes/CSS e script inicial de tema   |
| site/partials/header.html / footer.html | Navegação comum, drawer mobile, marca, links e toast         |
| site/css/tokens.css                     | 200 linhas; cores, tipografia, espaço, superfícies e motion  |
| site/css/base.css                       | 269 linhas; reset, fontes, tipografia, foco e estrutura      |
| site/css/components.css                 | 828 linhas; botões, chips, tabs, campos, overlays, navegação |
| site/css/paginas.css                    | 867 linhas; composição específica das páginas                |

## 5. Endpoints e armazenamento

| Rota                           | Resposta                           | Implementação / observações                                                          |
| ------------------------------ | ---------------------------------- | ------------------------------------------------------------------------------------ |
| GET /icons?i=js,ts             | SVG composto                       | i/icons; t/theme dark ou light; perline 1–50 padrão 15; all; aliases; case-sensitive |
| /api/icons                     | Array JSON de IDs                  | Não restringe método no handler atual                                                |
| /api/manifest                  | Array de {id,themed,dark,light}    | dark/light são chaves lógicas minúsculas sem extensão, não URLs estáticas            |
| /api/svgs                      | Objeto JSON de todo o conteúdo SVG | Grande payload; usa cache JSON                                                       |
| /manifest.json                 | {count,categorias,icons}           | Estático: categoria, aliases e arquivos reais com caixa/extensão                     |
| /svg/Nome.svg                  | SVG individual                     | Vercel estático; não depende de função; case-sensitive conforme filesystem           |
| /brand/arquivo.svg             | Marca                              | Estático; documentos de marca também são copiados                                    |
| /css/site.css, /js/_, /fonts/_ | Recursos do site                   | Build em public                                                                      |

Cache da função: SVG `max-age=3600, s-maxage=86400, stale-while-revalidate=604800`; JSON `max-age=600, s-maxage=86400`. Vercel estático: SVG `max-age=86400, s-maxage=31536000, stale-while-revalidate=604800`; fontes `max-age=31536000, immutable`; CSS/JS `max-age=3600, s-maxage=86400, stale-while-revalidate=604800`; brand `max-age=3600, s-maxage=86400`; manifesto `max-age=600, s-maxage=86400`. CORS wildcard declarado apenas em /svg. Valores são configuração do repositório, não headers medidos de produção.

Storage browser: `si:tema`, `si:selecao` (array JSON), `si:categoria`, `si:perline`, `si:formato`, `si:lado`. Não há DB, tabela, chave relacional, índice, migration, sessão JWT, cookie de login, RBAC, formulário de upload ou provedor de identidade. Por isso não há análise SQL, plano de índice ou backup de banco aplicável. Git/deploys retidos e dados locais são os objetos de recuperação pertinentes.

## 6. Comandos existentes em package.json

| Script            | Comando literal                                                                   |
| ----------------- | --------------------------------------------------------------------------------- |
| `build`           | `node build.js`                                                                   |
| `dev`             | `node build.js && wrangler dev`                                                   |
| `deploy`          | `node build.js && wrangler deploy`                                                |
| `readme`          | `node scripts/readme-table.mjs`                                                   |
| `readme:check`    | `node scripts/readme-table.mjs --check`                                           |
| `format`          | `prettier --write "**/*.{js,mjs,json,md,css}"`                                    |
| `format:check`    | `prettier --check "**/*.{js,mjs,json,md,css}"`                                    |
| `build:web`       | `node build.js && node scripts/vercel-assets.mjs && node scripts/build-pages.mjs` |
| `site`            | `node scripts/build-pages.mjs`                                                    |
| `dev:web`         | `npm run build:web && node scripts/serve.mjs`                                     |
| `contraste`       | `node scripts/contraste.mjs`                                                      |
| `contraste:check` | `node scripts/contraste.mjs --check`                                              |
| `icones`          | `node scripts/normalizar-icones.mjs`                                              |
| `icones:check`    | `node scripts/normalizar-icones.mjs --check`                                      |
| `responsivo`      | `node scripts/responsivo.mjs`                                                     |

`npm run dev`/`deploy` são o caminho Worker, não o site completo. `dev:web` faz build completo e inicia servidor local sem hot reload/watch. `site` precisa do catálogo em dist previamente. `format`, `readme` e `icones` escrevem arquivos; use os equivalentes `:check` durante auditoria. Não há `test`, `lint`, `preview` ou `start` no package.json. Não inventar esses comandos antes de implementá-los.

## 7. Variáveis e configuração

| Nome            | Onde                     | Obrigatoriedade / sensibilidade                                                                      |
| --------------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| PORT            | scripts/serve.mjs        | Opcional, porta local, padrão 4173; não segredo                                                      |
| PLAYWRIGHT_CORE | scripts/responsivo.mjs   | Opcional, caminho/identificador de módulo para import dinâmico                                       |
| CHROMIUM        | scripts/responsivo.mjs   | Opcional; default é /opt/pw-browsers/chromium-1194/chrome-linux/chrome, específico de outro ambiente |
| CF_API_TOKEN    | Secret do GitHub Actions | Somente publicação Worker; credencial, nunca inserir em docs/código                                  |
| CF_ACCOUNT_ID   | Secret do GitHub Actions | Conta para publicação Worker; tratar configuração de conta de forma privada                          |

Não há arquivo .env.example ou leitura de .env pelo código da aplicação. Não há variável de runtime necessária para o site/API Vercel. Autorização de CLI Cloudflare usa login ou mecanismo próprio da ferramenta, não sessão de usuário da aplicação. Tokens e IDs de conta não foram lidos nesta auditoria.

Wrangler: name skill-icons; main index.js; compatibility_date 2026-08-01; workers_dev true; rota de domínio próprio apenas comentada. Vercel: buildCommand composto; outputDirectory public; rewrite /icons → /api/render. Runtime Node da conta Vercel não está fixado nos arquivos. Workflow usa Node 20, checkout@v4/setup-node@v4/wrangler-action@v3 e Wrangler major 4; não realiza install.

## 8. Dependências e versões

| Pacote direto | Faixa declarada | Lock auditado | Uso                       |
| ------------- | --------------- | ------------- | ------------------------- |
| prettier      | ^3.6.2          | 3.9.6         | devDependency, formatação |
| wrangler      | ^4.42.0         | 4.120.0       | devDependency, CLI Worker |

Nenhuma dependencies/peerDependencies de produção declarada. Node built-ins sustentam build/site/servidor; Request/Response globais são usados no backend. Playwright não faz parte do manifesto nem do lock da aplicação. Não atribuir React, Vue, Next, Supabase, Redis ou banco ao projeto só porque seus ícones estão disponíveis.

### 8.1 Avisos retornados por yarn audit em 08/11/2026

O comando foi executado por Yarn 1 instalado fora do repo, lendo o lock existente, sem instalar dependências do projeto e sem modificar fontes. Exit 14 corresponde ao bitmask das severidades baixa/moderada/alta. Resultado: 20 avisos, 92 entradas de dependência na resposta. O relatório marca dev=false, mas os pacotes diretos do projeto são ambos devDependencies; a exposição operacional deve ser triada nessa perspectiva. Não equivale a teste de exploração nem a inventário dos binários internos do provedor.

| Pacote resolvido | Caminho                     | Advisory                                                                 | Severidade do registro | Versão corrigida informada |
| ---------------- | --------------------------- | ------------------------------------------------------------------------ | ---------------------- | -------------------------- |
| sharp 0.35.2     | `wrangler>miniflare>sharp`  | [GHSA-rgj7-g3m4-5g8c](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c) | high                   | `>=0.35.4`                 |
| sharp 0.35.2     | `wrangler>miniflare>sharp`  | [GHSA-wq5f-xc86-pv6w](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) | high                   | `>=0.35.5`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-3wwx-pv8p-q78v](https://github.com/advisories/GHSA-3wwx-pv8p-q78v) | moderate               | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-pmjh-fq2x-6v4x](https://github.com/advisories/GHSA-pmjh-fq2x-6v4x) | moderate               | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-r53p-7pc4-xj5r](https://github.com/advisories/GHSA-r53p-7pc4-xj5r) | low                    | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-rfgv-xxqx-mfg5](https://github.com/advisories/GHSA-rfgv-xxqx-mfg5) | high                   | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-3xpg-4rpp-hhhm](https://github.com/advisories/GHSA-3xpg-4rpp-hhhm) | moderate               | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-2jfj-6hjv-fm6j](https://github.com/advisories/GHSA-2jfj-6hjv-fm6j) | moderate               | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-2gqq-gqf2-x968](https://github.com/advisories/GHSA-2gqq-gqf2-x968) | low                    | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-w293-vg96-wgc3](https://github.com/advisories/GHSA-w293-vg96-wgc3) | high                   | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-8436-99hf-9mmv](https://github.com/advisories/GHSA-8436-99hf-9mmv) | low                    | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-rx4f-c7p8-82vq](https://github.com/advisories/GHSA-rx4f-c7p8-82vq) | moderate               | `>=7.29.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-4qv8-2p9j-2685](https://github.com/advisories/GHSA-4qv8-2p9j-2685) | moderate               | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-f72v-6w45-q472](https://github.com/advisories/GHSA-f72v-6w45-q472) | moderate               | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-xjj6-f33q-929c](https://github.com/advisories/GHSA-xjj6-f33q-929c) | high                   | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-4w7w-5xrc-9h26](https://github.com/advisories/GHSA-4w7w-5xrc-9h26) | high                   | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-2m5v-pch6-74hx](https://github.com/advisories/GHSA-2m5v-pch6-74hx) | high                   | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-qrxm-fqhp-jwvm](https://github.com/advisories/GHSA-qrxm-fqhp-jwvm) | high                   | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-9fm3-97px-rjf6](https://github.com/advisories/GHSA-9fm3-97px-rjf6) | moderate               | `>=7.30.1`                 |
| undici 7.29.0    | `wrangler>miniflare>undici` | [GHSA-55wc-3pg8-jfw6](https://github.com/advisories/GHSA-55wc-3pg8-jfw6) | moderate               | `>=7.30.1`                 |

Revalidar o registro e release notes ao implementar M08: os resultados refletem a data desta análise. Priorizar atualização compatível do pai Wrangler; manter exceção somente com justificativa de atingibilidade, responsável e data de revisão. Nenhuma atualização foi aplicada.

### 8.2 Resoluções completas do yarn.lock

92 entradas de lock, incluindo variantes opcionais de plataforma e seletores com múltiplas faixas. O inventário abaixo não é uma lista de dependências carregadas pelo navegador nem uma lista de serviços externos usados pela aplicação.

| Seletor do lock                                   | Versão resolvida   |
| ------------------------------------------------- | ------------------ |
| `"@cloudflare/kv-asset-handler@0.5.0"`            | 0.5.0              |
| `"@cloudflare/unenv-preset@2.16.1"`               | 2.16.1             |
| `"@cloudflare/workerd-darwin-64@1.20260801.1"`    | 1.20260801.1       |
| `"@cloudflare/workerd-darwin-arm64@1.20260801.1"` | 1.20260801.1       |
| `"@cloudflare/workerd-linux-64@1.20260801.1"`     | 1.20260801.1       |
| `"@cloudflare/workerd-linux-arm64@1.20260801.1"`  | 1.20260801.1       |
| `"@cloudflare/workerd-windows-64@1.20260801.1"`   | 1.20260801.1       |
| `"@cspotcode/source-map-support@0.8.1"`           | 0.8.1              |
| `"@emnapi/runtime@^1.11.1"`                       | 1.11.3             |
| `"@esbuild/aix-ppc64@0.28.1"`                     | 0.28.1             |
| `"@esbuild/android-arm64@0.28.1"`                 | 0.28.1             |
| `"@esbuild/android-arm@0.28.1"`                   | 0.28.1             |
| `"@esbuild/android-x64@0.28.1"`                   | 0.28.1             |
| `"@esbuild/darwin-arm64@0.28.1"`                  | 0.28.1             |
| `"@esbuild/darwin-x64@0.28.1"`                    | 0.28.1             |
| `"@esbuild/freebsd-arm64@0.28.1"`                 | 0.28.1             |
| `"@esbuild/freebsd-x64@0.28.1"`                   | 0.28.1             |
| `"@esbuild/linux-arm64@0.28.1"`                   | 0.28.1             |
| `"@esbuild/linux-arm@0.28.1"`                     | 0.28.1             |
| `"@esbuild/linux-ia32@0.28.1"`                    | 0.28.1             |
| `"@esbuild/linux-loong64@0.28.1"`                 | 0.28.1             |
| `"@esbuild/linux-mips64el@0.28.1"`                | 0.28.1             |
| `"@esbuild/linux-ppc64@0.28.1"`                   | 0.28.1             |
| `"@esbuild/linux-riscv64@0.28.1"`                 | 0.28.1             |
| `"@esbuild/linux-s390x@0.28.1"`                   | 0.28.1             |
| `"@esbuild/linux-x64@0.28.1"`                     | 0.28.1             |
| `"@esbuild/netbsd-arm64@0.28.1"`                  | 0.28.1             |
| `"@esbuild/netbsd-x64@0.28.1"`                    | 0.28.1             |
| `"@esbuild/openbsd-arm64@0.28.1"`                 | 0.28.1             |
| `"@esbuild/openbsd-x64@0.28.1"`                   | 0.28.1             |
| `"@esbuild/openharmony-arm64@0.28.1"`             | 0.28.1             |
| `"@esbuild/sunos-x64@0.28.1"`                     | 0.28.1             |
| `"@esbuild/win32-arm64@0.28.1"`                   | 0.28.1             |
| `"@esbuild/win32-ia32@0.28.1"`                    | 0.28.1             |
| `"@esbuild/win32-x64@0.28.1"`                     | 0.28.1             |
| `"@img/colour@^1.1.0"`                            | 1.1.0              |
| `"@img/sharp-darwin-arm64@0.35.2"`                | 0.35.2             |
| `"@img/sharp-darwin-x64@0.35.2"`                  | 0.35.2             |
| `"@img/sharp-freebsd-wasm32@0.35.2"`              | 0.35.2             |
| `"@img/sharp-libvips-darwin-arm64@1.3.1"`         | 1.3.1              |
| `"@img/sharp-libvips-darwin-x64@1.3.1"`           | 1.3.1              |
| `"@img/sharp-libvips-linux-arm64@1.3.1"`          | 1.3.1              |
| `"@img/sharp-libvips-linux-arm@1.3.1"`            | 1.3.1              |
| `"@img/sharp-libvips-linux-ppc64@1.3.1"`          | 1.3.1              |
| `"@img/sharp-libvips-linux-riscv64@1.3.1"`        | 1.3.1              |
| `"@img/sharp-libvips-linux-s390x@1.3.1"`          | 1.3.1              |
| `"@img/sharp-libvips-linux-x64@1.3.1"`            | 1.3.1              |
| `"@img/sharp-libvips-linuxmusl-arm64@1.3.1"`      | 1.3.1              |
| `"@img/sharp-libvips-linuxmusl-x64@1.3.1"`        | 1.3.1              |
| `"@img/sharp-linux-arm64@0.35.2"`                 | 0.35.2             |
| `"@img/sharp-linux-arm@0.35.2"`                   | 0.35.2             |
| `"@img/sharp-linux-ppc64@0.35.2"`                 | 0.35.2             |
| `"@img/sharp-linux-riscv64@0.35.2"`               | 0.35.2             |
| `"@img/sharp-linux-s390x@0.35.2"`                 | 0.35.2             |
| `"@img/sharp-linux-x64@0.35.2"`                   | 0.35.2             |
| `"@img/sharp-linuxmusl-arm64@0.35.2"`             | 0.35.2             |
| `"@img/sharp-linuxmusl-x64@0.35.2"`               | 0.35.2             |
| `"@img/sharp-wasm32@0.35.2"`                      | 0.35.2             |
| `"@img/sharp-webcontainers-wasm32@0.35.2"`        | 0.35.2             |
| `"@img/sharp-win32-arm64@0.35.2"`                 | 0.35.2             |
| `"@img/sharp-win32-ia32@0.35.2"`                  | 0.35.2             |
| `"@img/sharp-win32-x64@0.35.2"`                   | 0.35.2             |
| `"@jridgewell/resolve-uri@^3.0.3"`                | 3.1.2              |
| `"@jridgewell/sourcemap-codec@^1.4.10"`           | 1.5.5              |
| `"@jridgewell/trace-mapping@0.3.9"`               | 0.3.9              |
| `"@poppinss/colors@^4.1.5"`                       | 4.1.6              |
| `"@poppinss/dumper@^0.6.4"`                       | 0.6.5              |
| `"@poppinss/exception@^1.2.2"`                    | 1.2.3              |
| `"@sindresorhus/is@^7.0.2"`                       | 7.2.0              |
| `"@speed-highlight/core@^1.2.7"`                  | 1.2.24             |
| `blake3-wasm@2.1.5`                               | 2.1.5              |
| `cookie@^1.0.2`                                   | 1.1.1              |
| `detect-libc@^2.1.2`                              | 2.1.2              |
| `error-stack-parser-es@^1.0.5`                    | 1.0.5              |
| `esbuild@0.28.1`                                  | 0.28.1             |
| `fsevents@2.3.3`                                  | 2.3.3              |
| `kleur@^4.1.5`                                    | 4.1.5              |
| `miniflare@5.20260801.1-alpha`                    | 5.20260801.1-alpha |
| `path-to-regexp@6.3.0`                            | 6.3.0              |
| `pathe@^2.0.3`                                    | 2.0.3              |
| `prettier@^3.6.2`                                 | 3.9.6              |
| `semver@^7.8.4`                                   | 7.8.5              |
| `sharp@0.35.2`                                    | 0.35.2             |
| `supports-color@^10.0.0`                          | 10.2.2             |
| `tslib@^2.4.0`                                    | 2.8.1              |
| `undici@7.29.0`                                   | 7.29.0             |
| `unenv@2.0.0-rc.24`                               | 2.0.0-rc.24        |
| `workerd@1.20260801.1`                            | 1.20260801.1       |
| `wrangler@^4.42.0`                                | 4.120.0            |
| `ws@8.21.0`                                       | 8.21.0             |
| `youch-core@^0.3.3`                               | 0.3.3              |
| `youch@4.1.0-beta.10`                             | 4.1.0-beta.10      |

## 9. Testes, build e evidências

| Verificação executada               | Resultado                                                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Build ícones + assets + páginas     | Passou: 433 SVGs, 257 IDs, 6 páginas, 35.807 B CSS combinado                                                 |
| readme:check                        | Passou antes e após entrega, sem alterar tabela original                                                     |
| contraste:check                     | Pares obrigatórios passaram; bordas edge são informativas, não certificação completa                         |
| icones:check                        | Ícones já normalizados                                                                                       |
| Prettier 3.9.6 no fonte original    | Passou                                                                                                       |
| actionlint 1.7.7                    | Falhou: contexto secrets não permitido em if na linha 44                                                     |
| Browser: seleção/preview/download   | SVG, PNG 256×256, WebP RIFF/WEBP e ZIP de 2 SVGs com CRC válido                                              |
| Layout Chromium                     | 180 combinações, sem transbordo/rolagem horizontal/alvo abaixo de 44px conforme regras do script             |
| Casos negativos                     | DOM injection local, alias herdado, storage inválido, foco sem tabindex e queda do servidor dev reproduzidos |
| Parser XML                          | 433 documentos bem formados; não substitui validação de conteúdo seguro                                      |
| Deploy, conta cloud, dry-run Worker | Não executados                                                                                               |

Tamanhos medidos: dist/icons.json 2.757.170 B; dist/icons.mjs gzip 820.425 B. São saídas locais, não bundle final de deployment nem garantia de plano cloud. Ausência de script test significa ausência de suíte de comportamento configurada, não ausência de toda verificação automatizada.

Histórico remoto consultado: [run da base 32394881516](https://github.com/https-shini/skill-icons/actions/runs/32394881516), failure e zero jobs; mais dois runs anteriores também failure. Acesso pelo conector GitHub foi usado para metadados/runs; consulta GET complementar à API pública forneceu jobs/checks quando o endpoint de checks não era suportado pelo conector. Não foram consultados secrets nem publicados comentários.

## 10. Documentação e manutenção

| Documento                            | Estado/papel                                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| README.md                            | Nova entrada profissional; execução, configuração, status e links                                |
| readme.md                            | Original preservado; uso detalhado, marca e tabela gerada de 257 IDs                             |
| DEPLOY.md                            | Guia existente dos dois provedores; revisar condição CI e afirmações de limites cloud em M01/M24 |
| brand/README.md                      | Especificação da marca e suas variantes                                                          |
| site/fonts/README.md                 | Famílias, subset, motivação e links OFL; complementar textos/proveniência em M22                 |
| docs/ANALISE_E_PLANO_DE_MELHORIAS.md | Diagnóstico, evidências, 26 especificações e estratégia de testes/rollback                       |
| docs/ROADMAP_DE_IMPLEMENTACAO.md     | 26 tarefas em oito fases com dependências e aceite                                               |

Documentação de API no site e readme já existe, mas não há OpenAPI nem contrato automatizado. Não há CONTRIBUTING/SECURITY dedicados, política de release formal ou runbook de incidentes versionado. A necessidade de criá-los deve ser proporcional às tarefas M09/M11/M17/M21/M24, não uma reestruturação editorial sem uso.
