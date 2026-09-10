# Architecture · Arquitetura

[README](../README.md) · [Data contract · Contrato de dados](DATA_CONTRACT.md)

## English

The domain engine in `src/engine.js` is independent of the document, network and local storage. The same `run(input)` function powers the browser and command-line interface. Awaiting it works for every project, including the asynchronous journal hashing operation.

```text
scenario JSON → strict validation → deterministic domain engine → report
                                                           ↘ bilingual view
```

- Consent prepares a session; start begins activity. Consent is an explicit supplied event and is never inferred from silence, presence or a sensor.
- Pause stops the active clock, while consent and session wall-clock deadlines continue. Resume requires an unexpired grant.
- Automatic deadlines are evaluated before actions at the same timestamp. Consent expiry has priority over the session limit, which has priority over activity completion.
- Equal-time input actions retain their array order. A start followed by consent differs from consent followed by start.
- Stopped and completed sessions are terminal. A new session requires a new scenario, so a later resume cannot undo withdrawal or stop.
- The endMs review clock advances the simulation after the final supplied event. Shorter review windows can legitimately end with an active or paused state.

### Model

```text
active time = sum of intervals whose state is active / tempo ativo = soma dos intervalos em que o estado é ativo
```

Inputs are checked before computation and are not mutated. Unknown keys are rejected at the validated scenario and nested-domain boundaries. Reports contain no wall-clock creation timestamp, so the same input produces identical JSON under the same analysis version. UI formatting changes decimal separators without changing exported numeric values.

The browser parses imports locally, limits them to 1 MB, renders supplied text through escaping, and discards stale asynchronous results using a revision counter. It retains only the language preference automatically. Charts are previews; complete records remain in exports. The local development server binds to `127.0.0.1` and rejects hidden or out-of-root paths.

## Português

O mecanismo de domínio em `src/engine.js` é independente do documento, da rede e do armazenamento local. A mesma função `run(input)` atende ao navegador e à interface de linha de comando. Ela pode ser aguardada com `await` em todos os projetos, inclusive no cálculo assíncrono dos hashes do registro.

```text
cenário JSON → validação estrita → mecanismo determinístico → relatório
                                                       ↘ visualização bilíngue
```

- O consentimento prepara a sessão; o início ativa a atividade. Consentimento é um evento informado explicitamente e nunca é inferido de silêncio, presença ou sensor.
- A pausa interrompe a contagem de tempo ativo, enquanto os prazos de consentimento e duração total continuam. A retomada exige uma autorização ainda válida.
- Os prazos automáticos são avaliados antes das ações no mesmo instante. A expiração do consentimento tem prioridade sobre o limite da sessão, que tem prioridade sobre a conclusão da atividade.
- Ações de entrada no mesmo instante preservam a ordem da lista. Iniciar e depois consentir difere de consentir e depois iniciar.
- Sessões interrompidas e concluídas são terminais. Uma nova sessão exige novo cenário; uma retomada posterior não desfaz uma retirada ou interrupção.
- O relógio de revisão endMs avança a simulação após o último evento informado. Janelas menores podem terminar legitimamente com estado ativo ou pausado.

As entradas são verificadas antes do cálculo e não são alteradas. Chaves desconhecidas são rejeitadas no cenário e nas estruturas de domínio validadas. Os relatórios não incluem horário real de criação; assim, a mesma entrada produz JSON idêntico sob a mesma versão da análise. A formatação visual altera separadores decimais sem alterar os valores numéricos exportados.

O navegador lê as importações localmente, limita-as a 1 MB, escapa textos informados antes da exibição e descarta resultados assíncronos antigos com um contador de revisão. Apenas a preferência de idioma é armazenada automaticamente. Os gráficos são prévias; os registros completos permanecem na exportação. O servidor local atende em `127.0.0.1` e rejeita caminhos ocultos ou externos à pasta.

## Files · Arquivos

| Path · Caminho        | Responsibility · Responsabilidade                                                       |
| --------------------- | --------------------------------------------------------------------------------------- |
| `src/engine.js`       | Domain behavior · Comportamento de domínio                                              |
| `src/validation.js`   | Strict primitives and report contract · Validação e contrato do relatório               |
| `src/view.js`         | Project-specific chart and interpretation · Gráfico e interpretação próprios do projeto |
| `src/app.js`          | Browser workflow, imports and language · Fluxo do navegador, importações e idioma       |
| `src/ui.js`           | Escaping, formatting and downloads · Escape de texto, formatação e downloads            |
| `scripts/analyze.mjs` | Command-line adapter · Adaptador de linha de comando                                    |
| `tests/`              | Behavioral and contract checks · Verificações de comportamento e contrato               |
| `examples/`           | Synthetic inputs and expected reports · Entradas sintéticas e relatórios esperados      |
