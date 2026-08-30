# ANR Lab Mendi Recorder

Research acquisition software for Mendi fNIRS hardware.

**Recorder only.** Scientific analysis is intentionally maintained in a separate ANR Mendi Analyzer repository.

## Workflow

Mendi â†’ BLE â†’ raw capture â†’ validated decoding â†’ technical monitoring â†’ markers â†’ recovery â†’ export

## Important protocol status

The repository contains a validated Mendi V4 GATT profile, but continuous ABB1 browser streaming remains a physical-hardware validation item. Unknown protocol behavior is never guessed and undocumented control writes are disabled.

## Local development

Install Node.js, then:

```bash
npm install
npm run dev
```

Open the local Vite URL in Chrome or Edge.

Tests:

```bash
npm test -- --run
```

Build:

```bash
npm run build
```

## Privacy

Use pseudonymous participant/session codes. Do not enter direct identifiers. The recorder has no backend and does not automatically upload research data.

## Scientific boundary

The recorder preserves raw acquisition data. It does not perform motion correction, optical-density conversion, Beerâ€“Lambert conversion, HbO/HbR inference, GLM, or clinical interpretation.

## Organization

African Neurodata Research Lab (ANR Lab)
