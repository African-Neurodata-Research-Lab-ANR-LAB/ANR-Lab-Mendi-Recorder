# ANR Mendi Recorder - Validation Status

This document separates validated, provisional, and unavailable behavior.

## Status Matrix

| Component | Status | Notes |
| --- | --- | --- |
| Web Bluetooth chooser | Validated | Physical Mendi can be selected |
| GATT connection | Validated | Connection succeeds on tested device |
| ABB1-ABB6 discovery | Validated | All six characteristics observed |
| Raw packet capture | Validated | Timestamped packets stored |
| ABB1 decoder | Validated | Known V4 fields decode correctly |
| ABB4 battery voltage | Validated | Battery millivolts decoded |
| Sensor temperature | Validated decoding | Device sensor temperature only |
| Raw Red/IR/Ambient | Validated decoding | Device units only |
| Raw IMU | Validated decoding | Raw accelerometer/gyroscope values |
| Protocol phase engine | Validated | Phase events export correctly |
| Marker display encoding | Validated | ASCII separator avoids mojibake |
| Continuous fresh ABB1 stream | Unresolved | Current fallback can repeat cached frame |
| Live biological optical time series | Blocked | Freshness must be solved first |
| Calibrated IMU units | Not implemented | Raw values only |
| Optical density | Not implemented | Scientific pipeline boundary |
| HbO/HbR | Not implemented | Requires validated conversion |
| Motion correction | Not implemented | Analysis-stage method |
| SNIRF export | Disabled | Required metadata not yet validated |
| Brain activation inference | Not supported | Outside recorder scope |
| Clinical interpretation | Not supported | Outside recorder scope |

## Highest-Priority Hardware Milestone

```text
Move Mendi -> raw IMU changes
Change optical contact -> raw Red/IR changes
Leave session running -> fresh ABB1 values continue arriving
```

Only after this should scientific optical-density or haemoglobin conversion work begin.

## Guardrails

1. Do not rename raw Red/IR values as HbO/HbR.
2. Do not infer activation from raw intensity.
3. Do not call sensor temperature body temperature.
4. Do not invent wavelength/pathlength/extinction metadata.
5. Preserve raw BLE packets.
6. Keep acquisition validation separate from analysis.
