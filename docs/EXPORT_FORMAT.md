# ANR Mendi Recorder - Export Format

The recorder currently exports a session manifest JSON file.

Example:

```text
SES_010_manifest.json
```

## Top-Level Structure

```text
metadata
snirf
rawPacketsCsv
decodedOpticalCsv
eventsTsv
```

## metadata

Contains recorder, session, acquisition, and privacy information.

### session
Includes:
- participantCode
- sessionCode
- protocol
- autoMarker
- notes
- imuEnabled

### acquisition
Includes:
- rawPacketCount
- decodedSampleCount
- markerCount

A high decodedSampleCount does not prove sensor freshness.

## rawPacketsCsv

Columns:

```text
timestamp_ms
time_s
characteristic_uuid
bytes
```

Raw bytes are preserved for reproducibility and future protocol validation.

## decodedOpticalCsv

Current fields include:

```text
time_s
temperature_c
left_red_raw
left_ir_raw
left_ambient_raw
right_red_raw
right_ir_raw
right_ambient_raw
pulse_red_raw
pulse_ir_raw
pulse_ambient_raw
acc_x
acc_y
acc_z
gyro_x
gyro_y
gyro_z
```

These are raw decoded device values, not HbO/HbR.

## eventsTsv

Fields include:

```text
onset
protocol_time
duration
trial_type
marker_type
phase
cycle
description
source
```

Typical descriptions include:

```text
START_RECORDING
BASELINE_START
BASELINE_END
TASK_START
TASK_END
SESSION_END
STOP_RECORDING
```

## SNIRF

SNIRF export is currently disabled until required scientific metadata and validated optical mappings are available.

The recorder must not invent missing metadata to force a SNIRF file.

## Freshness Warning

Repeated identical ABB1 values can occur even while decoded-frame count rises.

For scientific recordings verify:
- optical values respond to optical-contact changes
- IMU values respond to Mendi movement

Repeated cached frames are not a biological time series.

## Current Appropriate Uses

The export is currently appropriate for:
- BLE/protocol validation
- field-mapping validation
- event-timing validation
- acquisition software development

It is not yet a validated HbO/HbR analysis export.
