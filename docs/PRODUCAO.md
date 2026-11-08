# Produção e uso dos ícones

O domínio de produção confirmado na Vercel é:

**https://skill-icons-gcruz.vercel.app**

`skill-icons-nine.vercel.app` redireciona para esse endereço. `icons.gcruz.dev.br` não estava vinculado ao projeto consultado; os exemplos públicos desta versão usam o domínio de produção confirmado.

## Usar ícones animados

```md
![Tecnologias](https://skill-icons-gcruz.vercel.app/icons?i=lucide,ruff,bandit,radon,biome,golangci,gemini,claude,openrouter,motion,socketio,jupyter,jinja&perline=7&animation=true)
```

Para tema claro, acrescente `&theme=light`. Para saída estática, remova `animation=true` ou use `animation=false`.

Um único ícone também funciona:

```text
https://skill-icons-gcruz.vercel.app/icons?i=claude&animation=true
https://skill-icons-gcruz.vercel.app/svg/animated/Claude-Dark.svg
```

O site contém o montador, que gera URLs e snippets, além de permitir download SVG animado e ZIP. PNG/WebP continuam estáticos. O catálogo desta versão tem 270 IDs e 459 SVGs, com 81 aliases.

## Rotas das páginas

O projeto usa `cleanUrls: true` em `vercel.json`. Assim, `/animacoes`, `/marca`, `/design-system`, `/sobre` e `/changelog` resolvem os arquivos HTML gerados, sem extensão. Essa configuração é necessária na Vercel; o servidor local já oferecia essa resolução. O E2E verifica os endereços da navegação também no domínio publicado. `/icons` continua sendo a rota da API de SVG.

## Arsenal exclusivo

Acesse [Meu arsenal](https://skill-icons-gcruz.vercel.app/animacoes?colecao=arsenal#explorar). A coleção reúne os 43 ícones de tecnologias das referências e as três marcas, com padrões diferentes e reservados. As URLs existentes com `animation=true` já recebem essas associações. [Mapa e exemplos](MEU_ARSENAL.md).

## Coerência de cache na publicação

O build calcula uma versão de conteúdo compartilhada por CSS, módulos JS, manifesto, imagens e snippets do montador. A versão aparece no meta `si-version` e no parâmetro `v` das URLs geradas. Todos os imports relativos dos módulos publicados recebem a mesma versão; os fontes permanecem sem query para ferramentas/testes locais.

Isso evita reaproveitar arquivos de um build anterior no navegador. URLs públicas sem `v` continuam compatíveis. A API ignora parâmetros adicionais como `v`, preservando o contrato de ícones/temas/perline/animation.

## Validação e recuperação

A publicação deve partir do commit revisado, com `npm test` (18 testes), verificadores de catálogo/contraste/normalização, build e fluxo de navegador aprovados. Depois, verificar no domínio real `/api/icons`, `/manifest.json`, SVGs novos e animados, montador, download e galeria `/animacoes`, seleção por `model`, `/api/animations` e movimento dos 85 modelos. Veja a [biblioteca atual](BIBLIOTECA_DE_ANIMACOES.md).

A release é rastreada pelo commit e deployment Vercel. Antes de promover uma versão nova, manter identificado o deployment de produção anterior. Para rollback, promover essa versão anterior no mesmo projeto e repetir os testes HTTP e de navegador; não excluir assets/deployments antigos durante a janela de validação.

Os relatórios de auditoria e implementações anteriores são registros históricos; seus trechos “sem publicação” descrevem aquelas etapas. O status da publicação atual deve ser confirmado pelo deployment e suas URLs, não inferido desses relatórios.
