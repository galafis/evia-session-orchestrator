# Research scope · Escopo de pesquisa

## English

A deterministic session-rehearsal engine for explicit consent, participant-controlled pauses, operator stops and bounded activity time. It helps authors examine interaction sequences before attaching any physical device.

Évia is the research context for this independently implemented public companion. This repository does not contain, depend on, or describe the Évia core implementation. Its examples, contracts and algorithms are self-contained public work.

Use a practitioner-reviewed activity plan from Inclusive Session Studio to author explicit events. Review stop and withdrawal sequences with adult collaborators using the software alone. Any future device adapter must preserve these event semantics and produce separate physical test evidence.

## Português

Um mecanismo determinístico de ensaio de sessões com consentimento explícito, pausas controladas pelo participante, interrupção pelo operador e tempo de atividade delimitado. Permite examinar sequências de interação antes de conectar qualquer dispositivo físico.

A Évia é o contexto de pesquisa deste trabalho público complementar, implementado de forma independente. O repositório não contém, não depende e não descreve a implementação do núcleo da Évia. Seus exemplos, contratos e algoritmos constituem um trabalho público autônomo.

Use um plano de atividades do Inclusive Session Studio, revisado por profissionais, para definir eventos explícitos. Revise as sequências de parada e retirada com colaboradores adultos usando apenas o software. Um futuro adaptador de dispositivo deve preservar a semântica desses eventos e produzir evidências próprias de testes físicos.

## Readiness · Estágio de desenvolvimento

| Layer · Etapa                                                     | Status · Estado                            | Evidence · Evidência                                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Domain software · Software de domínio                             | Implemented · Implementado                 | Engine, tests, examples and reports · Mecanismo, testes, exemplos e relatórios                                |
| Browser and CLI · Navegador e linha de comando                    | Implemented · Implementado                 | Same calculation in both interfaces · Mesmo cálculo nas duas interfaces                                       |
| Vendor/device adapter · Adaptador de fabricante/dispositivo       | Future, conditional · Futuro, condicionado | Requires supported interface and separate implementation · Exige interface compatível e implementação própria |
| Physical validation · Validação física                            | Planned · Planejada                        | Measured, controlled comparison protocol · Protocolo medido de comparação controlada                          |
| Participant or field study · Estudo com participantes ou em campo | Not established · Não estabelecido         | Requires separate review and evidence · Exige revisão e evidências próprias                                   |

## Boundaries · Limites

This is a software state model, not a consent-management service or a clinical protocol. It does not identify participants, interpret behavior, schedule real actuators or guarantee that a session is appropriate. Time limits are scenario choices, not validated human-interaction thresholds.

Este é um modelo de estados em software, não um serviço de gestão de consentimento nem um protocolo clínico. Não identifica participantes, interpreta comportamentos, programa atuadores reais ou garante a adequação de uma sessão. Os limites de tempo são escolhas do cenário, não parâmetros de interação humana validados.

Independent public research work. No vendor endorsement, institutional partnership, emergency-use validation, clinical efficacy or physical guidance guarantee is claimed.  
Trabalho público independente de pesquisa. Não se afirma endosso do fabricante, parceria institucional, validação para emergências, eficácia clínica ou garantia de orientação física.
