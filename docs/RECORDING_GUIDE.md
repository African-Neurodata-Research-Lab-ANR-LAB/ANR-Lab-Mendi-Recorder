# ANR Mendi Recorder - Research Recording Guide

This guide describes the recommended workflow for a browser-based Mendi research recording.

> Research acquisition only. This is not a clinical procedure.

## Before the Session

1. Charge the Mendi.
2. Confirm Bluetooth is enabled.
3. Use Chrome or Edge.
4. Prepare pseudonymous participant/session codes.
5. Confirm the study protocol and secure storage location.

## Step 1 - Open the Recorder

Hosted recorder:

https://african-neurodata-research-lab-anr-lab.github.io/ANR-Lab-Mendi-Recorder/

Local development:

```bash
npm run dev
```

## Step 2 - Enter Session Information

Enter Participant Code, Session Code, and optional notes.

Use pseudonymous codes only.

## Step 3 - Build the Protocol

Each phase has:
- name
- type
- duration
- optional AutoMarker

Supported phase types:
- Baseline
- Get Ready
- Task
- Rest
- Custom

Example:

```text
Baseline  30 s
Task      60 s
Rest      30 s
Repeat    3
```

## Step 4 - Prepare Session

Click **Prepare Session** and verify:
- codes
- phase order
- durations
- repeat count
- AutoMarker settings
- IMU preference

## Step 5 - Connect the Mendi

Click **Connect Mendi** and choose the correct device.

Expected:
- connected status
- validated service discovery
- ABB1-ABB6 present on the tested V4 profile

## Step 6 - Start Session

Click **Start Session**.

The recorder should start acquisition, clocks, protocol timing, and phase markers.

## Step 7 - Freshness Check

This is currently essential.

### Optical
Change sensor contact and confirm Red/IR values change.

### IMU
Move the Mendi gently and confirm accelerometer/gyroscope values change.

### Temperature
Mendi Sensor Temperature is device temperature, not body/core temperature.

If many decoded frames have exactly identical optical and IMU values, treat the stream as stale.

## Step 8 - Monitor

Watch:
- current phase
- phase countdown
- session/protocol clocks
- Decoded Frames
- Raw Packets
- acquisition mode
- left/right Red and IR/NIR
- sensor temperature
- raw IMU
- battery voltage

## Step 9 - Add Markers

Use **+ Add Marker** for researcher-defined events.

Phase boundaries are added automatically.

## Step 10 - Disconnect Recovery

If disconnected:
1. Do not reload.
2. Use Reconnect.
3. Reconnect the same device.
4. Confirm acquisition resumes.

If recovery fails, end the session and document the interruption.

## Step 11 - End Session

Click **End Session**.

Final system markers and the session export should be generated.

## Step 12 - Verify Export

Confirm:
- manifest JSON downloaded
- codes are correct
- rawPacketCount is non-zero
- decodedSampleCount is plausible
- expected phase events are present
- no direct identifiers were entered

See [EXPORT_FORMAT.md](EXPORT_FORMAT.md).

## Scientific Interpretation

Do not interpret raw Red/IR intensity as HbO/HbR.

Do not use the recorder display alone for claims about activation, cognition, disease, diagnosis, or treatment response.
