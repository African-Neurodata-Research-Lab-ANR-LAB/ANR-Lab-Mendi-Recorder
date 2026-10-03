# Mendi live traces and local LSL integration

The user approved building four features on 2026-10-02: rolling left/right
Red/IR traces with task markers; acquisition health and movement; a local
Python bridge publishing samples and events into LSL; and a validation gate
before any HbO/HbR processing. This document records that approved scope.

## Data and display

Keep the existing Web Bluetooth driver and preserve raw recording/export.
Plot raw device units on a real session-time axis, with selectable 30, 60,
and 120 second windows. Break lines at missing values and acquisition gaps
longer than 2 seconds. Use the same x mapping for samples and markers.
Retain at most 20,000 display samples; recording storage is separate.

Observe decoded optical and IMU values with performance.now(). Show last
optical receipt age, time since sensor values changed, optical arrival rate
over 5 seconds, consecutive repeated values, and raw acceleration/gyro
change magnitude. Three consecutive repeats raise a warning; 2 seconds
without optical data raises a stale warning. These are technical heuristics,
not proof of biological freshness or optical contact quality. Missing IMU
must show unavailable, not zero movement. Reset health at session start.

## Local bridge

A browser WebSocket client connects explicitly to ws://127.0.0.1:8765.
Only loopback URLs are allowed. Python binds loopback and permits the local
Vite/preview origins. Run the recorder locally for streaming. Preserve the
standalone browser recording workflow when the bridge is disconnected.

Five request/response clock probes estimate the offset between browser
performance.now() and pylsl.local_clock(); use the lowest round-trip delay.
The offset is fixed for that connection. Samples carry browser receipt
timestamps, not unknown device acquisition timestamps. Events use the
session clock origin plus their original onset, even if sent later.

Protocol version 1 uses sync, start, sample, event, and stop messages.
Each session has a random run_id unrelated to participant identifiers.
Reject invalid message types, nonfinite timestamps, invalid channel arrays,
and non-increasing sample sequence numbers. Each connection has its own
LSL stream segment. Only one browser connection may publish at a time.

Publish four irregular-rate outlets: ANR_Mendi_Optical (four raw channels),
ANR_Mendi_IMU (six raw channels), ANR_Mendi_Quality (repeat flag, poll flag,
sequence), and ANR_Mendi_Events (one JSON string channel). Missing numeric
values become NaN; entirely missing optical samples are not published.
Do not claim a nominal device sampling frequency, wavelengths, calibrated
units, or haemoglobin measurements. LSL channel types are misc for MNE.

No unbounded network queue or automatic replay of optical samples.
Count unsent optical samples and show bridge state. Events wait in the
existing session marker store until the connection is ready; all events and
raw samples remain in the local export. Reconnect explicitly after a bridge
failure. A stalled/busy WebSocket must not stall acquisition.

## Haemoglobin boundary

Disable unvalidated preview calculations. HbO/HbR remains unavailable until
continuous acquisition, wavelength mapping, optode geometry/pathlength
assumptions, and a tested conversion pipeline are validated. This change
does not invent metadata or add Beer-Lambert coefficients.

## Verification

Test stale/repeat/missing-data transitions; irregularly spaced traces,
gaps and markers; bridge synchronization and reconnection; message validation
and timestamp mapping. Run the existing JS suite and production build,
Python unit/integration tests, and a real loopback LSL smoke test if liblsl
is available. Physical Mendi freshness still requires a headset test.
