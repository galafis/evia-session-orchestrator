# Worked examples · Exemplos comentados

[README](../README.md)

**English:** These are executable synthetic scenarios. Each command recomputes the committed report. Change one field at a time, retain the source file and inspect unfavorable findings as well as headline metrics.

**Português:** Estes são cenários sintéticos executáveis. Cada comando recalcula o relatório versionado. Altere um campo por vez, preserve a entrada e inspecione achados desfavoráveis junto das métricas principais.

## Pause and resume · Pausa e retomada

```sh
node scripts/analyze.mjs examples/nominal.json report.json
```

[Scenario / Cenário](../examples/nominal.json) · [Expected report / Relatório esperado](../examples/nominal.report.json) · `complete`

| Metric · Métrica                    | Expected · Esperado |
| ----------------------------------- | ------------------- |
| Active time / Tempo ativo           | 8000 ms             |
| Accepted actions / Ações aceitas    | 5                   |
| Rejected actions / Ações rejeitadas | 0                   |
| Final state / Estado final          | completed           |

## Consent expires · Consentimento expirado

```sh
node scripts/analyze.mjs examples/consent-expiry.json report.json
```

[Scenario / Cenário](../examples/consent-expiry.json) · [Expected report / Relatório esperado](../examples/consent-expiry.report.json) · `review-notes`

| Metric · Métrica                    | Expected · Esperado |
| ----------------------------------- | ------------------- |
| Active time / Tempo ativo           | 3000 ms             |
| Accepted actions / Ações aceitas    | 4                   |
| Rejected actions / Ações rejeitadas | 1                   |
| Final state / Estado final          | stopped             |

- `CONSENT_EXPIRED`: Consent expired on the virtual clock. / O consentimento expirou no relógio virtual.
- `INVALID_TRANSITION`: Rejected resume in stopped. / Ação resume rejeitada no estado stopped.

## Operator stop · Parada solicitada

```sh
node scripts/analyze.mjs examples/operator-stop.json report.json
```

[Scenario / Cenário](../examples/operator-stop.json) · [Expected report / Relatório esperado](../examples/operator-stop.report.json) · `review-notes`

| Metric · Métrica                    | Expected · Esperado |
| ----------------------------------- | ------------------- |
| Active time / Tempo ativo           | 2500 ms             |
| Accepted actions / Ações aceitas    | 3                   |
| Rejected actions / Ações rejeitadas | 1                   |
| Final state / Estado final          | stopped             |

- `INVALID_TRANSITION`: Rejected resume in stopped. / Ação resume rejeitada no estado stopped.
