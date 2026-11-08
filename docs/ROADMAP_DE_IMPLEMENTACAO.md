# Roadmap de implementação — skill-icons

> Registro histórico da auditoria inicial. As implementações posteriores estão em [ANIMACAO_DOS_ICONES.md](ANIMACAO_DOS_ICONES.md) e [ATUALIZACAO_DO_CATALOGO.md](ATUALIZACAO_DO_CATALOGO.md). Os achados e as contagens deste documento se referem à base auditada, não ao estado posterior às alterações.

**Base:** `6f6ed481f3cacc62b1a322e5ba19fa35958d28e3` · **planejado em:** 08/11/2026.  
**Status:** todas as 26 tarefas estão propostas, não implementadas. O [diagnóstico](ANALISE_E_PLANO_DE_MELHORIAS.md) contém evidências E01–E26 e especificações M01–M26; o [inventário](INVENTARIO_TECNICO.md) identifica módulos e comandos existentes.

A fase 1 recebe o nome solicitado “Correções críticas”, mas não afirma existência de vulnerabilidade crítica remota demonstrada. Ela reúne correções urgentes de segurança, integridade e funcionamento, classificadas individualmente. Urgência por advisory deve considerar atingibilidade, não apenas contagem.

IDs **R01–R26** representam tarefas em ordem de execução; IDs **M01–M26** apontam para a especificação correspondente no diagnóstico. Não são 52 trabalhos: é um mapeamento um para um. Dependências Mxx são pré-requisitos técnicos; executar os blocos abaixo na ordem resolve todos. Decisões humanas não resolvidas mantêm apenas a tarefa dependente pendente; não justificam parar correções independentes.

Não há datas fechadas nem capacidade de equipe informada. Complexidade baixa equivale aproximadamente a 1–2 dias líquidos, média a 3–5 dias e alta a 1–2 semanas, a reestimar após reproduzir o caso. Não somar essas faixas como compromisso de calendário. Correções incluem seus próprios testes; a fase 7 amplia e formaliza a certificação de release.

## Sequência e gates

| Fase | Entregável                                             | Gate de saída                                                               |
| ---- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| 1    | Correções urgentes isoladas e cadeia vulnerável triada | CI válido, casos reproduzidos cobertos, nenhum novo erro de alta prioridade |
| 2    | Contratos, metadados, integridade e documentação       | Suite mínima executável; validação de assets e documentação coerente        |
| 3    | Baseline e cache/operação com orçamento                | Métricas registradas; rollout/rollback de assets sem mistura de versões     |
| 4    | Exportação controlada e contrato API definido          | Arquivos íntegros, uma execução por vez, política de API explícita          |
| 5    | Estado visual/foco e erros recuperáveis                | Fluxo por teclado e recuperação sem perda de seleção                        |
| 6    | Toolchain reproduzível                                 | Instalação congelada e runtime comprovado em preview                        |
| 7    | Gates obrigatórios e release ensaiada                  | Matriz de integração, evidências e rollback aprovados                       |
| 8    | Novas coleções e ADR de escala                         | Demanda/ganho comprovados; nenhuma migração só por tendência                |

## Fase 1 — Correções críticas

### R01 → M01 — Restabelecer o workflow do GitHub Actions

| Campo                              | Plano executável                                                                                                                                                                                                |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / baixa                                                                                                                                                                                         |
| Descrição e objetivo               | Disponibilizar o secret em env no escopo adequado e testar sua presença via env; não imprimir o valor. Exigir também account ID para publicar. Separar validação de deploy e exercitar cenário sem credenciais. |
| Dependências técnicas              | nenhuma                                                                                                                                                                                                         |
| Módulos afetados                   | `.github/workflows/wrangler-action.yml`, `DEPLOY.md`                                                                                                                                                            |
| Pré-requisitos                     | Acesso de escrita ao workflow e possibilidade de validar PR sem secrets.                                                                                                                                        |
| Critérios de conclusão             | actionlint sem erros; workflow de validação executa os checks em PR; ausência de secrets pula somente publicação; presença é validada em ambiente autorizado.                                                   |
| Riscos e controle                  | Publicar por engano ao corrigir a condição; validar primeiro sem credenciais. Validar o caso em PR e manter reversão isolada.                                                                                   |

### R02 → M02 — Eliminar interpretação de HTML na busca

| Campo                              | Plano executável                                                                                                                                                                   |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / baixa                                                                                                                                                            |
| Descrição e objetivo               | Construir a mensagem com nós DOM e textContent; reservar HTML estático para a ajuda. Revisar outras interpolações e adicionar regressão específica sem usar sanitização por regex. |
| Dependências técnicas              | nenhuma                                                                                                                                                                            |
| Módulos afetados                   | `site/js/builder.js`, `site/js/dados.js`                                                                                                                                           |
| Pré-requisitos                     | Reprodução local isolada e fixtures de caracteres HTML.                                                                                                                            |
| Critérios de conclusão             | Tags, aspas e entidades aparecem como texto; nenhum img/event handler é criado a partir da consulta; busca e destaque continuam funcionando.                                       |
| Riscos e controle                  | Escapar duas vezes ou quebrar destaque da busca. Validar o caso em PR e manter reversão isolada.                                                                                   |

### R03 → M03 — Resolver apenas aliases próprios e válidos

| Campo                              | Plano executável                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status / prioridade / complexidade | Proposta / alta / baixa                                                                                                                                      |
| Descrição e objetivo               | Usar Object.hasOwn ou Map e confirmar que o nome resolvido existe no catálogo e que a variante está presente. Preservar aliases, ordem e repetições válidas. |
| Dependências técnicas              | nenhuma                                                                                                                                                      |
| Módulos afetados                   | `lib/icons.mjs`, futuros testes de contrato                                                                                                                  |
| Pré-requisitos                     | Build gerado e lista dos 44 aliases/257 IDs congelada para comparação.                                                                                       |
| Critérios de conclusão             | constructor, **proto** e toString resultam 400; todos os aliases válidos resolvem nos dois temas; nenhuma saída contém undefined.                            |
| Riscos e controle                  | Regressão nos 44 aliases ou nos ícones sem tema. Validar o caso em PR e manter reversão isolada.                                                             |

### R04 → M04 — Limitar custo de composição e entrada

| Campo                              | Plano executável                                                                                                                                                                                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                                                                                       |
| Descrição e objetivo               | Definir limites a partir de M25; antecipar validação antes de montar strings; limitar quantidade e tamanho sem remover repetições silenciosamente. Manter all e catálogo atual; usar erro consistente (400/413) documentado. Rate limit só após medir tráfego e avaliar clientes GitHub por IP compartilhado. |
| Dependências técnicas              | nenhuma; calibração por M25                                                                                                                                                                                                                                                                                   |
| Módulos afetados                   | `lib/icons.mjs`, adaptadores, documentação da API                                                                                                                                                                                                                                                             |
| Pré-requisitos                     | Contrato de quantidade inicial aprovado pelo mantenedor; manter all e catálogo atual. M25 refina o orçamento na fase 3.                                                                                                                                                                                       |
| Critérios de conclusão             | Limites explícitos com testes de fronteira N/N+1 e bytes; all continua 200; entrada rejeitada não entra na composição; medir memória e latência de casos limite.                                                                                                                                              |
| Riscos e controle                  | Novos limites podem rejeitar badges existentes; coletar amostras e divulgar o contrato. Validar o caso em PR e manter reversão isolada.                                                                                                                                                                       |

### R05 → M05 — Padronizar erros públicos e diagnóstico privado

| Campo                              | Plano executável                                                                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / baixa                                                                                                                                                                                   |
| Descrição e objetivo               | Devolver mensagem pública estável e ID de correlação; registrar detalhes somente no servidor sem query completa nem cabeçalhos sensíveis; normalizar validação de URL e respostas não cacheáveis de erro. |
| Dependências técnicas              | nenhuma                                                                                                                                                                                                   |
| Módulos afetados                   | `index.js`, `api/_adapter.mjs`, `lib/icons.mjs`                                                                                                                                                           |
| Pré-requisitos                     | Canal de logs privado disponível ou stub testável nos adaptadores.                                                                                                                                        |
| Critérios de conclusão             | Falha induzida não expõe caminhos/stack; log contém correlação e contexto mínimo; 400 de validação mantém compatibilidade; erros não herdam cache de sucesso.                                             |
| Riscos e controle                  | Perder diagnóstico ao ocultar stack sem log alternativo. Validar o caso em PR e manter reversão isolada.                                                                                                  |

### R06 → M06 — Validar e normalizar estado persistido

| Campo                              | Plano executável                                                                                                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                       |
| Descrição e objetivo               | Criar normalizador puro com Array.isArray, IDs conhecidos únicos, enum svg/png/webp, categoria válida, inteiros e limites; defaults seguros por campo; versionar esquema si: sem apagar preferências válidas. |
| Dependências técnicas              | nenhuma                                                                                                                                                                                                       |
| Módulos afetados                   | `site/js/store.js`, `site/js/builder.js`                                                                                                                                                                      |
| Pré-requisitos                     | Amostras de storage antigo e política de defaults por campo.                                                                                                                                                  |
| Critérios de conclusão             | null, {}, strings, arrays mistos, números não finitos e versões anteriores não impedem inicialização; seleção válida, tema e ordem são preservados; testes cobrem intervalos 1–50 e 16–1024.                  |
| Riscos e controle                  | Limpeza excessiva de seleções legítimas; migração de estado precisa ser reversível. Validar o caso em PR e manter reversão isolada.                                                                           |

### R07 → M07 — Tornar o servidor de desenvolvimento resiliente

| Campo                              | Plano executável                                                                                                                                                                                                      |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / baixa                                                                                                                                                                                              |
| Descrição e objetivo               | Capturar erros por requisição e de streams; devolver 400/500 sem encerrar servidor; verificar contenção via path.relative e fronteira de diretório; bind local por padrão; documentar que não é servidor de produção. |
| Dependências técnicas              | nenhuma                                                                                                                                                                                                               |
| Módulos afetados                   | `scripts/serve.mjs`                                                                                                                                                                                                   |
| Pré-requisitos                     | Servidor de teste isolado, porta livre e fixtures de URL/caminho.                                                                                                                                                     |
| Critérios de conclusão             | /%ZZ retorna 400 e a próxima requisição normal retorna 200; caminhos codificados não saem de public; falha de stream não derruba processo; testes de contenção.                                                       |
| Riscos e controle                  | Mudar bind pode afetar previews remotos; oferecer configuração explícita se necessária. Validar o caso em PR e manter reversão isolada.                                                                               |

### R08 → M08 — Corrigir avisos de segurança da cadeia de ferramentas

| Campo                              | Plano executável                                                                                                                                                                                                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                                                               |
| Descrição e objetivo               | Atualizar Wrangler dentro da linha compatível e regenerar lock com um gerenciador definido; confirmar transitivas corrigidas (sharp >=0.35.5 e undici >=7.30.1 para os avisos consultados). Preferir atualização do pacote pai a overrides; repetir audit e dry-run antes de release. |
| Dependências técnicas              | nenhuma                                                                                                                                                                                                                                                                               |
| Módulos afetados                   | `package.json`, `yarn.lock`, workflow                                                                                                                                                                                                                                                 |
| Pré-requisitos                     | Registro acessível, advisories atuais e acesso a dry-run sem publicar.                                                                                                                                                                                                                |
| Critérios de conclusão             | Novo lock reproduzível; avisos identificados resolvidos ou exceção documentada com análise de atingibilidade, responsável e expiração; build, servidor e dry-run Worker passam.                                                                                                       |
| Riscos e controle                  | Mudanças no bundler, compatibilidade Worker ou binários opcionais; não aplicar audit fix --force indiscriminadamente. Validar o caso em PR e manter reversão isolada.                                                                                                                 |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 2 — Fundação técnica

### R09 → M09 — Estabelecer testes de comportamento e contratos

| Campo                              | Plano executável                                                                                                                                                                                                                        |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                 |
| Descrição e objetivo               | Adotar node:test para núcleo/ZIP/normalização e testes de adaptadores, com fixtures pequenas e cenários de erro; browser runner fixado para fluxos reais. Extrair funções puras só onde necessário. Não trocar stack para obter testes. |
| Dependências técnicas              | M01                                                                                                                                                                                                                                     |
| Módulos afetados                   | `lib/icons.mjs`, `api/`, `site/js/`, futuros `tests/`, `package.json`                                                                                                                                                                   |
| Pré-requisitos                     | CI corrigido; definir comando e runner que não exijam credenciais.                                                                                                                                                                      |
| Critérios de conclusão             | Comando de testes documentado e executado em PR; cada bug M02–M08 tem regressão; contrato de aliases, temas, ordem, erros, dimensões e bytes de exportação coberto.                                                                     |
| Riscos e controle                  | Snapshots grandes e frágeis ou métricas de cobertura que não demonstram comportamento. Validar o caso em PR e manter reversão isolada.                                                                                                  |

### R10 → M10 — Separar metadados do carregamento de SVGs

| Campo                              | Plano executável                                                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                |
| Descrição e objetivo               | Extrair metadados canônicos leves para ESM importável sem dist; gerar manifestos da mesma fonte, mantendo nomes e categorias. Separar catálogo e renderização de forma incremental, sem novos serviços. |
| Dependências técnicas              | M09                                                                                                                                                                                                     |
| Módulos afetados                   | `lib/`, `scripts/readme-table.mjs`, `scripts/vercel-assets.mjs`, `scripts/build-pages.mjs`                                                                                                              |
| Pré-requisitos                     | Fixtures de catálogo/API; preservar ordenação e nomes.                                                                                                                                                  |
| Critérios de conclusão             | Gerador de tabela funciona antes de dist existir; nenhuma regex lê JS para obter aliases; API e manifestos mantêm IDs/campos/ordem contratados; checks de categorias passam.                            |
| Riscos e controle                  | Reordenação involuntária do catálogo ou aliases; ciclos de importação. Validar o caso em PR e manter reversão isolada.                                                                                  |

### R11 → M11 — Validar assets SVG e integridade de catálogo

| Campo                              | Plano executável                                                                                                                                                                                                                                                                                                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                                                                                                                                                      |
| Descrição e objetivo               | Gate de entrada com parser XML seguro sem resolução externa: allowlist compatível com assets atuais, proibir scripts/eventos/foreignObject e URL de rede; permitir explicitamente raster embutido necessário. Validar extensão, nome, lower-case collisions, viewBox, pares, categorias e aliases; tratar IDs/referências por ocorrência se composição precisar desambiguar. |
| Dependências técnicas              | M09, M10                                                                                                                                                                                                                                                                                                                                                                     |
| Módulos afetados                   | `build.js`, `icons/`, `scripts/`, `lib/icons.mjs`                                                                                                                                                                                                                                                                                                                            |
| Pré-requisitos                     | Política de SVG segura com exceções justificadas para assets atuais.                                                                                                                                                                                                                                                                                                         |
| Critérios de conclusão             | Todos os assets atuais passam sem alteração visual injustificada; fixtures maliciosas ou inconsistentes falham antes do bundle; XML externo não é resolvido; testes visuais de gradientes e ícones repetidos passam.                                                                                                                                                         |
| Riscos e controle                  | Sanitização destrutiva pode remover gradientes/imagens legítimos; IDs repetidos só entre variantes iguais não provam defeito visual atual. Validar o caso em PR e manter reversão isolada.                                                                                                                                                                                   |

### R12 → M22 — Completar rastreabilidade de licenças de fontes e assets

| Campo                              | Plano executável                                                                                                                                                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / baixa                                                                                                                                                                                                     |
| Descrição e objetivo               | Confirmar proveniência/versão das fontes, incluir textos e avisos exigidos pelas licenças upstream e registrar origem/atribuição por novos assets. Revisão humana de direitos de marca e continuidade dos créditos upstream. |
| Dependências técnicas              | nenhuma                                                                                                                                                                                                                      |
| Módulos afetados                   | `site/fonts/`, `brand/README.md`, documentação de contribuição                                                                                                                                                               |
| Pré-requisitos                     | Verificar proveniência e textos oficiais das fontes redistribuídas.                                                                                                                                                          |
| Critérios de conclusão             | Binários têm proveniência, licença completa aplicável e copyright preservado na distribuição; nenhum asset substituído sem revisão visual e de licença.                                                                      |
| Riscos e controle                  | Licença informada pelo README pode não corresponder ao binário exato; verificar origem sem presumir autorização de marca. Validar o caso em PR e manter reversão isolada.                                                    |

### R13 → M24 — Unificar documentação e convenção do README

| Campo                              | Plano executável                                                                                                                                                                                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / baixa                                                                                                                                                                                                                                 |
| Descrição e objetivo               | Em implementação separada, escolher caminho canônico e mover o catálogo gerado para docs ou incorporá-lo ao README; mudar gerador, links e CI no mesmo PR. Atualizar deploy/limites a partir de fontes oficiais e medidas, sem apagar documentação útil. |
| Dependências técnicas              | M09                                                                                                                                                                                                                                                      |
| Módulos afetados                   | `README.md`, `readme.md`, `scripts/readme-table.mjs`, `DEPLOY.md`, links de páginas                                                                                                                                                                      |
| Pré-requisitos                     | Decidir destino canônico e estratégia para ambientes sem distinção de caixa.                                                                                                                                                                             |
| Critérios de conclusão             | Um README principal; gerador e readme:check atuam no destino decidido; 257 IDs continuam documentados; links internos válidos em Linux e checkout sem distinção de caixa.                                                                                |
| Riscos e controle                  | Renomeação só de caixa precisa de git mv intermediário; manter âncoras ou links de compatibilidade. Validar o caso em PR e manter reversão isolada.                                                                                                      |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 3 — Performance e otimização

### R14 → M25 — Criar baseline de desempenho e orçamento de recursos

| Campo                              | Plano executável                                                                                                                                                                                                                           |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                                   |
| Descrição e objetivo               | Medir build, bytes gzip/Brotli, cold/warm dos endpoints, casos 1/15/all/limite, busca, troca de tema e lote 257 em 256/1024px; registrar aparelho/versões/cache e percentis em preview. Definir budgets com responsável antes de otimizar. |
| Dependências técnicas              | M09                                                                                                                                                                                                                                        |
| Módulos afetados                   | futuro benchmark, `lib/icons.mjs`, `site/js/download.js`, pipeline                                                                                                                                                                         |
| Pré-requisitos                     | Ambiente staging/local controlado, aparelho/versões e carga máxima documentados.                                                                                                                                                           |
| Critérios de conclusão             | Relatório repetível com p50/p95 e memória para amostra declarada; baseline aprovada; M04 e M23 têm critérios quantitativos; cada otimização demonstra ganho sem alterar saída.                                                             |
| Riscos e controle                  | Ensaios intensivos em produção podem gerar custos; executar local/staging com carga limitada. Validar o caso em PR e manter reversão isolada.                                                                                              |

### R15 → M12 — Versionar assets e alinhar cache ao deploy

| Campo                              | Plano executável                                                                                                                                                                                                                                        |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                                                |
| Descrição e objetivo               | Adicionar fingerprints ou caminhos versionados aos assets internos e ao manifest; manter URLs públicas legadas; versionar referências do build e definir retenção/purge. Não usar immutable em URL cujo conteúdo muda; provar headers reais em preview. |
| Dependências técnicas              | M09, M10, M25                                                                                                                                                                                                                                           |
| Módulos afetados                   | `vercel.json`, geradores, `site/partials/head.html`, consumidores de manifest                                                                                                                                                                           |
| Pré-requisitos                     | Baseline de M25 e possibilidade de publicar dois previews e reverter.                                                                                                                                                                                   |
| Critérios de conclusão             | Dois deploys consecutivos e rollback carregam conjuntos coerentes; URLs antigas ainda funcionam; cache hit/miss e revalidação medidos; frontend não mistura versões.                                                                                    |
| Riscos e controle                  | Invalidar todos os caches aumenta cold traffic; remoção precoce de versões quebra HTML em cache. Validar o caso em PR e manter reversão isolada.                                                                                                        |

### R16 → M13 — Compartilhar requisições concorrentes do manifesto

| Campo                              | Plano executável                                                                                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / baixa                                                                                                                              |
| Descrição e objetivo               | Memorizar Promise em voo; compartilhar resultado; limpar Promise após rejeição para permitir retry. Evitar cache persistente adicional sem evidência. |
| Dependências técnicas              | M09, M25                                                                                                                                              |
| Módulos afetados                   | `site/js/dados.js`                                                                                                                                    |
| Pré-requisitos                     | Contador de fetch em teste e caso de retry simulado.                                                                                                  |
| Critérios de conclusão             | Duas chamadas concorrentes usam um fetch; falha é compartilhada; nova chamada após falha tenta novamente; busca mantém ordenação.                     |
| Riscos e controle                  | Rejeição memorizada permanentemente inutilizaria novas tentativas. Validar o caso em PR e manter reversão isolada.                                    |

### R17 → M17 — Definir observabilidade mínima e recuperação operacional

| Campo                              | Plano executável                                                                                                                                                                                                        |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                |
| Descrição e objetivo               | Medir status/latência/erros por rota e versão sem consultas completas; smoke periódico de SVG e manifest; alertas simples com responsável e runbook de rollback/purge. Usar primeiro recursos existentes da hospedagem. |
| Dependências técnicas              | M05, M25                                                                                                                                                                                                                |
| Módulos afetados                   | `api/_adapter.mjs`, `index.js`, workflow, futura documentação operacional                                                                                                                                               |
| Pré-requisitos                     | Responsável operacional, retenção e canais de alerta definidos.                                                                                                                                                         |
| Critérios de conclusão             | Falha sintética dispara alerta em staging; requisição é correlacionável; runbook permite promover versão anterior e validar API; não há secrets/query completa nos logs.                                                |
| Riscos e controle                  | Logs podem registrar dados desnecessários e elevar custos; definir retenção/amostragem. Validar o caso em PR e manter reversão isolada.                                                                                 |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 4 — Melhorias funcionais

### R18 → M14 — Controlar exportações e preservar opções do lote

| Campo                              | Plano executável                                                                                                                                                                                                                                    |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                                            |
| Descrição e objetivo               | Snapshot imutável das opções no início, trava de execução inclusive no download único, aria-busy e bloqueio/restauração dos controles apropriados; cancelamento cooperativo entre itens; conservar relatório de falhas e validar MIME real de WebP. |
| Dependências técnicas              | M06, M09                                                                                                                                                                                                                                            |
| Módulos afetados                   | `site/js/builder.js`, `site/js/download.js`, `site/js/zip.js`                                                                                                                                                                                       |
| Pré-requisitos                     | Fixtures SVG/raster/ZIP e decisão de cancelamento/resultado parcial.                                                                                                                                                                                |
| Critérios de conclusão             | Cliques rápidos produzem um trabalho; opções e nome do arquivo correspondem; cancelamento libera UI e memória; PNG/WebP/ZIP íntegros; falha parcial informa IDs afetados.                                                                           |
| Riscos e controle                  | Cancelar pode perder itens já convertidos; definir se resultado parcial é baixado e garantir finally. Validar o caso em PR e manter reversão isolada.                                                                                               |

### R19 → M21 — Formalizar métodos, CORS e esquema da API

| Campo                              | Plano executável                                                                                                                                                                                                                                                                 |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                                                                         |
| Descrição e objetivo               | Documentar primeiro contratos existentes e diferenças dos manifestos; decidir política GET/HEAD/OPTIONS e CORS conforme consumidores reais; implementar Allow/405 e HEAD sem corpo nos adaptadores com testes. Não mudar metadados legados nem liberar credenciais via wildcard. |
| Dependências técnicas              | M03, M04, M09                                                                                                                                                                                                                                                                    |
| Módulos afetados                   | `lib/icons.mjs`, `api/`, `index.js`, futura especificação de API                                                                                                                                                                                                                 |
| Pré-requisitos                     | Identificar consumidores e aprovar métodos/CORS sem quebrar embeds.                                                                                                                                                                                                              |
| Critérios de conclusão             | Contrato reproduzível para duas hospedagens; campos legados preservados; browser same-origin e img externo funcionam; fetch cross-origin atende política aprovada; métodos inválidos têm resposta definida.                                                                      |
| Riscos e controle                  | Restrição de métodos ou mudança de campos pode quebrar consumidor desconhecido; exigir janela de compatibilidade. Validar o caso em PR e manter reversão isolada.                                                                                                                |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 5 — UX/UI e acessibilidade

### R20 → M15 — Sincronizar filtros, foco e semântica acessível

| Campo                              | Plano executável                                                                                                                                                                                                                                                                                     |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                                                                              |
| Descrição e objetivo               | Derivar aria-pressed do estado no primeiro render; ajustar ativo a cada mudança de lista e preservar foco ao trocar tema; decidir entre botões de seleção simples ou tabs completos com painel/aria-controls e setas. Revisar isolamento de fundo com inert em overlays e testar com leitor de tela. |
| Dependências técnicas              | M06, M09                                                                                                                                                                                                                                                                                             |
| Módulos afetados                   | `site/js/builder.js`, `site/js/site.js`, `site/pages/index.html`, CSS                                                                                                                                                                                                                                |
| Pré-requisitos                     | Fluxos de teclado descritos e apoio de revisão acessível manual.                                                                                                                                                                                                                                     |
| Critérios de conclusão             | Filtro marcado coincide com lista após reload; toda lista não vazia tem um tabindex=0; teclado percorre/seleciona/sai da grade; sem violações graves no scanner e aprovação manual de foco e leitura.                                                                                                |
| Riscos e controle                  | Captura de foco agressiva pode interromper digitação; inert precisa ser revertido sempre. Validar o caso em PR e manter reversão isolada.                                                                                                                                                            |

### R21 → M16 — Oferecer recuperação de falha no frontend

| Campo                              | Plano executável                                                                                                                                                                                                                       |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                               |
| Descrição e objetivo               | Estados loading/empty/error/retry por seção com mensagens acionáveis; verificar status antes de copiar SVG; tratamento de erro do preview; manter conteúdo editorial acessível sem JS e explicar dependência do montador com noscript. |
| Dependências técnicas              | M09, M13, M15                                                                                                                                                                                                                          |
| Módulos afetados                   | `site/js/site.js`, `site/js/dados.js`, `site/js/marca.js`, `site/js/builder.js`, `site/pages/index.html`                                                                                                                               |
| Pré-requisitos                     | Simulação de rede indisponível e mensagens revisadas em português.                                                                                                                                                                     |
| Critérios de conclusão             | Bloquear manifest e depois restaurar rede permite retomar sem reload; 404 de marca não copia HTML; preview com falha informa problema; JS desabilitado recebe orientação clara.                                                        |
| Riscos e controle                  | Retry concorrente e mensagens duplicadas entre módulos. Validar o caso em PR e manter reversão isolada.                                                                                                                                |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 6 — Atualizações tecnológicas

### R22 → M18 — Fixar toolchain e validar runtimes suportados

| Campo                              | Plano executável                                                                                                                                                                                                                                                                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / média / média                                                                                                                                                                                                                                                                  |
| Descrição e objetivo               | Escolher Node LTS suportado pelas duas hospedagens (candidato Node 24, já ensaiado localmente), registrar engines e versão do gerenciador, alinhar CI/hosting/local. Revisar compatibility_date do Worker separadamente; atualizar ferramentas em PR próprio com release notes e dry-run. |
| Dependências técnicas              | M08, M09                                                                                                                                                                                                                                                                                  |
| Módulos afetados                   | `package.json`, `yarn.lock`, workflow, `wrangler.toml`, README/DEPLOY                                                                                                                                                                                                                     |
| Pré-requisitos                     | Runtime suportado nas contas confirmado; gerenciador escolhido.                                                                                                                                                                                                                           |
| Critérios de conclusão             | Instalação congelada em checkout limpo produz mesmo lock; matriz do runtime escolhido passa; nenhum comando anunciado depende de APIs ausentes; runtime real de preview confirmado.                                                                                                       |
| Riscos e controle                  | Node escolhido pode não estar configurado na conta de hospedagem; major do Wrangler pode mudar bundle. Validar o caso em PR e manter reversão isolada.                                                                                                                                    |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 7 — Testes e validação

### R23 → M19 — Tornar validações obrigatórias e reproduzíveis

| Campo                              | Plano executável                                                                                                                                                                                                                                                                                |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                                                                         |
| Descrição e objetivo               | Introduzir validação em PR com permissões mínimas, actionlint, install congelado, formato, testes, checks de dados e build; fixar browser runner e falhar quando esperado estiver ausente. Configurar checks obrigatórios na branch com responsável humano; fixar actions por SHA após revisão. |
| Dependências técnicas              | M01, M09, M11, M18                                                                                                                                                                                                                                                                              |
| Módulos afetados                   | workflow, `scripts/responsivo.mjs`, `package.json`, configuração GitHub                                                                                                                                                                                                                         |
| Pré-requisitos                     | Permissão de configurar branch checks e browser disponível no CI.                                                                                                                                                                                                                               |
| Critérios de conclusão             | PR inválido é bloqueado antes de merge; runner ausente falha no job obrigatório; nenhuma publicação em PR; 180 combinações e fluxos essenciais têm evidência anexada.                                                                                                                           |
| Riscos e controle                  | PRs de forks não têm secrets; testes não devem depender deles nem publicar código externo. Validar o caso em PR e manter reversão isolada.                                                                                                                                                      |

### R24 → M26 — Validar release completa e ensaiar rollback

| Campo                              | Plano executável                                                                                                                                                                                                                                                    |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / alta / média                                                                                                                                                                                                                                             |
| Descrição e objetivo               | Executar matriz API + site + exportação em preview Vercel e Worker conforme suporte decidido; validar compressão/cache/rotas/limites com navegador e smoke HTTP; comparar release anterior; ensaiar promoção da versão anterior e restauração de estado compatível. |
| Dependências técnicas              | M12, M14, M15, M16, M17, M18, M19, M21, M22, M24                                                                                                                                                                                                                    |
| Módulos afetados                   | testes E2E, workflow, documentação de operação, configurações dos provedores                                                                                                                                                                                        |
| Pré-requisitos                     | Previews acessíveis, credenciais em cofre da plataforma e responsável por promoção/rollback.                                                                                                                                                                        |
| Critérios de conclusão             | Matriz assinada com evidências; regressões de alta prioridade fechadas; release reproduzível; rollback mantém URLs antigas e estado local legível; smoke após promoção e reversão passa.                                                                            |
| Riscos e controle                  | Workers não serve site hoje; não exigir paridade do frontend inexistente. Staging precisa de acesso real autorizado. Validar o caso em PR e manter reversão isolada.                                                                                                |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Fase 8 — Evolução futura

### R25 → M20 — Compartilhar e reorganizar seleções

| Campo                              | Plano executável                                                                                                                                                                                             |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Status / prioridade / complexidade | Proposta / baixa / média                                                                                                                                                                                     |
| Descrição e objetivo               | Adicionar reordenação por botões acessíveis e importar/exportar seleção com esquema versionado; opcionalmente estado em fragmento de URL com validação, limites e nenhum HTML. Não exigir conta nem backend. |
| Dependências técnicas              | M02, M04, M06, M15, M26                                                                                                                                                                                      |
| Módulos afetados                   | `site/js/builder.js`, `site/js/store.js`, página principal                                                                                                                                                   |
| Pré-requisitos                     | Validação de demanda e formato de coleção acordados; entrada remota tratada como não confiável.                                                                                                              |
| Critérios de conclusão             | Export/import preserva ordem e tema; IDs inválidos têm feedback; teclado reordena; estado em link não executa código nem excede teto; cancelar importação conserva estado anterior.                          |
| Riscos e controle                  | Estado compartilhado passa a ser entrada remota; prevenir XSS, URLs excessivas e substituição inesperada da seleção. Validar o caso em PR e manter reversão isolada.                                         |

### R26 → M23 — Planejar distribuição de assets conforme escala medida

| Campo                              | Plano executável                                                                                                                                                                                                                             |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status / prioridade / complexidade | Proposta / baixa / alta                                                                                                                                                                                                                      |
| Descrição e objetivo               | Manter arquitetura atual até M25 provar limiar. Comparar módulo leve de metadados, bundles separados e armazenamento/CDN versionado; desenhar ADR com custo, disponibilidade, direitos e fallback. Não introduzir bucket/DB por antecipação. |
| Dependências técnicas              | M10, M12, M25, M26                                                                                                                                                                                                                           |
| Módulos afetados                   | `lib/`, build, `api/`, `wrangler.toml`, eventual infraestrutura                                                                                                                                                                              |
| Pré-requisitos                     | Limites do plano e custos oficiais atualizados; necessidade sustentada por métricas.                                                                                                                                                         |
| Critérios de conclusão             | ADR com limites oficiais e plano contratado, métricas de cold/warm start e custo; piloto preserva API e all; rollback comprovado; só implementar opção se ganho justificar custo operacional.                                                |
| Riscos e controle                  | Dependência de rede no render pode piorar latência e disponibilidade; migração exige cache e rollback. Validar o caso em PR e manter reversão isolada.                                                                                       |

Gate desta fase: atender os critérios de cada tarefa acima, repetir os checks afetados e registrar evidências e riscos residuais na revisão. Não promover itens incompletos por passagem de tempo.

## Plano transversal de testes

- **Desde a fase 1:** cada correção deve primeiro reproduzir a falha e depois demonstrar sua eliminação, incluindo regressão da funcionalidade válida. Manter `/icons`, aliases e `all` durante todas as fases.
- **Fase 2:** estabelecer node:test para contratos e funções puras, testes de adaptadores e integridade do build. Completar OFL/proveniência e convenção de documentação.
- **Fase 3:** medir p50/p95, memória e bytes antes/depois; aceitar otimização somente com ganho observado. Recalibrar teto M04 e definir critério de decisão M23.
- **Fases 4/5:** validar assinaturas/dimensões de PNG/WebP, CRC e conteúdo de ZIP, falhas parciais, reentrada, teclado, foco, restauração e rede indisponível.
- **Fases 6/7:** reproduzir instalação e build em checkout limpo, testar nas hospedagens suportadas, executar browser em 180 combinações e expandir para estados interativos; scanner de acessibilidade mais revisão manual. Ensaio de rollback obrigatório antes da promoção.
- **Fase 8:** qualquer estado compartilhado passa por validação de entrada e limites; infraestrutura nova exige ADR e piloto. Critérios completos na seção 15 do diagnóstico.

## Branches, versionamento e entregas

Usar uma branch curta por Rxx/Mxx e um PR revisável por mudança, com reprodução, resultado, critérios de aceite e rollback no corpo da revisão. Nunca combinar atualização ampla de toolchain com alteração visual ou de contrato. Rebase/merge da main atual antes de validar o preview final. Sem demanda explícita, não remover APIs, temas, aliases ou páginas.

Correções internas candidatas a patch; funcionalidades aditivas a minor; quebras exigem anúncio e estratégia compatível. O projeto não documenta ainda política de release formal. Registrar decisão e versão em cada entrega, atualizando README, catálogo gerado quando pertinente e `site/changelog.json` para mudanças visíveis. Publicação é uma etapa posterior à revisão do resultado concreto.

## Rollback por classe de mudança

| Mudança              | Preparação                                           | Como recuperar e validar                                                                                       |
| -------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Código/API           | Deployment anterior, fixtures e commit identificados | Promover versão anterior ou reverter PR; validar 1/15/all, aliases, tema e erros                               |
| Assets/cache         | Manter versões antigas e mapa de fingerprints        | Reverter HTML/manifest em conjunto; aplicar purge apenas quando necessário; verificar URLs antigas             |
| Storage frontend     | Leitura compatível e esquema versionado              | Voltar frontend sem apagar seleções válidas; verificar restore com valores antigos/novos                       |
| Dependências/runtime | Lock anterior e runtime anterior suportado           | Reverter manifesto/lock juntos; build limpo e dry-run; não sobrescrever lock manualmente                       |
| CI/deploy            | Validar job sem publicação em primeiro lugar         | Reverter workflow isoladamente; preservar checks essenciais e não expor secrets                                |
| Banco de dados       | Não existe nesta base                                | Nenhuma migration prevista; se introduzido no futuro, exigir plano próprio de backup/restore e expand/contract |

## Critérios para avançar ou interromper promoção

Avançar quando aceite verificável, testes afetados, revisão, documentação e reversão estiverem completos. Interromper promoção se aparecer erro de alta prioridade, violação do contrato existente, inconsistência de assets, dado local perdido ou risco operacional sem responsável. Continuar trabalhos independentes que não agravem o problema. Atualizar os documentos ao final de cada tarefa com commit, evidências, pendências e decisão; não marcar como concluída por existir apenas código.

## Pendências humanas para execução

Confirmar hosting/plano/domínio e suporte Worker; acesso a previews e política de promoção; consumidores/compatibilidade para limites e métodos; gerenciador/runtime suportados; branch checks e responsáveis por alertas; licença/proveniência dos binários; aceitação de UX com teclado/leitor de tela; demanda por coleções. Essas decisões não bloqueiam o diagnóstico nem as correções locais já especificadas.
