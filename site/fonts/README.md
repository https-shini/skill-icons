# Fontes

Duas fontes variáveis, auto-hospedadas. Um arquivo por família cobre todos os
pesos que o site usa.

| Arquivo                    | Família        | Eixo           | Tamanho |
| -------------------------- | -------------- | -------------- | ------- |
| `jetbrains-mono-var.woff2` | JetBrains Mono | `wght` 400–800 | 31 KB   |
| `ibm-plex-sans-var.woff2`  | IBM Plex Sans  | `wght` 100–700 | 46 KB   |

São os subsets **latin** publicados pelo Google Fonts — cobrem `U+0000–00FF`,
que inclui toda a acentuação do português. Os subsets menores da JetBrains Mono
(15 a 261 glifos) não cobrem: foram medidos e faltavam `á à â ã é ê í ó ô õ ú ü ç`
e as maiúsculas correspondentes.

## Por que auto-hospedar

Linkar `fonts.googleapis.com` custaria uma requisição a um terceiro em cada
carregamento, num site cujo propósito é ser embutido e linkado. São 77 KB no
total, com `font-display: swap` e `preload` — o texto aparece antes da fonte
chegar, na pilha de fallback do sistema.

## Licença

As duas são [SIL Open Font License 1.1](https://scripts.sil.org/OFL), que
permite redistribuição e hospedagem própria:

- [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) — © JetBrains
- [IBM Plex Sans](https://github.com/IBM/plex) — © IBM

Os contornos da marca em `brand/` vêm da mesma JetBrains Mono; converter glifos
em artwork de marca é uso permitido pela OFL.
