# Animações refinadas — versão 2

> Registro histórico da etapa de 12 famílias. A referência atual é a [biblioteca de 64 modelos](BIBLIOTECA_DE_ANIMACOES.md).

Atualização local de 08/11/2026. Abrange os **270 IDs e 459 variantes SVG** do catálogo. Preserva a API, os desenhos e fundos originais, os temas, os downloads e a preferência de interação já escolhida pelo usuário. Não houve publicação nesta etapa.

## Direção de movimento

Os quatro comportamentos anteriores deram lugar a 12 famílias. Cada ID recebe um perfil determinístico; as variantes clara e escura compartilham duração, direção e detalhes. Não há uma animação manual exclusiva para cada arquivo: a cobertura completa é obtida por famílias semânticas e variações reproduzíveis.

| Família      | Exemplos                                                | Comportamento                                                             |
| ------------ | ------------------------------------------------------- | ------------------------------------------------------------------------- |
| Orbital      | React, Atom, Kubernetes, Redux, GraphQL                 | Rotação contínua lenta, com direção definida por ID                       |
| Balanço      | Docker                                                  | Deslocamento e inclinação combinados, com pivô abaixo do centro           |
| Impulso      | Rocket, Astro, Vite, Postman                            | Preparação, elevação diagonal e retorno suave                             |
| Fluxo        | Motion, OpenRouter, Git, Kafka                          | Movimento horizontal com compressão/expansão discreta                     |
| Sinal        | Socket.IO, WebSocket, serviços cloud                    | Impulso curto e pausa entre ciclos, sem piscar                            |
| Varredura    | Prettier, Ruff, Biome, Bandit, ferramentas de qualidade | Deslocamentos horizontais progressivos                                    |
| Oscilação    | Python, Go, GitHub, mascotes                            | Pequena rotação pendular com elevação                                     |
| Abertura     | Gemini, Claude, Jupyter, Lucide, Figma                  | Expansão e rotação leves, em ritmos diferentes                            |
| Equilíbrio   | PostgreSQL, bancos e badges tipográficos da marca       | Elevação e respiração com pouca distorção                                 |
| Pulsação     | JavaScript, TypeScript e várias linguagens              | Escala moderada com deslocamento vertical discreto                        |
| Flutuação    | Flask e outros IDs                                      | Movimento em dois eixos e inclinação leve                                 |
| Luminosidade | Roblox Studio                                           | Opacidade entre 78% e 100%, sem mover a silhueta que também forma o fundo |

IDs sem associação explícita recebem uma variação de flutuação, pulsação, oscilação ou equilíbrio baseada em hash estável. As durações variam por ID, dentro da faixa de cada família; os movimentos orbitais ficam próximos de 14–15s e os demais, de 3,6–6,6s. Não são utilizados números aleatórios ou relógios no build, garantindo a mesma saída na API e nos assets estáticos.

Todos os desenhos com arte separável recebem uma pequena preparação de entrada de 640ms. Roblox Studio não recebe transformação de entrada, preservando a silhueta até a borda.

## Movimento em camadas

Nove IDs recebem também acentos internos revisados:

- **React:** variação leve nos anéis, com núcleo coeso.
- **Python:** deslocamento relativo discreto dos dois segmentos.
- **Prettier:** barras com defasagem, formando uma sequência de varredura.
- **Gemini, Claude, Jupyter e Lucide:** respiração secundária, sem trocar cores ou duplicar o desenho.
- **Motion e OpenRouter:** acento horizontal complementar ao fluxo principal.

As defasagens são positivas: o primeiro quadro permanece na pose original, inclusive em renderizadores que congelam SVGs animados. Os demais ícones mantêm as partes unidas para não desmontar letras, rostos, máscaras ou contornos.

O transformador acrescenta grupos ao redor dos elementos; não sobrescreve os transforms do desenho original. A geometria não é duplicada. Fundos, definições, máscaras e os paths especiais de fundo de SQLite/WebAssembly ficam fora dos grupos animados. Não foram acrescentados filtros, desfoques, sombras ou scripts embutidos.

## Interação no site

A arte continua animando ao passar o mouse, focar pelo teclado ou selecionar. A experiência de entrada e saída foi refinada:

1. O SVG original mantém o tamanho do tile e fica visível no carregamento e no repouso.
2. Uma camada animada decorativa é criada apenas quando necessária e visível.
3. A camada entra e sai por transição de opacidade, sem mudar o contorno ou a posição do botão. Após a entrada, o original fica transparente, preservando sua semântica; isso permite que detalhes translúcidos, como Roblox Studio, animem sem serem cobertos pela imagem estática.
4. Reentrar durante a saída reaproveita a camada, evitando reiniciar o movimento por qualquer deslocamento do ponteiro.
5. Ao sair da área visível, ocultar a aba, desativar o controle ou ativar movimento reduzido, a camada é removida.
6. Se o arquivo animado falhar, o original permanece visível, sem repetição automática infinita da requisição.

A seleção continua salva mesmo quando o ícone está fora da tela. Voltar à área visível retoma a animação. Um `IntersectionObserver` acompanha também o recorte interno da grade; a visibilidade da aba é acompanhada por `visibilitychange`.

Há no máximo uma camada decorativa por imagem ativa. Ela possui `aria-hidden=true`, alt vazio e não intercepta eventos do ponteiro. O ícone original conserva a semântica e o nome acessível do botão. Imagens removidas em busca/troca de tema liberam observações e timers.

O preview composto usa troca para a versão estática ao sair da área visível; ele mantém o layout e o comportamento de imagem única. Seu snippet continua representando a preferência de exportação, mesmo quando o preview está temporariamente pausado.

## Movimento reduzido e primeiro quadro

O site desativa as camadas e utiliza os originais quando `prefers-reduced-motion: reduce` está ativo. A preferência do sistema prevalece sobre o controle salvo.

Dentro do SVG, animações são habilitadas em `prefers-reduced-motion: no-preference`; há também uma regra explícita que interrompe entrada, arte e detalhes em movimento reduzido. Documentos SVG independentes foram testados com essa preferência.

Um cliente externo pode tratar SVG incorporado como imagem de maneira diferente do documento SVG aberto diretamente, inclusive na propagação de media queries. Isso foi observado no Chromium em testes de imagem e emulação. A garantia do site vem da troca explícita pelo original; para uma integração externa que precise de imagem estática garantida, usar `animation=false` ou omitir o parâmetro. Não há script embutido para tentar controlar o navegador hospedeiro.

O primeiro quadro das 459 variantes geradas foi comparado a 64×64 com o original, sem diferenças de pixels encontradas após o refinamento. Essa verificação diz respeito ao quadro inicial, não promete que todos os clientes externos propaguem preferências de mídia da mesma maneira.

## Implementação

| Arquivo                  | Responsabilidade                                                                |
| ------------------------ | ------------------------------------------------------------------------------- |
| lib/motion-profiles.mjs  | 12 famílias, associações de IDs, ritmos, direção e acentos internos             |
| lib/animation.mjs        | CSS compartilhado, preparação, coreografia de camadas e proteção dos fundos     |
| site/js/animacao.js      | Carregamento sob demanda, transições, estado, pausa por visibilidade e fallback |
| site/css/paginas.css     | Camada decorativa sobre a imagem original, sem mudança de layout                |
| tests/animation.test.mjs | Nove testes de transformação/contrato/perfis, incluindo todos os SVGs           |
| scripts/verify-web.mjs   | E2E de interação, pausa, fallback e movimento real das 12 famílias              |

Não há novas dependências nem um loop JavaScript por frame. O movimento acontece em CSS sobre transform/opacity. O CSS segue sendo inserido uma única vez na composição da API. O sistema não carrega duas versões de todos os ícones antecipadamente.

## API e downloads

O contrato permanece:

```text
/icons?i=react,python,docker,motion&animation=true
/icons?i=react,python,docker,motion&animation=false
```

Sem `animation=true`, a API permanece estática. SVG e ZIP conservam as animações quando ativadas; PNG e WebP partem dos originais e continuam estáticos. Os arquivos de origem e suas licenças/proveniências permanecem intactos.

## Validação

```bash
npm test
npm run build:web
npm run readme:check
npm run icones:check
npm run contraste:check
npm run format:check
```

O conjunto nativo tem **14 testes**: nove de animação e cinco de catálogo/estado/cache. O workflow continua executando `npm test`.

Com servidor, Playwright e Chromium disponíveis:

```bash
npm run test:web
npm run responsivo
```

Ambos aceitam `--base=URL`. O runner pode ser apontado por `PLAYWRIGHT_CORE` e o executável por `CHROMIUM`.

Foram verificados localmente: XML das 459 versões; fundos e máscaras de 256px fora de grupos animados; primeiro quadro dos 459 SVGs; pares temáticos; movimento real nas 12 famílias; transições, seleção, foco, reentrada, pausa fora da tela e simulação de aba oculta; recuperação de asset animado com erro; movimento reduzido; fluxo completo do montador; 180 combinações de layout. Não foi realizado benchmark de carga/GPU ou teste em Safari/Firefox.

## Publicação e rollback

As URLs públicas de assets continuam estáveis. Após validar o preview no provedor real, verificar a propagação dos SVGs, CSS e JS nas caches. Esta etapa não alterou a política de cache nem publicou o projeto.

Para reverter apenas este refinamento, restaurar os perfis/transformador, controlador do site, CSS de camadas, testes e documentação correspondentes, reconstruir a saída e promover o deployment anterior. A preferência `si:animacao`, os IDs, aliases, seleção e URLs anteriores permanecem compatíveis.
