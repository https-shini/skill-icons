# Skill Icons — fork gcruz.dev

Ícones de tecnologias em um único SVG para README e currículo, com um site estático para buscar, selecionar, gerar snippets e baixar arquivos. Fork de [tandpfun/skill-icons](https://github.com/tandpfun/skill-icons), mantido em [https-shini/skill-icons](https://github.com/https-shini/skill-icons).

**Catálogo atual:** 270 IDs, 459 SVGs, 189 IDs com dois temas, 81 aliases e 19 categorias. A biblioteca contém 85 modelos de animação e os 13 novos ícones têm temas claro/escuro. Busca, estado persistido, foco e CI foram melhorados. Veja o [relatório desta atualização](docs/ATUALIZACAO_DO_CATALOGO.md) e a [auditoria histórica](docs/ANALISE_E_PLANO_DE_MELHORIAS.md).

## Animações internas

A biblioteca reúne **85 modelos autorais em oito universos**: marca, física, profundidade, energia, construção, orgânicos, cinema e tecnologia. Inclui assinatura da marca, fragmentação e reconstrução, tecido, prisma, eclipse, orbitais do React, serpentes do Python e carga de contêineres do Docker.

Explore a [galeria de animações](https://skill-icons-gcruz.vercel.app/animacoes), compare os modelos com qualquer ícone, fixe uma prévia e copie a URL ou baixe o SVG. Os 270 IDs têm composição padrão explícita ou contextual; isso não significa 270 animações manuais exclusivas.

No site, hover, foco e seleção ativam movimento; ícones fora da área visível e abas ocultas pausam. O controle permite desligar e a preferência de movimento reduzido do dispositivo prevalece. API padrão: `/icons?i=react,ts,python&animation=true`. Modelo escolhido: `/icons?i=gemini&animation=true&model=explosao-reconstroi`. Sem `animation=true`, a saída permanece estática. SVG e ZIP podem preservar animação; PNG/WebP são estáticos.

A coleção [Meu arsenal](https://skill-icons-gcruz.vercel.app/animacoes?colecao=arsenal#explorar) reúne **43 tecnologias e três ícones da marca com 46 padrões exclusivos**. Java tem vapor da xícara, Linux tem os pés e a piscada do Tux, MySQL salta sobre a água, Sass recebe caligrafia e OpenRouter roteia pacotes. O site permite copiar a URL ou baixar os 46 juntos. Veja o [mapa completo das assinaturas](docs/MEU_ARSENAL.md).

Veja [todos os modelos, arquitetura, compatibilidade e validação](docs/BIBLIOTECA_DE_ANIMACOES.md).

```bash
npm run test:animation
```

Com o site local ativo e Playwright/Chromium disponíveis:

```bash
npm run test:web
npm run test:motion:visual
npm run responsivo
```

## Funcionalidades

- API de composição de SVG com IDs/aliases, tema claro ou escuro e quantidade de ícones por linha.
- Montador com busca por nome, alias e categoria; seleção persistida no navegador e preview.
- Snippets em Markdown, HTML e URL; download individual ou ZIP em SVG, PNG e WebP.
- Catálogo, galeria de 85 animações, design system, biblioteca da marca, changelog, página Sobre e 404.
- Backend compartilhado entre Vercel e Cloudflare Workers; site completo servido pelo caminho Vercel.

Não há contas de usuário, autenticação, banco de dados nem upload. Preferências e seleção ficam em localStorage, sem sincronização remota. Os ícones deste fork não são publicados automaticamente no domínio do projeto original.

## Uso da API

Produção: **https://skill-icons-gcruz.vercel.app**. Veja [URLs prontas e operação](docs/PRODUCAO.md).

Exemplo de uso:

```md
[![Minhas skills](https://skill-icons-gcruz.vercel.app/icons?i=js,ts,react,nodejs&theme=light&perline=4)](https://github.com/https-shini/skill-icons)
```

| Parâmetro  | Comportamento                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------- |
| i ou icons | IDs/aliases separados por vírgula; obrigatório; all seleciona todo o catálogo                     |
| t ou theme | dark ou light; padrão dark                                                                        |
| perline    | Inteiro de 1 a 50; padrão 15                                                                      |
| animation  | true ou false; padrão false                                                                       |
| model      | ID de um dos 85 modelos; opcional, exige animation=true para reproduzir; desconhecido retorna 400 |

IDs são sensíveis a maiúsculas na API. IDs desconhecidos, tema inválido, perline inválido ou ausência de ícones retornam 400. Ordem e repetições válidas são preservadas.

| Rota                            | Resposta                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| /icons?i=js,ts                  | SVG composto                                                                         |
| /api/animations                 | Metadados dos 85 modelos de animação                                                 |
| /animations.json                | Manifesto estático com modelos e universos                                           |
| /motion/reator-atomico-dark.svg | Prévia animada em SVG                                                                |
| /api/icons                      | Lista JSON de IDs                                                                    |
| /api/manifest                   | Metadados públicos com chaves lógicas de variantes, sem extensão                     |
| /api/svgs                       | JSON de todo o conteúdo SVG                                                          |
| /manifest.json                  | Manifesto estático enriquecido para o site, com arquivos reais, aliases e categorias |
| /svg/JavaScript.svg             | SVG individual estático no site Vercel                                               |

Consulte a [lista gerada de ícones](readme.md#lista-de-ícones), o [uso detalhado e a marca](readme.md) e o [inventário de contratos](docs/INVENTARIO_TECNICO.md). `/api/manifest` e `/manifest.json` têm formatos diferentes; os valores do primeiro não são URLs de arquivos estáticos.

## Tecnologias e arquitetura

JavaScript CommonJS/ESM, Node.js, HTML/CSS/SVG e APIs nativas do navegador. Sem framework frontend e sem dependências de produção declaradas. Ferramentas: Prettier `^3.6.2` (lock 3.9.6) e Wrangler `^4.42.0` (lock 4.120.0). O lock existente é Yarn v1.

```text
icons/                 SVGs fonte
brand/                 assets e especificação de identidade
lib/icons.mjs          lógica HTTP e composição compartilhada
lib/motion-*.mjs        registro, primitivas e oito packs de animações
lib/animation.mjs       renderizador SVG e isolamento de IDs
api/                   funções Node e adaptador Vercel
index.js               entrada Cloudflare Worker
build.js               gera dist/icons.json e dist/icons.mjs
scripts/               geradores, verificadores e servidor local
site/pages/            sete páginas HTML
site/partials/         head, navegação e rodapé
site/css/              tokens, base, componentes e páginas
site/js/               montador, catálogo, estado, tema e exportação
site/fonts/            WOFF2 auto-hospedados
public/                saída gerada do site; ignorada pelo Git
dist/                  saída gerada de ícones; ignorada pelo Git
docs/                  diagnóstico, inventário e roadmap
```

`lib/icons.mjs` é usado pelas duas entradas de API. O build do site compõe HTML de páginas/partials, combina CSS e copia JS/fontes. A galeria usa arquivos estáticos; o preview usa a API de composição. A conversão para raster e o ZIP acontecem no cliente. Não edite public ou dist manualmente.

## Pré-requisitos e instalação

- Git e Node.js. O ambiente validado nesta auditoria foi **Node 24.22.1**; package.json e CI agora usam **Node 24.x**. Scripts web usam import.meta.dirname; versões anteriores não fazem parte da configuração suportada atual.
- Para ferramentas do projeto, Yarn Classic 1.x compatível com o lock existente. A política de gerenciador/versionamento ainda será consolidada em M18.
- Navegador moderno com módulos ES, fetch e Canvas. Clipboard requer contexto seguro (HTTPS ou localhost); ZIP usa fallback sem compressão se deflate-raw não estiver disponível.

```bash
git clone https://github.com/https-shini/skill-icons.git
cd skill-icons
yarn install --frozen-lockfile
```

O comando instala ferramentas de desenvolvimento; os geradores e o servidor web usam apenas bibliotecas nativas de Node. `npm install` é uma alternativa já descrita no DEPLOY, mas não reproduz o yarn.lock e pode criar package-lock; escolha um gerenciador, não misture locks. Não há migração, seed ou configuração de banco.

## Configuração do ambiente

O site e a API não exigem variáveis de ambiente ou arquivo .env. Configurações opcionais/operacionais:

| Variável/secret | Uso                                                               |
| --------------- | ----------------------------------------------------------------- |
| PORT            | Servidor web local; padrão 4173                                   |
| PLAYWRIGHT_CORE | Caminho de módulo do runner opcional de responsividade            |
| CHROMIUM        | Executável Chromium para esse runner; conferir caminho da máquina |
| CF_API_TOKEN    | Secret de CI somente para publicar Worker                         |
| CF_ACCOUNT_ID   | Secret de conta Cloudflare usado no workflow                      |

Não coloque credenciais no repositório, README ou parâmetros públicos. A publicação Vercel é configurada pela conta da plataforma; não há secret de aplicação exigido no código. Autenticação do deploy é distinta de login de usuário, que não existe no produto.

## Executar localmente

Site completo com API:

```bash
npm run dev:web
```

Abra [localhost:4173](http://localhost:4173). Para outra porta, em shell POSIX:

```bash
PORT=5000 npm run dev:web
```

O comando faz build e inicia `scripts/serve.mjs`. Não há watch/hot reload: após alterar fontes, refaça o build/reinicie. O servidor é de desenvolvimento e não reproduz headers CDN ou limites da hospedagem; não deve ser usado como servidor público de produção.

Para a API Worker via Wrangler:

```bash
npm run dev
```

Esse caminho não serve as páginas de public. O fallback do Worker depende da configuração de origem; valide no provedor.

## Verificações e testes

`npm test` executa os 18 testes nativos de Node para animação, catálogo, aliases, integridade de assets, estado e cache. `npm run test:animation` executa apenas os 11 testes de animação. Também existem os verificadores:

```bash
npm test
npm run readme:check
npm run contraste:check
npm run icones:check
npm run format:check
```

A auditoria confirmou esses checks no fonte original. Para layout, com o servidor rodando e Playwright/Chromium disponíveis:

```bash
npm run responsivo
```

O script aceita `--base=URL` e as variáveis opcionais acima. Ele testa oito rotas/estados × quinze larguras × dois temas (240 combinações), incluindo a galeria de animações. Se Playwright estiver ausente, o script atual **pula com exit 0**; portanto uma execução verde não garante que tenha testado algo. Ele também não cobre sozinho toda a acessibilidade, downloads ou segurança. A suíte proposta está no [plano de testes](docs/ANALISE_E_PLANO_DE_MELHORIAS.md#15-estratégia-segura-de-implementação-e-validação).

## Build

```bash
npm run build
npm run build:web
```

`build` gera somente o catálogo em dist. `build:web` executa build, copia SVGs/marca, gera manifest e compõe o site em public. `npm run site` recompõe páginas, mas pressupõe dist já gerado. Saídas não são versionadas.

Para manter o catálogo, adicione o SVG em icons, classifique em scripts/categories.mjs e rode `npm run readme`; a tabela atual é gerada em **readme.md minúsculo**. `npm run icones` e `npm run format` também escrevem fontes; use as variantes `:check` quando só quiser verificar. Convenções de assets: [DEPLOY.md](DEPLOY.md#adicionando-um-ícone-novo).

## Deploy

**Vercel:** importe o repositório como framework Other. O vercel.json define buildCommand, saída public e rewrite de /icons para /api/render. Não há variável de aplicação obrigatória. Confirme o runtime Node configurado na conta e valide o preview antes de promover. Publicação Vercel não é executada pelo workflow Cloudflare.

**Cloudflare Workers:** com ferramentas instaladas e conta autorizada:

```bash
npx wrangler login
npm run deploy
```

O script existente faz build e wrangler deploy. O wrangler.toml habilita workers.dev; o domínio próprio está comentado e deve ser configurado para sua zona. O Worker serve a API, não o site completo.

**CI atualizado:** push na main e pull requests executam verificações de catálogo/contraste/normalização, testes e build com Node 24. A publicação Worker é separada, depende da validação e só ocorre na main, fora de PR, quando ambos os secrets estão configurados. O workflow passou pelo actionlint localmente; a execução remota depende do próximo push. Nenhum deploy foi realizado nesta entrega.

## Documentação complementar e roadmap

| Documento                                                            | Conteúdo                                                                     |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [Análise e plano de melhorias](docs/ANALISE_E_PLANO_DE_MELHORIAS.md) | Evidências, problemas, 26 melhorias com aceite, testes e estratégia segura   |
| [Roadmap de implementação](docs/ROADMAP_DE_IMPLEMENTACAO.md)         | 26 tarefas em oito fases, prioridades e dependências                         |
| [Inventário técnico](docs/INVENTARIO_TECNICO.md)                     | Módulos, configurações, comandos, integrações, lock e avisos de dependências |
| [Documentação original](readme.md)                                   | Exemplos detalhados, tabela de ícones e identidade                           |
| [Deploy](DEPLOY.md)                                                  | Procedimentos dos provedores, com ressalvas acima                            |
| [Marca](brand/README.md) / [Fontes](site/fonts/README.md)            | Identidade visual e proveniência declarada                                   |

Ordem proposta: correções urgentes → fundação técnica → performance → funcionalidades → UX/acessibilidade → toolchain → validação de release → evolução estratégica. Testes acompanham cada correção desde o início; a fase final consolida a cobertura operacional.

Pendências da auditoria: limites de composição, tratamento público de erros, atualização de dependências de ferramentas e validação operacional dos provedores. Esta atualização não conclui automaticamente as 26 tarefas do roadmap original.

Este README.md foi criado conforme solicitado. O readme.md original permanece porque o gerador e sua tabela dependem desse nome. A consolidação é M24 e envolve scripts/links; em filesystems sem distinção de caixa, resolva essa transição antes de trabalhar com ambos os caminhos. Nenhum script foi alterado para essa consolidação nesta etapa.

## Créditos e licença

Código sob [MIT](LICENSE), com copyright e créditos do projeto original preservados. Logotipos de tecnologias pertencem aos respectivos titulares. Fontes declaradas sob SIL OFL 1.1 em site/fonts/README.md; completar textos de licença e proveniência está previsto em M22. Não presumir que a licença do código transfira direitos de marca.

## Novos ícones, origens e integração

[Lista e mapeamento do anexo](docs/ATUALIZACAO_DO_CATALOGO.md), [origens fixadas e hashes](assets/icon-sources.json) e [licenças de terceiros](licenses/README.md). Os assets do golangci-lint e Bandit conservam suas licenças próprias; Radon é um badge tipográfico deste catálogo. `procfile` é uma associação aprovada a `heroku`, não uma logomarca própria.

Com o servidor ativo, `npm run test:web` verifica o fluxo real no navegador. Requer Playwright e Chromium disponíveis; `PLAYWRIGHT_CORE` pode apontar para o módulo e `CHROMIUM` para o executável. Ao contrário de uma checagem opcional silenciosa, esse comando falha se o runner não estiver disponível.
