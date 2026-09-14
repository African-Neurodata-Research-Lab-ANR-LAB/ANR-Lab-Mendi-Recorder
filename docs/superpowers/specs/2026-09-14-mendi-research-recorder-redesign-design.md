# ANR Mendi Research Recorder Redesign

Date: 2026-09-14
Branch: research-recorder-redesign
Project: ANR Lab Mendi Recorder

## 1. Goal

Redesign the current Mendi recorder into a professional research-acquisition interface while preserving the existing working BLE acquisition path.

The recorder must support real experimental sessions, live technical monitoring, protocol timing, automatic and manual event markers, live optical traces, Mendi sensor temperature, raw-first data preservation, recovery, and research-ready export.

The recorder must NOT perform scientific interpretation such as HbO/HbR inference, Beer-Lambert conversion, GLM analysis, brain activation scoring, diagnosis, cognition estimation, or clinical interpretation.

Those analyses belong in the separate ANR fNIRS analysis pipeline.

---

## 2. Core Principle

The recorder is an acquisition system first.

The system must preserve raw device data faithfully and never invent values when the Mendi protocol is not validated.

If a field such as temperature, optical wavelength mapping, contact status, IMU, battery, or packet structure is not yet confirmed from physical Mendi hardware, the recorder must show:

NOT AVAILABLE

or:

UNVALIDATED

instead of guessing.

---

## 3. Research Session Setup

Before acquisition, the researcher enters:

- Participant Code
- Session Code
- Protocol Name
- Optional Notes
- IMU enabled/disabled where supported
- AutoMarker enabled/disabled
- AutoMarker interval in seconds

Participant identifiers must remain pseudonymous.

No names, phone numbers, email addresses, hospital IDs, or direct identifiers should be entered.

---

## 4. Protocol Builder

The recorder will include a visual Protocol Builder.

A protocol consists of ordered phases.

Supported phase types:

- Baseline
- Task
- Rest
- Custom

Each phase contains:

- Phase name
- Phase type
- Duration in seconds
- Optional notes
- AutoMarker enabled/disabled for that phase

Example:

Baseline — 30 s
Task 1 — 60 s
Rest — 20 s
Task 2 — 60 s

The complete sequence may optionally be repeated.

Default repeat count:

1

The researcher must be able to add, remove, and reorder phases before recording begins.

---

## 5. Automatic Phase Markers

Each timed phase automatically generates timestamped markers.

Examples:

BASELINE_START
BASELINE_END

TASK_1_START
TASK_1_END

REST_START
REST_END

TASK_2_START
TASK_2_END

Markers must use the session acquisition clock rather than browser wall-clock time whenever possible.

Phase transitions must occur automatically based on the configured duration.

---

## 6. AutoMarker

AutoMarker is separate from protocol phase markers.

The researcher enters an interval in seconds.

Example:

AutoMarker every 10 seconds

During recording the system generates:

AUTO_MARKER_001
AUTO_MARKER_002
AUTO_MARKER_003

and so on.

Each AutoMarker stores:

- onset time
- marker label
- marker type
- current phase
- cycle number where applicable

AutoMarker may be disabled globally or for selected phases.

AutoMarker must stop immediately when recording stops.

The interface must never display "AutoMarker ENABLED" unless the AutoMarker timer is actually active.

---

## 7. Manual Markers

Researchers must retain the ability to add manual markers during recording.

Manual markers must:

- use the same session clock
- appear immediately in the marker list
- appear on the live graphs
- be exported to events.tsv
- coexist with phase markers and AutoMarkers

---

## 8. Live Experiment Timeline

During recording, the interface must show:

- Current phase
- Current phase elapsed time
- Current phase remaining time
- Next phase
- Recording elapsed time
- Current cycle
- Total cycles
- AutoMarker interval
- Time until next AutoMarker

Example:

CURRENT PHASE
Task 1

Remaining
00:38

NEXT
Rest — 20 s

Recording
02:14

Cycle
1 / 1

AutoMarker
Every 10 s

---

## 9. Live Optical Visualization

The recorder must contain two synchronized live optical plots:

LEFT OPTICAL CHANNEL

RIGHT OPTICAL CHANNEL

Each graph should support validated optical signals including:

- Red / approximately 660 nm
- Infrared / approximately 805 nm
- Ambient signal where available

Ambient data should remain accessible under Advanced Signal Details rather than dominate the main display.

The two plots must:

- scroll in real time
- share the same acquisition time axis
- display synchronized event markers
- show phase boundaries
- show AutoMarkers
- show manual markers
- preserve signal gaps rather than drawing fabricated samples

No optical channel mapping may be assumed until validated against real Mendi packets.

If decoding is not validated, the recorder should show raw packet activity rather than fake optical traces.

---

## 10. Graph Event Annotations

Markers appear as vertical lines over the LEFT and RIGHT graphs.

Examples:

| BASELINE START
| BASELINE END
| TASK START
| TASK END
| AUTO
| MANUAL

Phase regions may optionally have subtle background segmentation, but the raw signal must remain clearly visible.

Graph marker timestamps must match exported event timestamps.

---

## 11. Mendi Sensor Temperature

The recorder must display live temperature only when the temperature value has been positively identified from the Mendi sensor protocol.

The initial UI label will be:

Mendi Sensor Temperature

Unit:

°C

The recorder must not call this core body temperature.

If later hardware validation confirms that the measurement represents participant skin/contact temperature, the label may be updated accordingly.

Temperature must be:

- displayed live
- timestamped
- stored during the session
- exported with telemetry
- optionally shown as a small live trend

If no validated temperature field is available, display:

NOT AVAILABLE

Do not infer temperature from unrelated bytes.

---

## 12. Device and Acquisition Status

The research dashboard must display:

- Device connection status
- Recording status
- Packet count
- Packet rate
- Recording elapsed time
- Battery where validated
- Mendi sensor temperature
- Left contact quality where validated
- Right contact quality where validated
- IMU status
- ABB1 packet count
- ABB4 packet count
- ABB5 packet count
- Unknown packet count
- Current protocol phase
- AutoMarker status

---

## 13. Professional Research Interface

The current unstyled browser-default page must be replaced with a clean research-console layout.

Main sections:

1. Header / device status
2. Session Setup
3. Protocol Builder
4. Acquisition Controls
5. Current Experiment Phase
6. Live LEFT Optical Plot
7. Live RIGHT Optical Plot
8. Sensor / Device Telemetry
9. Event Timeline
10. Advanced Signal Details
11. Recovery / Export

The design should be suitable for a neuroscience laboratory rather than a generic developer/debug page.

The interface should remain usable on a typical 13-15 inch research laptop.

---

## 14. Acquisition Controls

Primary controls:

Prepare Session
Connect Mendi
Start Recording
Stop Recording
Add Manual Marker

Control rules:

- Start Recording disabled until session is prepared and Mendi is connected.
- Stop Recording disabled when not recording.
- Protocol configuration locked while recording.
- Connecting twice must not create duplicate subscriptions.
- Starting twice must not create duplicate acquisition sessions.
- Stopping must cleanly unsubscribe notifications and stop protocol timers.

---

## 15. Raw-First Data Preservation

All received packets must be preserved with:

- received timestamp
- characteristic UUID
- raw byte payload
- packet ordering
- timing gaps

Raw packets must not be replaced by decoded values.

Decoded optical or telemetry values are additional derived fields.

Unknown packets must remain preserved.

---

## 16. Session Clock

One monotonic session clock must drive:

- raw sample timing
- phase transitions
- AutoMarkers
- manual markers
- graph x-axis
- temperature timestamps
- events.tsv timestamps

This prevents timing drift between graphs, protocol events, and exported data.

---

## 17. Export

Stopping a valid recording should produce a research-ready session package.

Target package:

FNIRS_READY.zip

Expected content:

- raw_packets.csv
- optical_samples.csv where validated
- telemetry.csv
- events.tsv
- metadata.json
- session.json
- SNIRF output only when the required data mapping is scientifically valid

events.tsv should contain at minimum:

onset
duration
trial_type
marker_type
phase
cycle
description

The recorder should never generate misleading SNIRF fields if the required optical mapping has not been validated.

---

## 18. Recovery

During recording the recorder should checkpoint session state locally.

Recovery should preserve:

- session metadata
- raw packets
- markers
- protocol phase
- phase timing
- AutoMarker state
- telemetry

After an unexpected page refresh or disconnect, the researcher should be informed that a recoverable session exists.

---

## 19. Mendi Protocol Validation

Physical Mendi validation remains mandatory for:

- ABB1 packet structure
- optical channel mapping
- left/right channel identification
- red wavelength mapping
- infrared wavelength mapping
- ambient channel mapping
- temperature source
- battery source
- contact-quality source
- ABB4 telemetry
- ABB5 diagnostics
- ABB6 behavior
- notification timing
- sampling rate
- IMU data
- disconnect/reconnect behavior

Unknown protocol behavior must never be guessed.

---

## 20. Implementation Architecture

The redesign should preserve the existing modular structure.

Existing areas to extend:

src/app/
- controller
- state
- acquisition

src/ble/
- Mendi driver
- GATT profile
- notification stream
- packet inspection

src/protocol/
- packet decoders
- optical extraction
- telemetry extraction
- temperature extraction

src/recording/
- session
- sample clock
- raw store
- marker store
- checkpoint store

src/markers/
- manual markers
- protocol phase markers
- AutoMarker scheduler

src/visualization/
- LEFT trace
- RIGHT trace
- marker overlays
- telemetry trend

src/ui/
- research dashboard
- protocol builder
- acquisition controls
- telemetry panels

src/export/
- raw CSV
- optical CSV
- telemetry CSV
- events TSV
- metadata
- session package

---

## 21. Testing Strategy

Automated tests must cover:

- protocol phase timing
- BASELINE_START / BASELINE_END
- TASK_START / TASK_END
- REST_START / REST_END
- AutoMarker interval timing
- AutoMarker stop behavior
- manual marker timing
- protocol repeats
- phase transitions
- graph marker synchronization
- session clock consistency
- recording start/stop safety
- disconnect recovery
- raw packet preservation
- temperature extraction when validated
- missing temperature behavior
- export event timing
- malformed packet handling

Hardware validation must additionally be performed using the physical Mendi device.

---

## 22. Success Criteria

The redesign is successful when a researcher can:

1. Open the recorder in Chrome or Edge.
2. Prepare a pseudonymous research session.
3. Build a timed Baseline/Task/Rest protocol.
4. Configure AutoMarker interval.
5. Connect the Mendi.
6. Start one recording.
7. See the current experimental phase and countdown.
8. See real incoming Mendi packet activity.
9. See validated LEFT and RIGHT live optical traces.
10. See phase and marker lines on those graphs.
11. See validated Mendi sensor temperature.
12. Add manual markers.
13. Stop the recording cleanly.
14. Export synchronized raw data, telemetry, and events.
15. Recover the session if interrupted.

No research value may be fabricated when the protocol is unknown.

---

## 23. Scientific Boundary

The recorder is an acquisition and technical monitoring tool.

It may display:

- raw optical intensity
- packet statistics
- device telemetry
- validated sensor temperature
- timing
- contact information
- acquisition quality indicators

It must not claim:

- neural activation
- oxygenation interpretation
- cognitive state
- attention
- stress
- diagnosis
- disease classification
- clinical conclusions

Those belong in downstream validated analysis workflows.
