# Marca `<gcruz.dev/>`

Biblioteca dos logotipos pessoais. Abra [`index.html`](./index.html) para ver
todas as variações nos dois temas, com o SVG de cada uma pronto para copiar.

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

## Tokens (DS v4.0)

| Camada    | Token                 | Dark      | Light     |
| --------- | --------------------- | --------- | --------- |
| Fundo     | `--color-bg`          | `#070d19` | `#f2f4f8` |
| Brackets  | `--color-brand-text`  | `#f43f5e` | `#be123c` |
| Nome      | `--color-text-1`      | `#f8fafc` | `#0f172a` |
| Sufixo    | `indigo-400/600`      | `#818cf8` | `#4f46e5` |
| Tile      | `--color-surface-2`   | `#0f172a` | `#e2e8f0` |

Contraste dos brackets sobre o fundo: `5.29:1` no dark e `5.71:1` no light — AA
nos dois. Regras de uso do DS: **peso 700 até 32px, 600 acima de 40px**; abaixo de
24px o sufixo `.dev` perde a separação de cor, então use a variante compacta.

## Arquivos

Fundo transparente, exceto onde indicado. `-dark` traz o nome em slate-50 e
`-light` em slate-900 — escolha pelo ground onde o logo vai assentar, não pelo
tema do site.

### Canônicas — definidas no DS v4.0

| Arquivo                    | Conteúdo                                          |
| -------------------------- | ------------------------------------------------- |
| `wordmark-{dark,light}`     | `<gcruz.dev/>` peso 700. O lockup principal.       |
| `wordmark-600-{dark,light}` | O mesmo em peso 600, para display a partir de 40px |
| `compact-{dark,light}`      | `<g/>` peso 700                                    |
| `app-tile-{dark,light}`     | Compacta sobre tile quadrado, com fundo            |
| `favicon-{dark,light}`      | Compacta em canvas 64×64, com fundo                |
| `peso-{400,500,600,700}-*`  | Wordmark em cada peso, para comparação             |

### Propostas — **não** existem no DS v4.0

Criadas a pedido, marcadas como proposta na biblioteca. São sugestões para
aprovar ou descartar, não parte oficial da marca:

| Arquivo                       | Conteúdo                          |
| ----------------------------- | --------------------------------- |
| `proposta-vertical-*`         | `<gcruz` sobre `.dev/>`, empilhado |
| `proposta-brackets-*`         | `</>` — a marca sem texto          |
| `proposta-monogram-*`         | `g` isolado, sem brackets          |

O `app-tile-light` usa `#e2e8f0`, que também é derivado: o DS só define o tile
escuro `#0f172a`.

## Na API de ícones

`../icons/GCruz-Dark.svg` e `GCruz-Light.svg` colocam a marca no formato do
conjunto (256×256, `rect rx=60`, arte entre 41 e 215), servidos como `?i=gcruz`.

O badge usa a **compacta**, não o wordmark: a rota compõe células fixas de
300×300, e um lockup de 12 caracteres só caberia num quadrado com escala não
uniforme. Usar a compacta em tamanho pequeno é, aliás, a própria regra do DS.

O fundo é `#070d19` / `#f2f4f8` em vez do `#242938` / `#F4F2ED` do resto do
conjunto: o neutro existe para dar campo a logos de terceiros, e aqui o fundo faz
parte da identidade.

## Licença da fonte

Os contornos vêm da [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono),
sob [SIL Open Font License 1.1](https://scripts.sil.org/OFL). Converter glifos em
artwork de marca é uso permitido. Os binários da fonte **não** são versionados
aqui — só os outlines já convertidos.
