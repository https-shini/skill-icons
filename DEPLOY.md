# Publicando a sua própria instância

Os ícones deste repositório **não** aparecem em `skillicons.dev` — aquele domínio
serve apenas o repositório oficial. Para usar os ícones daqui você publica a sua
própria instância do Worker; a API fica idêntica
(`/icons?i=...`, `&theme=`, `&perline=`), só muda o domínio.

## Pré-requisitos

- Node 20 ou superior
- Uma conta na Cloudflare (o plano gratuito é suficiente)

## Primeira publicação

```bash
yarn install          # ou npm install
npx wrangler login    # abre o navegador para autorizar
yarn deploy           # roda o build e publica
```

A saída informa a URL gerada, no formato
`https://skill-icons.<seu-subdominio>.workers.dev`. Teste:

```
https://skill-icons.<seu-subdominio>.workers.dev/icons?i=oracle,jwt,render
```

## Domínio próprio

Com a zona `gcruz.dev.br` já na Cloudflare, descomente o bloco de rota no
`wrangler.toml`:

```toml
[[routes]]
pattern = "icons.gcruz.dev.br"
custom_domain = true
```

Publique de novo (`yarn deploy`). A Cloudflare cria o registro DNS e emite o
certificado automaticamente — leva alguns minutos na primeira vez.

## Deploy automático pelo GitHub Actions

O workflow `.github/workflows/wrangler-action.yml` publica a cada push na `main`.
Configure dois secrets em **Settings → Secrets and variables → Actions**:

| Secret          | Onde obter                                                                |
| --------------- | ------------------------------------------------------------------------- |
| `CF_API_TOKEN`  | Cloudflare → My Profile → API Tokens → template "Edit Cloudflare Workers" |
| `CF_ACCOUNT_ID` | Cloudflare → Workers & Pages → Overview, na barra lateral                 |

O workflow não instala dependências: `build.js` e `scripts/readme-table.mjs` usam
apenas a stdlib do Node, e a `wrangler-action` traz a própria wrangler.

## Adicionando um ícone novo

1. Coloque o SVG em `icons/` seguindo as convenções abaixo.
2. Rode `yarn readme` para regenerar a tabela do readme.
3. Publique.

Convenções (as mesmas dos ícones que já existem):

- `viewBox="0 0 256 256"`, `width`/`height` 256, `fill="none"` na raiz
- fundo `<rect width="256" height="256" rx="60">`
- arte entre as coordenadas 41 e 215 (respiro de 41px)
- par temático: `Nome-Dark.svg` (fundo `#242938`) + `Nome-Light.svg` (fundo
  `#F4F2ED`); se o logo funciona sobre a cor da marca, use um arquivo único com
  aquela cor no fundo
- **sem hífen no nome do arquivo** além do sufixo de tema — o ID é derivado de
  `split('-')[0]`
- **sem** `<text>`, `<style>`, `class=` ou referência externa; texto precisa ser
  desenhado como `<path>`
- **evite `id`/`<defs>`**; se precisar, prefixe com o nome do ícone. O endpoint
  concatena todos os ícones pedidos em um único SVG, então `id` repetido entre
  ícones diferentes colide

`yarn readme:check` falha se a tabela do readme estiver defasada em relação a
`icons/` — o CI roda essa checagem antes de publicar.

## Limite de tamanho

O bundle atual tem cerca de **800 KiB comprimido**. O limite do plano gratuito da
Cloudflare é **1 MiB comprimido** por Worker (3 MiB nos planos pagos). Ou seja,
ainda cabem ícones, mas não indefinidamente — quando chegar perto do limite, a
saída de `wrangler deploy` avisa, e as opções são migrar para um plano pago ou
servir os SVGs de um bucket em vez de embuti-los no script.
