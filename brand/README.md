# Marca `<gcruz.dev/>`

Biblioteca dos logotipos pessoais. A página `/marca` do site mostra todas as
variações nos dois temas, com o SVG de cada uma pronto para copiar — este
arquivo é a especificação; a página é a vitrine.

## Por que os arquivos existem

A marca é **100% tipográfica** em JetBrains Mono — não havia vetor dela. Estes
SVGs são os **contornos dos glifos convertidos em `<path>`**, o que resolve três
coisas de uma vez: não dependem de fonte instalada, não usam `<text>` (que a API
de ícones proíbe e o GitHub sanitiza), e preservam a proporção original.

A JetBrains Mono é monoespaçada (`unitsPerEm=1000`, `advance=600` para todo
glifo), então a posição de cada caractere é `i * 600` exato — o lockup não depende
de kerning manual. A única transformação aplicada é **escala uniforme mais
translação**; a inversão do eixo y é a diferença de sentido do SVG, não uma
deformação.

## Abreviação

A abreviação da marca é **`gc`**, nunca `g` isolado: a variante compacta é
`<gc/>` e o monograma é `gc`. O `<g/>` que existia antes em `compact`,
`favicon` e `app-tile` foi migrado, e a proposta de monograma `g` foi removida.

## Tokens

Os mesmos de `site/css/tokens.css` — uma fonte só para o site e para a marca.

| Camada           | Token          | Dark      | Light     |
| ---------------- | -------------- | --------- | --------- |
| Fundo            | `--bg`         | `#040710` | `#f2f4f8` |
| Brackets         | `--brand`      | `#f43f5e` | `#be123c` |
| Nome             | `--text-1`     | `#f8fafc` | `#0f172a` |
| Sufixo `.dev`    | `--accent`     | `#818cf8` | `#4f46e5` |
| Fundo dos badges | `--on-brand`   | `#070d19` | `#f2f4f8` |

Contraste dos brackets sobre o fundo: `5.29:1` no dark e `5.71:1` no light — AA
nos dois. Regras de uso do DS: **peso 700 até 32px, 600 acima de 40px**; abaixo de
24px o sufixo `.dev` perde a separação de cor, então use a variante compacta.

## Arquivos

Fundo transparente, exceto onde indicado. `-dark` traz o nome em slate-50 e
`-light` em slate-900 — escolha pelo ground onde o logo vai assentar, não pelo
tema do site.

### Canônicas

| Arquivo                    | Conteúdo                                          |
| -------------------------- | ------------------------------------------------- |
| `wordmark-{dark,light}`     | `<gcruz.dev/>` peso 700. O lockup principal.       |
| `wordmark-600-{dark,light}` | O mesmo em peso 600, para display a partir de 40px |
| `compact-{dark,light}`      | `<gc/>` peso 700 — a variante compacta              |
| `app-tile-{dark,light}`     | Compacta sobre tile quadrado, com fundo            |
| `favicon-{dark,light}`      | Compacta em canvas 64×64, com fundo                |
| `peso-{400,500,600,700}-*`  | Wordmark em cada peso, para comparação             |

### Família curta

| Arquivo             | Conteúdo         |
| ------------------- | ---------------- |
| `gc-dev-*`          | `<gc.dev/>`      |
| `gcruz-tag-*`       | `<gcruz/>`       |
| `gc-*`              | Monograma `gc`   |

### Propostas — **não** são parte oficial da marca

Criadas a pedido, marcadas como proposta na biblioteca. São sugestões para
aprovar ou descartar:

| Arquivo                       | Conteúdo                           |
| ----------------------------- | ---------------------------------- |
| `proposta-vertical-*`         | `<gcruz` sobre `.dev/>`, empilhado |
| `proposta-brackets-*`         | `</>` — a marca sem texto          |

O `app-tile-light` usa `#e2e8f0`, que também é derivado: o DS só define o tile
escuro `#0f172a`.

## Na API de ícones

Três variações também são ícones de `/icons`, no formato do conjunto (256×256,
`rect rx=60`, arte entre 41 e 215):

| Arquivo                  | ID      | Conteúdo    | Lê bem a partir de |
| ------------------------ | ------- | ----------- | ------------------ |
| `../icons/GCruz-{Dark,Light}.svg` | `gcruz` | `<gcruz/>` | 48px |
| `../icons/GCTag-{Dark,Light}.svg` | `gctag` | `<gc/>`    | 24px |
| `../icons/GC-{Dark,Light}.svg`    | `gc`    | `gc`       | 16px |

O wordmark completo **não** vira badge: a rota compõe células fixas de 300×300, e
um lockup de 12 caracteres só caberia num quadrado com escala não uniforme.

`gcruz` é o badge principal porque 48px é o tamanho em que o endpoint renderiza
cada ícone, e ali `<gcruz/>` ainda se lê. Abaixo disso a peça certa é `gctag`, e
abaixo de 24px, `gc` — medido numa contact sheet de 16/24/32/48/96px, não
estimado.

O fundo é `#070d19` / `#f2f4f8` em vez do `#242938` / `#F4F2ED` do resto do
conjunto: o neutro existe para dar campo a logos de terceiros, e aqui o fundo faz
parte da identidade.

## Licença da fonte

Os contornos vêm da [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono),
sob [SIL Open Font License 1.1](https://scripts.sil.org/OFL). Converter glifos em
artwork de marca é uso permitido. Os binários da fonte **não** são versionados
aqui — só os outlines já convertidos.
