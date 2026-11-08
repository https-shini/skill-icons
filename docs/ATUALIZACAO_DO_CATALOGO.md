# Atualização do catálogo e melhorias do montador

Implementação local de 08/11/2026 a partir do anexo do usuário e da auditoria anterior. Preserva as animações internas já implementadas. Não houve push, publicação ou alteração de conta de hospedagem nesta etapa.

## Resultado

- 13 novas tecnologias, com 26 SVGs em pares Dark/Light e versões animadas geradas no build.
- Catálogo ampliado de 257 para **270 IDs**, de 433 para **459 SVGs**, com **189 IDs temáticos**, 81 sem tema e **73 aliases**.
- Origem fixada, adaptações, licença e hashes de cada arquivo novo em [assets/icon-sources.json](../assets/icon-sources.json).
- Busca segura, estado persistido validado, filtros restaurados corretamente, foco de teclado preservado e carregamento de manifesto compartilhado.
- Metadados de aliases independentes do build e CI com Node 24, testes e validação em pull requests.

## Ícones novos

Todos possuem variantes claras, escuras e animadas. O ID canônico e seus aliases podem ser usados em `/icons?i=...`; o movimento é ativado por `animation=true`.

| Tecnologia do anexo | ID canônico | Aliases úteis                              | Origem da arte                                                                            |
| ------------------- | ----------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| lucide-react        | lucide      | lucidereact, lucide-react                  | Simple Icons, referência da marca Lucide                                                  |
| ruff                | ruff        | —                                          | Simple Icons, referência Astral/Ruff                                                      |
| bandit              | bandit      | —                                          | Logomark PNG do repositório oficial PyCQA/bandit, embutido no SVG                         |
| radon               | radon       | —                                          | Badge tipográfico original deste catálogo, aprovado pelo usuário; não é logomarca oficial |
| Biome               | biome       | —                                          | Simple Icons, referência do projeto Biome                                                 |
| golangci-lint       | golangci    | golangcilint, golangci-lint                | SVG do repositório oficial golangci/golangci-lint                                         |
| Gemini              | gemini      | googlegemini, google gemini                | Simple Icons, referência Google Gemini                                                    |
| Claude              | claude      | claudeai                                   | Simple Icons, referência Claude                                                           |
| OpenRouter          | openrouter  | —                                          | Simple Icons, referência OpenRouter                                                       |
| Framer Motion       | motion      | framermotion, framer-motion, framer motion | Marca atual Motion via SVGL, conferida com a referência do projeto Motion                 |
| Socket.IO           | socketio    | socketdotio, socket.io                     | Simple Icons, referência Socket.IO                                                        |
| Jupyter Notebook    | jupyter     | jupyternotebook, jupyter notebook          | Simple Icons, referência do projeto Jupyter                                               |
| Jinja               | jinja       | jinja2                                     | Simple Icons, referência do projeto Jinja                                                 |

Motion é a biblioteca anteriormente chamada Framer Motion; não representa a marca do construtor de sites Framer. Jupyter Notebook e Jinja2 são aliases de suas famílias, não novos desenhos distintos. A arte Bandit mantém proporção e transparência, com raster proporcional de até 348px embutido; não é anunciada como vetor puro.

As formas de origem foram centralizadas em área de 174×174 dentro da moldura 256×256, com fundo `#242938`/`#F4F2ED` e canto de raio 60. As cores de primeiro plano de alguns logotipos foram adaptadas por tema. Máscaras, gradientes e IDs do golangci-lint foram preservados/normalizados e prefixados para reduzir colisões. Radon usa glifos da JetBrains Mono convertidos em paths, sem dependência de fonte no navegador.

## Tecnologias já existentes e novos nomes de busca

| Nome no anexo             | Recurso usado                                            | Situação                                                                            |
| ------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Next.js                   | nextjs; alias next.js                                    | Ícone existente, novo alias pontuado                                                |
| Tailwind CSS              | tailwindcss; tailwind, tailwind css                      | Ícone existente                                                                     |
| Uvicorn                   | uvicorn                                                  | Ícone já existente neste fork, apesar de ausente no catálogo do outro site          |
| PostgreSQL                | postgresql; postgres                                     | Ícone existente                                                                     |
| GitHub API e GitHub OAuth | github; githubapi, githuboauth, github api, github oauth | Reutilizam a marca GitHub; não são logos independentes                              |
| Styled Components         | styledcomponents; styled-components, styled components   | Ícone existente                                                                     |
| Express                   | expressjs; express, express.js                           | Ícone existente                                                                     |
| JWT e Pydantic            | jwt, pydantic                                            | Ícones já existentes neste fork                                                     |
| Dockerfile                | dockerfile → docker                                      | Alias de Docker, sem inventar uma marca Dockerfile                                  |
| Shell                     | shell → bash                                             | Associação documentada ao ícone Bash; Shell é uma categoria genérica                |
| SVG                       | svg                                                      | Ícone existente                                                                     |
| PL/pgSQL                  | plpgsql, pl/pgsql → postgresql                           | Associação mais fiel a PostgreSQL                                                   |
| Procfile                  | procfile → heroku                                        | Associação explicitamente aprovada pelo usuário; não é logomarca própria do formato |

Exemplo:

```text
/icons?i=lucide,ruff,bandit,radon,biome,golangci,gemini,claude,openrouter,motion,socketio,jupyter,jinja&theme=dark&perline=7&animation=true
```

Nomes com espaço precisam ser codificados ao escrever URLs manualmente (`jupyter%20notebook`). O montador usa IDs canônicos em seus snippets. A API continua sensível a maiúsculas; a busca do site normaliza caixa e acentos como antes.

## Melhorias de código e experiência

| Mudança                               | Arquivos                                                         | Verificação                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Consulta sem HTML interpretado        | site/js/builder.js                                               | Payload com tag/event handler aparece literalmente; nenhum nó de imagem ou execução é criado                               |
| Validação de estado por campo         | site/js/estado.js, builder.js                                    | Seleção inválida vira lista segura; IDs desconhecidos/duplicados são removidos; categoria, formato e limites são validados |
| Filtro coerente após reload           | builder.js                                                       | aria-pressed corresponde à categoria persistida                                                                            |
| Entrada e preservação do foco         | builder.js                                                       | Grade não vazia mantém um tabindex=0; atualização de tema conserva o tile focado                                           |
| Requisição de catálogo compartilhada  | site/js/dados.js                                                 | Chamadas concorrentes usam a mesma Promise; rejeição permite uma nova tentativa                                            |
| Metadados sem payload de SVG          | lib/catalog.mjs, lib/icons.mjs, scripts/readme-table.mjs         | Gerador importa aliases diretamente, sem regex do código ou dependência de dist                                            |
| Contagem de SEO derivada do catálogo  | site/pages/index.html, scripts/build-pages.mjs                   | Descrição publicada usa a contagem atual, sem valor fixo obsoleto                                                          |
| CI corrigido e separado de publicação | .github/workflows/wrangler-action.yml                            | actionlint sem erro; validação em push/PR; deploy fora de PR, após validação e condicionado a ambos os secrets via env     |
| Runtime explícito                     | package.json, site/package.json                                  | Node 24.x para desenvolvimento/CI; módulos do site declarados ESM sem mudar build.js CommonJS                              |
| Rastreabilidade de assets             | assets/icon-sources.json, licenses, assets/upstream/golangci.svg | Testes de hash/licença; cópia de licenças e proveniência para a saída web                                                  |

As preferências válidas de seleção/tema são preservadas. O normalizador não apaga todo o localStorage. As mudanças da API continuam aditivas: aliases antigos, temas, SVG estático por padrão, rotas e formatos de manifesto são mantidos.

## Testes e comandos

```bash
npm test
npm run readme:check
npm run icones:check
npm run contraste:check
npm run format:check
npm run build:web
```

`npm test` faz o build do catálogo e executa 12 testes nativos de Node: sete de animação e cinco de catálogo, aliases, proveniência/integridade, estado e cache. Não houve inclusão de dependências no package.json nem alteração do yarn.lock.

Com o servidor ativo e Playwright/Chromium disponíveis:

```bash
npm run test:web
npm run responsivo
```

Os scripts aceitam `--base=URL`. Para um ambiente com runner externo, apontar `PLAYWRIGHT_CORE` para o módulo ESM de Playwright e `CHROMIUM` para o executável. `test:web` falha se o runner não estiver disponível. O CI de Node executa os testes sem browser; o ensaio de navegador é separado e não é anunciado como um gate obrigatório da conta GitHub.

Verificações locais desta entrega:

- 12 testes de Node aprovados e configuração do workflow aprovada no actionlint.
- 459 SVGs originais e 459 versões animadas com XML bem formado.
- Busca por nomes e aliases do anexo; payload HTML literal; recuperação de storage; filtros e foco; preview e download SVG animado.
- Download PNG do Bandit com raster embutido, para validar o caso diferente dos paths vetoriais.
- 180 combinações de layout (seis páginas × quinze larguras × dois temas), sem falhas conforme as regras do verificador.

As animações, seus controles, movimento reduzido e exportação estática PNG/WebP continuam conforme [ANIMACAO_DOS_ICONES.md](ANIMACAO_DOS_ICONES.md). Os números de 257/433 nesse documento registram a implementação anterior, não a contagem atual.

## Licenças e proveniência

[licenses/README.md](../licenses/README.md) registra licenças por grupo. As licenças dos assets não são substituídas pela MIT do código. Fontes e hashes exatos estão no JSON rastreado; a fonte correspondente do desenho golangci-lint também acompanha o repositório.

O build web distribui `/licenses/` e `/icon-sources.json`. IDs, arquivos e licenças dos ícones novos são validados nos testes antes de aceitar uma mudança. O projeto não afirma propriedade sobre marcas de terceiros.

## Relação com a auditoria e limites de escopo

Implementação relacionada a M01/M02/M03 (CI, busca e aliases), M06 (estado), M10 (metadados), M13 (cache) e parte de M09/M15/M18/M19/M22. Isso não conclui todos os critérios dessas tarefas: testes em provedores, tabs/overlays acessíveis, gestão de dependências, branch protection e demais itens continuam dependendo do roadmap e de revisão específica.

O anexo descreve também um portfólio externo, com arquivos `apps/web/src/...` ausentes deste repositório. Esta entrega disponibiliza os ícones e seus nomes no skill-icons. A troca de fallbacks nos componentes daquele portfólio depende de uma alteração no respectivo projeto.

Fotos de recomendações, logo da Wise System e capas de repositórios citadas no anexo não são logotipos de tecnologia nem possuem os arquivos originais anexados. Permanecem como necessidades de conteúdo do outro projeto; nenhuma foto, identidade empresarial ou capa foi inventada.

Não foram realizados deploy real, teste dos limites do plano cloud, execução remota do workflow, alteração do DNS ou validação em Safari/Firefox. O inventário anterior de avisos de dependências continua relevante: esta etapa não atualizou Wrangler ou suas transitivas.

## Publicação e rollback

Revisar o diff e publicar primeiro em preview; confirmar a disponibilidade dos novos SVGs e suas variantes animadas, a integridade do manifesto e os headers/cache no provedor escolhido. O CI corrigido só terá execução remota após push; não presumir publicação automática já concluída.

Para rollback, reverter em conjunto assets, categorias, aliases, testes e geração de manifestos/tabelas; reconstruir `dist/` e `public/` e promover o deployment anterior. Ícones e aliases preexistentes foram mantidos. A seleção persistida elimina IDs que não existem na versão carregada sem impedir a inicialização.
