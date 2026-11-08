# Biblioteca de animações — 64 modelos

Implementação de 08/11/2026. Esta é a referência atual; [a versão anterior](ANIMACOES_AVANCADAS.md) descreve a etapa de 12 famílias.

## Uso imediato

- Galeria: [skill-icons-gcruz.vercel.app/animacoes](https://skill-icons-gcruz.vercel.app/animacoes).
- Padrão por ícone: `/icons?i=react,python,docker&animation=true`.
- Modelo explícito: `/icons?i=gemini&animation=true&model=explosao-reconstroi`.
- Marca: `/icons?i=gcruz&animation=true&model=assinatura-vetorial`.
- Metadados: `/api/animations` (array) e `/animations.json` (objeto com count, categories e models).
- Prévia CDN: `/motion/<modelo>-dark.svg` ou `-light.svg`, usando o ícone sugerido da tabela.

Os 64 modelos são composições distintas, com storyboards, elementos e trajetórias próprios. Temas e durações não são contabilizados como modelos. A biblioteca cobre os 270 IDs por associação explícita ou fallback determinístico; **não são 270 animações exclusivas desenhadas à mão**. Os campos `icon` indicam os exemplos para os quais cada composição foi concebida. Uma escolha explícita de `model` permite aplicar qualquer composição a outro ícone; o encaixe semântico deve ser avaliado pelo integrador, especialmente nas composições com olhos, asas ou recortes de contêineres.

## Catálogo de storyboards

| Nº  | ID da API                 | Nome                       | Universo     | Ícone sugerido | Mecanismo distintivo                               |
| --- | ------------------------- | -------------------------- | ------------ | -------------- | -------------------------------------------------- |
| 01  | `assinatura-vetorial`     | Assinatura vetorial        | Marca        | `gcruz`        | máscara de escrita + caneta + traço                |
| 02  | `portal-brackets`         | Portal de brackets         | Marca        | `gctag`        | três recortes independentes + portão               |
| 03  | `fusao-monograma`         | Fusão do monograma         | Marca        | `gc`           | metades em trajetórias curvas + encaixe            |
| 04  | `terminal-assinatura`     | Terminal da assinatura     | Marca        | `gcruz`        | janela + prompt + saída em etapas                  |
| 05  | `trama-binaria`           | Trama binária              | Marca        | `gc`           | alfabeto de bits + máscara alfa + correntes        |
| 06  | `constelacao-marca`       | Constelação da marca       | Marca        | `gcruz`        | rede de estrelas + revelação radial                |
| 07  | `selo-prensado`           | Selo prensado              | Marca        | `gc`           | prensa + lacre octogonal + poeira                  |
| 08  | `solda-neon`              | Solda de neon              | Marca        | `gctag`        | percurso retangular + faixa de solda + faíscas     |
| 09  | `queda-elastica`          | Queda elástica             | Física       | `javascript`   | gravidade + squash-and-stretch + sombra            |
| 10  | `estilingue`              | Estilingue elástico        | Física       | `svelte`       | tensão horizontal + tether + overshoot             |
| 11  | `bandeira-flexivel`       | Bandeira flexível          | Física       | `flutter`      | recortes verticais + defasagem de tecido           |
| 12  | `boia-liquida`            | Boia líquida               | Física       | `flask`        | superfície ondulada + empuxo + bolhas              |
| 13  | `colisao-simetrica`       | Colisão simétrica          | Física       | `ruby`         | duas massas + colisão + ondas de impacto           |
| 14  | `balanca-giroscopica`     | Balança giroscópica        | Física       | `blender`      | gimbal triplo + estabilização                      |
| 15  | `dobra-papel`             | Dobra de papel             | Física       | `markdown`     | dobra triangular + vinco + verso                   |
| 16  | `transmissao-engrenagens` | Transmissão de engrenagens | Física       | `rust`         | trem de engrenagens + dentes + transmissão         |
| 17  | `palco-isometrico`        | Palco isométrico           | Profundidade | `vscode`       | palco em losango + projeção isométrica             |
| 18  | `holograma`               | Holograma volumétrico      | Profundidade | `golang`       | fatias de leitura + matriz de projeção             |
| 19  | `cubo-origami`            | Cubo origami               | Profundidade | `unity`        | faces articuladas + profundidade por escala        |
| 20  | `tunel-portal`            | Túnel de portais           | Profundidade | `nextjs`       | perspectiva concêntrica + travessia de plano       |
| 21  | `carta-dupla`             | Carta de duas faces        | Profundidade | `css`          | troca frente/verso + escorço de cartão             |
| 22  | `paisagem-paralaxe`       | Paisagem em paralaxe       | Profundidade | `threejs`      | oclusão entre três planos + deslocamento de câmera |
| 23  | `prisma-cromatico`        | Prisma cromático           | Profundidade | `figma`        | refração por prisma + leque espectral              |
| 24  | `espiral-infinita`        | Espiral infinita           | Profundidade | `unrealengine` | vórtice segmentado + escala radial                 |
| 25  | `explosao-reconstroi`     | Explosão e reconstrução    | Energia      | `gemini`       | fratura triangular + dispersão balística           |
| 26  | `meteoro`                 | Rastro de meteoro          | Energia      | `postman`      | trajetória parabólica + cauda com atraso           |
| 27  | `circuito-relampago`      | Circuito relâmpago         | Energia      | `vite`         | rede ortogonal + descarga elétrica                 |
| 28  | `aurora`                  | Aurora de luz              | Energia      | `azure`        | três cortinas curvas + mistura de cores            |
| 29  | `toro-plasma`             | Toro de plasma             | Energia      | `firebase`     | anel com oclusão frontal/traseira + plasma         |
| 30  | `tinta-viva`              | Tinta viva                 | Energia      | `illustrator`  | metaballs + cobertura orgânica                     |
| 31  | `eclipse-solar`           | Eclipse solar              | Energia      | `eclipse`      | ocultação orbital + coroa solar                    |
| 32  | `vortice-cometas`         | Vórtice de cometas         | Energia      | `jupyter`      | espirais entrelaçadas + convergência               |
| 33  | `montagem-voxel`          | Montagem voxel             | Construção   | `godot`        | mosaico 4×4 + montagem espacial                    |
| 34  | `planta-tecnica`          | Planta técnica             | Construção   | `autocad`      | dimensionamento + contorno projetado               |
| 35  | `domino-mosaico`          | Dominó de placas           | Construção   | `windows`      | cadeia de dobradiças horizontais                   |
| 36  | `gravacao-laser`          | Gravação a laser           | Construção   | `lucide`       | varredura serpentina + revelação por recorte       |
| 37  | `costura-zipper`          | Costura e zíper            | Construção   | `gitlab`       | fecho longitudinal + duas metades + cursor         |
| 38  | `ordenacao-pixels`        | Ordenação de pixels        | Construção   | `prettier`     | ordenação por colunas discretas                    |
| 39  | `tecido-cruzado`          | Tecido cruzado             | Construção   | `tailwindcss`  | urdume/trama + mosaico entrelaçado                 |
| 40  | `impressora-camadas`      | Impressora de camadas      | Construção   | `html`         | extrusão por camadas + cabeçote oscilante          |
| 41  | `lago-ondas`              | Lago de ondas              | Orgânicos    | `postgresql`   | reflexo vertical + propagação na superfície        |
| 42  | `flor-petalas`            | Flor de pétalas            | Orgânicos    | `claude`       | oito pétalas radiais + expansão floral             |
| 43  | `membrana-gel`            | Membrana de gel            | Orgânicos    | `bun`          | membrana orgânica + amortecimento volumétrico      |
| 44  | `guaxinim-vivo`           | Guaxinim vivo              | Orgânicos    | `bandit`       | olhar + pálpebras + sobrancelhas do Bandit         |
| 45  | `enxame-vagalumes`        | Enxame de vagalumes        | Orgânicos    | `mongodb`      | enxame em trajetórias curvas + pouso               |
| 46  | `asas-borboleta`          | Asas de borboleta          | Orgânicos    | `vuejs`        | asas articuladas + trajetória de voo               |
| 47  | `vinha-crescimento`       | Vinha em crescimento       | Orgânicos    | `spring`       | crescimento por caminho + abertura de folhas       |
| 48  | `dupla-helice`            | Dupla hélice               | Orgânicos    | `anaconda`     | hélice dupla + oclusão alternada                   |
| 49  | `foco-iris`               | Foco de íris               | Cinema       | `photoshop`    | autofoco + diafragma por máscara circular          |
| 50  | `travelling`              | Travelling de câmera       | Cinema       | `vercel`       | dolly sobre trilhos + ponto de fuga                |
| 51  | `claquete`                | Claquete de estreia        | Cinema       | `premiere`     | claquete com dobradiça + wipe diagonal             |
| 52  | `longa-exposicao`         | Longa exposição            | Cinema       | `angular`      | rastros fotográficos + exposição acumulada         |
| 53  | `holofote`                | Holofote de palco          | Cinema       | `heroku`       | cone rotativo + iluminação alfa                    |
| 54  | `brilho-vidro`            | Brilho de vidro            | Cinema       | `apple`        | reflexo especular + lâmina de vidro                |
| 55  | `rebobinar-fita`          | Rebobinar a fita           | Cinema       | `spotify`      | carretéis contrarrotativos + transporte de fita    |
| 56  | `dupla-exposicao`         | Dupla exposição            | Cinema       | `instagram`    | paisagem mascarada + dissolução fotográfica        |
| 57  | `reator-atomico`          | Reator atômico             | Tecnologia   | `react`        | orbitais articulados + emissão nuclear             |
| 58  | `serpentes-entrelacadas`  | Serpentes entrelaçadas     | Tecnologia   | `python`       | segmentos originais em perseguição complementar    |
| 59  | `carga-containers`        | Carga de contêineres       | Tecnologia   | `docker`       | guindaste + caixas recortadas sobre convés fixo    |
| 60  | `historico-commits`       | Histórico de commits       | Tecnologia   | `git`          | grafo de commits + bifurcação + merge              |
| 61  | `chuva-contribuicoes`     | Chuva de contribuições     | Tecnologia   | `github`       | matriz de contribuições + aparição do mascote      |
| 62  | `compilacao-tipos`        | Compilação de tipos        | Tecnologia   | `typescript`   | tokens de código + compilação + confirmação        |
| 63  | `fila-eventos`            | Fila de eventos            | Tecnologia   | `nodejs`       | fila FIFO + event loop + passagem de pacote        |
| 64  | `orquestracao-pods`       | Orquestração de pods       | Tecnologia   | `kubernetes`   | fan-out de implantação + rede de sete pods         |

Cada registro também contém `concept` (descrição), `duration` (segundos) e `cost` (estimativa relativa de custo visual, não benchmark de hardware). Durações de 6,8 a 8,4s preservam preparação, desenvolvimento, conclusão e retorno ao desenho original. Energia usa filtros e partículas em alguns modelos, com custo superior às transformações simples.

## Galeria e interação

A página oferece pesquisa sem acentos por nome, conceito, universo e ícone sugerido; filtro pelos oito universos; comparação das composições com o mesmo ícone; tema claro/escuro; cópia de URL e download SVG. Os nomes e conceitos são inseridos com `textContent`; a pesquisa não interpreta HTML.

Hover e foco ativam a prévia. Clique, Enter ou Espaço fixam uma; fixar outra libera a anterior. O botão informa o estado por `aria-pressed` e nome acessível. A galeria mantém somente uma prévia fixada, além de eventuais previews sob foco/hover. Nunca carrega automaticamente 64 animações ativas. As imagens originais permanecem disponíveis no carregamento e em falhas.

O controle de movimento é persistido no mesmo armazenamento do builder. Movimento reduzido prevalece sobre a preferência salva. O controlador remove overlays quando a aba fica oculta, quando o ícone sai da área visível ou quando o movimento é desativado. Os estados são liberados ao remover cards ou trocar temas/filtros. O site usa originais estáticos nesses casos.

## Arquitetura e extensão

| Módulo                      | Responsabilidade                                                                    |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `lib/motion-pack-*.mjs`     | Oito arquivos com oito storyboards cada; metadados, composição SVG e keyframes      |
| `lib/motion-kit.mjs`        | Primitivas de paths, máscaras, clips, partículas, filtros e geometria compartilhada |
| `lib/motion-library.mjs`    | Registro, associações padrão, catálogo serializável e CSS seletivo                  |
| `lib/motion-profiles.mjs`   | Fachada para o resolvedor de perfis                                                 |
| `lib/animation.mjs`         | Leitura estrutural de assets confiáveis, extração da arte e namespace de IDs        |
| `lib/icons.mjs`             | Validação de parâmetros, composição e endpoints compartilhados                      |
| `scripts/vercel-assets.mjs` | 459 SVGs animados padrão e 128 previews dos modelos                                 |
| `site/js/animacao.js`       | Carregamento/remoção de overlays conforme interação e visibilidade                  |
| `site/js/motion-gallery.js` | Filtros, comparação, pin, links e downloads da galeria                              |

A geometria original fica uma vez em `defs` e é reutilizada por `use`. Fragmentos não replicam imagens base64, nem mesmo nos modelos com muitas peças. As referências de gradientes, masks, clips e hrefs de origem recebem namespace por ícone/modelo/instância. A composição de ícones repetidos não reutiliza IDs. Originais em `icons/` permanecem intactos.

Fundos de 256×256 e os paths especiais de SQLite/WebAssembly ficam estáticos. Clips e transforms ancestrais são preservados. O palco respeita os limites do badge; Roblox preserva sua silhueta com composição padrão de brilho. React e Python reutilizam camadas existentes; Docker move recortes de caixas mantendo o restante da arte; Bandit recebe olhos/pálpebras sincronizados com a inclinação do rosto.

Cada SVG independente inclui somente o CSS do seu modelo. Um SVG composto inclui uma folha com os modelos utilizados, deduplicados. Não há dependência de animação no runtime nem laço JavaScript por quadro. Filtros SVG são estáticos: somente suas formas de entrada se movem. Não são necessários novos pacotes, segredos, serviços ou migrações de banco.

Para acrescentar um storyboard: definir ID único, conceito e mecanismo verificavelmente distintos; compor com as primitivas; declarar cada track uma vez; manter repouso em 0/100%; registrar no pack; selecionar um ícone existente; testar os dois temas e geometria genérica; revisar quadros e ciclo completos. O teste de contagem exata deverá ser atualizado deliberadamente quando a biblioteca ultrapassar 64 modelos. Não contar uma mudança de duração, direção ou intensidade como novo modelo.

## Contratos e compatibilidade

`animation` continua aceitando apenas `true`/`false`, com padrão `false`. `model` é opcional; ID desconhecido retorna 400, inclusive quando animation está desligado. Modelo vazio usa o padrão. `model` não ativa movimento sozinho: `animation=true` continua obrigatório. Ordem, repetição, temas, aliases e dimensões do SVG composto são preservados. Os nomes das classes internas mudaram nesta versão e não constituem contrato público de integração.

SVG e seus downloads preservam animação. PNG/WebP permanecem rasterizações estáticas; a galeria exporta SVG. O primeiro quadro mantém a pose/cores de origem. A reutilização de geometria por use e o clipping podem produzir pequenas diferenças de antialiasing; não se promete identidade binária de pixels entre renderizadores.

As regras de movimento reduzido desativam todas as tracks, escondem efeitos e restauram a arte. SVGs abertos diretamente foram validados dessa forma. Clientes de imagens podem bloquear CSS, congelar SVGs, filtrar use/filtros ou propagar preferências de mídia de maneira diferente. Para uma imagem estática garantida em integração externa, omitir animation ou usar false. O site garante a redução por troca explícita para os originais. Não se promete reprodução animada no GitHub ou em todos os clientes de email.

## Validação e critérios de aceite

1. `npm test`: 16 testes nativos com verificações em lote dos 459 assets, 64 modelos, 256 combinações modelo/estrutura, geometria, namespace, repetição, perfis, estado/cache e contratos HTTP.
2. `npm run build:web`: sete páginas, manifesto de 64 modelos, 459 SVGs animados e 128 previews.
3. Com o servidor ativo: `npm run test:web` verifica montador, aliases, persistência inválida, teclado, downloads, erro de carregamento, pausa, redução e execução CSS dos 64 modelos.
4. `npm run test:motion:visual` valida XML e primeiro quadro de 459 variantes; valida XML e três quadros de cada um dos 128 previews em imagem SVG real. A tolerância de erro médio é 0,35 por canal de 0–255 a 64×64, para antialiasing; alterações de forma relevantes reprovam. Movimento exige diferença média superior a 0,5 em pelo menos um quadro amostrado.
5. `npm run responsivo`: sete páginas × 15 dimensões × dois temas = 210 combinações, sem rolagem horizontal ou alvos de toque insuficientes.
6. Revisão visual humana/assistida: examinar todos os modelos em repouso, desenvolvimento e conclusão, além da reprodução de ciclos completos. Testes de unicidade de strings complementam esta revisão; não comprovam originalidade artística por si só.

Os runners de navegador exigem Playwright e Chromium disponíveis e não são dependências de produção. Configure `PLAYWRIGHT_CORE` e `CHROMIUM` conforme o README. Verificações ausentes não devem ser registradas como executadas.

## Publicação e rollback

Entregar por branch, PR e CI; verificar build da Vercel, promover via merge e testar o domínio público. Assets usam a versão de conteúdo para evitar misturar CSS, JS, manifestos e SVGs antigos. Para rollback imediato, restaurar o deployment anterior na Vercel; em seguida reverter o merge para que Git e produção voltem à mesma versão. A saída estática da API permanece compatível. Nenhum dado de usuário ou banco é migrado.

## Limites e próximos refinamentos

- Avaliar ciclos completos em Safari e Firefox reais e em aparelhos móveis modestos. A validação automatizada desta entrega usa Chromium; não equivale a certificação de todos os motores.
- Testar o contraste dos efeitos decorativos nas marcas com fundos muito saturados; os textos e controles seguem os tokens do site. As partículas não transmitem informação funcional.
- As estimativas de custo são qualitativas. Instrumentar orçamento de GPU/frame em dispositivos de referência antes de habilitar dezenas de ícones selecionados simultaneamente em uma aplicação externa.
- Ícones fora dos exemplos autorais usam composição contextual compartilhada. Novas animações exclusivas devem entrar após revisão visual específica de cada marca.

## Resultado da validação desta entrega

Execução local em 08/11/2026, com Node 24.22.1 e Chromium 156.0.8078.79:

| Verificação                                    | Resultado                                                                                |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Testes nativos                                 | 16 aprovados, nenhum ignorado                                                            |
| Catálogo, normalização, contraste e formatação | Aprovados                                                                                |
| Build web                                      | Sete páginas, 64 modelos e 128 previews gerados                                          |
| Fluxo de navegador                             | Builder, galeria, downloads, redução, pausa e execução dos 64 modelos aprovados          |
| SVG em imagem real                             | 459 variantes padrão e 128 previews aprovados; XML válido e movimento presente           |
| Primeiro quadro                                | Erro médio máximo de 0,2296 por canal de 0–255, abaixo da tolerância 0,35                |
| Responsividade                                 | 210 combinações aprovadas; nenhum transbordo, rolagem horizontal ou alvo inferior a 44px |

Revisão visual dos 64 modelos em quatro momentos do ciclo complementou a verificação automatizada. A amostragem não substitui a avaliação dos usuários nem a validação nos demais motores de navegador.

Após a publicação, o E2E completo também passou em `https://skill-icons-gcruz.vercel.app`, incluindo navegação sem extensão, galeria e execução dos 64 modelos. A verificação HTTP pública confirmou os dois manifestos, 128 previews e 64 composições de API com ícones repetidos, XML válido e IDs isolados. A validação encontrou e corrigiu a configuração de URLs limpas da Vercel. O teste de fallback passou a aguardar a imagem original e a remoção do overlay em vez de depender de uma espera fixa de 200ms.
