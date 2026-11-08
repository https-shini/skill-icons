# Publicando a sua própria instância

Produção do projeto: **https://skill-icons-gcruz.vercel.app**. O domínio `icons.gcruz.dev.br` aparece como exemplo opcional de domínio próprio e não está vinculado ao projeto de produção consultado nesta publicação.

Os ícones deste repositório **não** aparecem em `skillicons.dev` — aquele domínio
serve apenas o repositório oficial. Para usar os ícones daqui você publica a sua
própria instância; a API fica idêntica (`/icons?i=...`, `&theme=`, `&perline=`),
só muda o domínio.

Há duas hospedagens possíveis, com a lógica compartilhada em `lib/icons.mjs` para
não divergirem:

|                                    | Vercel        | Cloudflare Workers        |
| ---------------------------------- | ------------- | ------------------------- |
| Entrada                            | `api/*.mjs`   | `index.js`                |
| Config                             | `vercel.json` | `wrangler.toml`           |
| Serve a página `public/index.html` | sim           | não                       |
| Rota não reconhecida               | 404           | passthrough para a origem |

---

# Vercel (recomendado)

Além da API, a Vercel serve o site composto em `public/` — montador com busca e
download, catálogo por categoria, documentação da API, biblioteca da marca e
changelog.

O fonte do site fica em `site/`; `public/` é **saída de build** e não deve ser
editado à mão. Para desenvolver localmente:

```bash
npm run dev:web      # build + servidor em http://localhost:4173
```

`scripts/serve.mjs` reproduz a ordem de roteamento da Vercel — estático primeiro,
depois as funções, e o resto no `404.html` — então o que funciona ali funciona
publicado.

## Importar o projeto

1. Em [vercel.com/new](https://vercel.com/new), importe `https-shini/skill-icons`.
2. Deixe o framework como **Other**. O `vercel.json` já define o build
   (`node build.js && node scripts/vercel-assets.mjs && node scripts/build-pages.mjs`)
   e o output (`public`).
3. Deploy. Não há variável de ambiente nem secret a configurar.

Teste depois de publicar:

```
https://<projeto>.vercel.app/                        montador, catálogo e API
https://<projeto>.vercel.app/design-system           os tokens em uso
https://<projeto>.vercel.app/marca                   identidade da marca
https://<projeto>.vercel.app/changelog               histórico
https://<projeto>.vercel.app/sobre                   o fork e os créditos
https://<projeto>.vercel.app/icons?i=oracle,sql,jwt  o SVG
https://<projeto>.vercel.app/api/manifest            metadados
```

## Domínio próprio

Em **Settings → Domains**, adicione `icons.gcruz.dev.br`. A Vercel mostra o
registro DNS a criar; como a zona está na Cloudflare, crie lá um `CNAME`
apontando para o alvo indicado, **com o proxy desligado** (nuvem cinza) para não
haver dois CDNs em série.

## O que roda onde

- `/icons` → rewrite para `api/render.mjs`
- `/api/icons`, `/api/manifest`, `/api/svgs` → funções de mesmo nome
- `/svg/<Arquivo>.svg` → cópia estática de `icons/`, servida pela CDN. O catálogo
  e o download usam estes arquivos, então navegar o site não invoca função nenhuma
- `/brand/` → assets da marca
- `/css/site.css`, `/js/*.js`, `/fonts/*.woff2` → o site em si
- `/manifest.json` → ID, tema, categoria e apelidos de cada ícone, numa
  requisição só; é o que alimenta a busca do montador
- qualquer outra rota → `404.html`

Os SVGs estáticos ficam em `/svg/` e não em `/icons/` de propósito: `/icons` é a
rota da função, e assim não se depende da ordem de precedência entre filesystem e
rewrite.

---

# Cloudflare Workers

## Pré-requisitos

- Node 24.x
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

O workflow `.github/workflows/wrangler-action.yml` valida push na `main` e pull requests. A publicação opcional do Worker ocorre somente na `main`, fora de PR, após a validação.
Configure dois secrets em **Settings → Secrets and variables → Actions**:

| Secret          | Onde obter                                                                |
| --------------- | ------------------------------------------------------------------------- |
| `CF_API_TOKEN`  | Cloudflare → My Profile → API Tokens → template "Edit Cloudflare Workers" |
| `CF_ACCOUNT_ID` | Cloudflare → Workers & Pages → Overview, na barra lateral                 |

O workflow não instala dependências: `build.js`, `scripts/readme-table.mjs`,
`scripts/contraste.mjs` e `scripts/build-pages.mjs` usam apenas a stdlib do Node,
e a `wrangler-action` traz a própria wrangler. O passo
Publish consulta os secrets pelo contexto `env` e exige token e account ID — sem ambos ele é
pulado em vez de falhar, o que importa se você usar só a Vercel.

## Adicionando um ícone novo

1. Coloque o SVG em `icons/` seguindo as convenções abaixo.
2. Coloque o ID numa categoria em `scripts/categories.mjs` — `yarn readme:check`
   falha se ele ficar sem categoria, em vez de sumir no meio da tabela.
3. Rode `yarn readme` para regenerar a tabela do readme.
4. Publique.

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

O catálogo cresceu para 459 SVGs. Meça o bundle final com o Wrangler antes de publicar e confirme os limites vigentes do plano contratado. O tamanho gzip de dist/icons.mjs é apenas uma referência local, não o tamanho final do Worker. Não presuma capacidade usando os limites históricos deste documento. Se o crescimento justificar, avalie distribuição versionada de assets mantendo o contrato público, conforme o roadmap.
