# Animação interna dos ícones

> A primeira implementação descrita abaixo evoluiu para 12 famílias, transições suaves e pausa fora da tela. Consulte o estado atual em [ANIMACOES_AVANCADAS.md](ANIMACOES_AVANCADAS.md), que abrange os 270 IDs e 459 SVGs.

Implementação local em 08/11/2026, posterior à auditoria do commit `6f6ed48`. Não houve deploy nesta etapa. O diagnóstico, o inventário e o roadmap anteriores continuam sendo registros daquela base; não representam o estado posterior a esta implementação.

## Comportamento entregue

Todos os **257 IDs / 433 SVGs** têm uma versão com animação dentro do desenho. No site, o movimento é **dinâmico e contínuo enquanto há interação**:

- Passar o mouse sobre um tile ou focá-lo pelo teclado inicia o movimento.
- Sair do tile interrompe o movimento, a menos que esteja selecionado.
- Ícones selecionados e seu preview continuam animados.
- O controle **Animar ícones ao interagir** desliga o movimento, atualiza o snippet e mantém a preferência em `si:animacao` no localStorage.
- `prefers-reduced-motion: reduce` prevalece sobre a preferência da página. Desliga o movimento tanto no site quanto dentro dos SVGs exportados ou retornados pela API.

Não há animação no botão, no cartão ou no fundo retangular. A arte mantém suas cores e transforms originais. Os originais em `icons/` continuam estáticos, permitindo renderização raster previsível e compatibilidade com URLs anteriores.

## Direção visual

| Perfil       | Aplicação                                                            | Movimento                                                                      |
| ------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Orbital      | React, Atom, Kubernetes e Redux                                      | Rotação contínua da arte, ciclo de 12s                                         |
| Pulsação     | JS/TS, HTML/CSS, Git/GitHub, Docker, alguns bancos e badges da marca | Escala entre 100% e 91%                                                        |
| Flutuação    | Demais desenhos com arte separável                                   | Deslocamento vertical de até 7 unidades e inclinação de até 4°                 |
| Luminosidade | Roblox Studio                                                        | Opacidade entre 100% e 65%, preservando a silhueta composta sem fundo separado |

Pulsação/flutuação/luminosidade têm ciclos de 3,2–4,4s, determinados pelo ID. As variantes clara e escura compartilham o mesmo perfil e duração. Não há flashes, filtros de blur, dependência externa ou JavaScript embutido nos SVGs.

SQLite conserva os dois paths de fundo; WebAssembly conserva o path de fundo. Selenium, OCaml e Rocket conservam os fundos dentro de seus grupos de clipping. Grupos, máscaras, gradientes, referências e imagens embutidas existentes são mantidos. Se novos ícones tiverem estrutura diferente, o mantenedor precisa verificar se fundo e arte foram separados corretamente; o transformador não é um sanitizador geral de XML.

## API e compatibilidade

O comportamento padrão permanece estático:

```text
/icons?i=react,ts,python
/icons?i=react,ts,python&animation=false
```

Para movimento contínuo dentro de um badge SVG:

```text
/icons?i=react,ts,python&animation=true
/icons?i=all&animation=true&theme=light&perline=15
```

`animation` aceita somente `true` ou `false`; valores diferentes retornam 400. A validação de aliases passou a usar propriedades próprias (`Object.hasOwn`), impedindo que nomes herdados como `constructor` cheguem ao transformador como se fossem ícones.

As rotas `/api/icons`, `/api/manifest`, `/api/svgs` e `/manifest.json` mantêm seus formatos. `/api/svgs` continua fornecendo os originais estáticos. As dimensões, a ordem dos IDs, os aliases válidos, os temas e as repetições são preservados. O estilo de animação é inserido uma única vez no SVG composto.

Na página, hover e seleção são detectados pelo JavaScript externo. Em um SVG usado como `<img>` de um README não é possível detectar o hover do elemento pai a partir do documento da imagem. Por isso, a opção `animation=true` do badge exportado representa **movimento contínuo**, respeitando a preferência de movimento reduzido do visualizador quando o cliente a suporta.

## Assets e downloads

| Recurso                                                   | Uso                                                                         |
| --------------------------------------------------------- | --------------------------------------------------------------------------- |
| `/svg/Nome.svg`                                           | Original estático, sem alteração                                            |
| `/svg/animated/Nome.svg`                                  | Versão autônoma animada, gerada no build web                                |
| Download SVG com controle ativo                           | SVG animado, nome `id-animated.svg`                                         |
| Download SVG com controle desligado ou movimento reduzido | SVG original, nome `id.svg`                                                 |
| ZIP de SVGs                                               | Segue a mesma escolha e conserva animações por arquivo                      |
| PNG e WebP                                                | Imagens estáticas geradas a partir do original, sem depender do frame atual |

PNG e WebP exportados por Canvas não são animações. Não foi adicionado GIF, APNG ou WebP animado. Não editar `public/svg/animated` manualmente: ele é reconstruído a partir dos originais.

## Organização da implementação

- `lib/animation.mjs`: transformação estrutural dos SVGs e CSS dos quatro perfis, sem dependências de runtime.
- `lib/icons.mjs`: parâmetro opcional na API e um único bloco de estilos na composição.
- `scripts/vercel-assets.mjs`: geração dos 433 arquivos animados para a CDN.
- `site/js/animacao.js`: delegação de hover/foco, seleção, preferência persistida, controle de movimento reduzido e sincronização de imagens adicionadas dinamicamente.
- `site/js/builder.js`: snippets animados, atualização de preview e snapshot de opções na exportação.
- `site/js/download.js`: cache separado entre SVG estático/animado e rasterização sempre estática.
- `site/pages/index.html` e `site/css/components.css`: controle acessível de movimento, com alvo de 44×44px e foco visível.
- `tests/animation.test.mjs`: regressões de catálogo completo, preservação de desenho/fundos, pares, contrato e composição.

Não foi introduzida outra cópia do mapa de SVGs no bundle Worker. A API transforma somente os ícones solicitados; os assets do site são gerados no build. O site só busca a variante animada quando precisa dela; a regra de cache existente de `/svg/(.*)` também cobre o subdiretório animated.

## Execução e testes

```bash
npm run test:animation
npm run build:web
npm run dev:web
```

`test:animation` faz o build do catálogo e executa sete testes com o runner nativo de Node. Não exige nova biblioteca nem alteração de lockfile. Os checks existentes `readme:check`, `icones:check`, `contraste:check` e `format:check` continuam aplicáveis.

Verificações realizadas nesta implementação:

1. Geração dos 433 SVGs e parsing independente de todos como XML.
2. Sete testes de contrato/transformação, incluindo todos os assets, fundos especiais, aliases inválidos, parâmetros, dimensões e repetições.
3. Browser Chromium: hover/saída, foco/saída, seleção, preview, controle, persistência, mudança de preferência do sistema e download SVG animado.
4. Movimento real dos quatro perfis e fundos estáticos conferidos em documentos SVG no navegador; CSS reduzido retorna animation-name e transform como none.
5. Comparação pixel a pixel dos 433 originais com suas variantes em movimento reduzido, a 64×64: nenhuma diferença de pixels encontrada.
6. Download PNG/WebP estático e ZIP com dois SVGs animados; verificação independente de CRC e nomes no ZIP.
7. `/icons?i=all&animation=true` retornou 200 com 1.574.069 bytes no ensaio local, sem duplicar o CSS por ícone.

Não foram testados deploy real, reescrita/CDN em produção, Safari, Firefox ou proxies de imagens de terceiros. Esses clientes podem congelar ou filtrar SVG animado; a variante estática continua disponível. Validar os clientes de destino antes de publicar a mudança.

## Checklist de revisão e publicação

- Abrir a página, passar o mouse e navegar por Tab/setas; observar movimento apenas na arte.
- Selecionar/desselecionar, alternar tema e desativar a animação; verificar preview e snippet.
- Ativar movimento reduzido no sistema e confirmar interrupção imediata.
- Baixar SVG/PNG/WebP e um ZIP; verificar formato e conteúdo.
- Validar o build web e a API Worker em preview das hospedagens utilizadas; este trabalho não corrige os demais problemas de CI identificados na auditoria.
- Após publicar, confirmar a disponibilidade de `/svg/animated/React-Dark.svg` e tratar cache antigo de CSS/JS conforme o provedor. Não presumir que mudar um arquivo em URL estável invalide todas as CDNs.

Para rollback, reverter esta implementação em conjunto (gerador, API, módulos de site, HTML/CSS e documentação atualizada), reconstruir o site e promover o deployment anterior. Os SVGs originais e as URLs estáticas foram preservados. A chave `si:animacao` adicional pode ser ignorada pela versão anterior, sem remover seleção ou tema.
