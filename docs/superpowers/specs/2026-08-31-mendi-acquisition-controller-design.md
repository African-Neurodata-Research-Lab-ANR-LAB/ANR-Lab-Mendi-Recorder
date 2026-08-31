# Mendi Recorder Acquisition Controller Design

## Goal

Make the ANR Lab Mendi Recorder acquisition flow production-grade and predictable.

Lifecycle:

Prepare -> Connect -> Start -> Acquire -> Marker -> Stop -> Export

The recorder prioritizes acquisition integrity, explicit state transitions, raw packet preservation, safe failure recovery, and scientifically conservative handling of Mendi data.

## Scope

This milestone focuses on acquisition/session orchestration only.

It does not add:
- neural activation estimation
- cognitive-state inference
- clinical interpretation
- fabricated optical measurements
- unvalidated SNIRF metadata
- new external services

## Current Architecture

The application uses:
- Vite
- Web Bluetooth
- MendiDriver
- NotificationStream
- Session
- RawStore
- CheckpointStore
- Vitest

Current acquisition characteristics:
- ABB1
- ABB4
- ABB5

## Acquisition Layer

src/app/acquisition.js owns the multi-characteristic acquisition lifecycle.

Public interface:

startAcquisition(driver, onPacket, options = {})

Characteristics are subscribed sequentially.

If a later subscription fails:
1. Previously subscribed characteristics are unsubscribed.
2. The original error is preserved.
3. options.onFailure(error) is called when supplied.
4. The original error is rethrown.

The acquisition layer must not own UI state.

## Session Layer

src/recording/session.js owns recording state and timing.

BLE packets contain:

receivedAtMs
characteristicUuid
bytes

An explicit timestampMs must be preserved.

Otherwise:

timestampMs = packet.timestampMs ?? packet.receivedAtMs

Elapsed recording time comes from SampleClock.

Raw bytes must remain independent from the original notification buffer.

## Controller Layer

src/app/controller.js coordinates:

Prepare -> Connect -> Start -> Acquire -> Marker -> Stop -> Export

Starting a recording must:
1. Require prepared metadata.
2. Create a new Session.
3. Start the Session.
4. Set recording state.
5. Start acquisition through startAcquisition().

If acquisition fails:
1. Roll back subscriptions.
2. Return recording state to idle.
3. Store the error.
4. Stop the session safely.
5. Save a checkpoint.
6. Keep the error available to the user.

Successful acquisition remains in the conservative REVIEW quality state.

REVIEW must not be presented as physiological signal quality.

## Disconnect Handling

If the device disconnects while recording:
- connection becomes disconnected;
- DEVICE_DISCONNECTED system marker is recorded;
- current session is checkpointed;
- captured raw data is preserved.

## Stop Handling

Stopping an active recording:
- adds STOP_RECORDING;
- transitions the session to stopped;
- saves a checkpoint;
- generates the existing research manifest;
- does not fabricate SNIRF content.

## Subscription Safety

The acquisition path must prevent duplicate active subscriptions and orphaned notification handlers.

## Error Handling

Known failures continue to use RecorderError and existing error codes.

The application must prefer safe failure over pretending incomplete acquisition succeeded.

## Testing Requirements

Tests must cover:
1. Successful ABB1, ABB4 and ABB5 subscription.
2. Rollback when ABB4 fails.
3. Rollback when ABB5 fails.
4. Failure callback invocation.
5. Recording state recovery after failure.
6. Exact unsubscribe behavior.
7. Notification byte-copy independence.
8. Raw timestamp preservation.
9. receivedAtMs fallback.
10. Session start/stop lifecycle.
11. Disconnect checkpoint behavior where practical.

All existing tests must continue passing.

## Scientific/Data Integrity

The recorder is an acquisition system, not an inference system.

It must:
- preserve raw packets;
- preserve timestamps;
- preserve characteristic identity;
- avoid modifying raw bytes;
- distinguish wall-clock time from elapsed recording time;
- avoid inventing optical geometry;
- avoid inventing wavelength metadata;
- avoid inventing source-detector distances;
- avoid converting unvalidated packets into scientifically meaningful Hb measurements.

SNIRF export remains disabled until required scientific metadata and validated optical mappings exist.

## Success Criteria

Milestone 1 is complete when:
- acquisition lifecycle is centralized;
- partial subscriptions roll back safely;
- acquisition failure returns the UI/session to a safe state;
- disconnects preserve the active checkpoint;
- duplicate/orphan subscriptions are prevented;
- raw timing is explicit and tested;
- all tests pass;
- Vite production build succeeds;
- git diff --check is clean;
- implementation is committed as a clean Git checkpoint.

## Out of Scope

Later milestones:
- validated Mendi protocol reverse engineering;
- optical signal reconstruction;
- physiological HbO/HbR calculations;
- advanced live QC;
- recovery/resume UI;
- complete research-package export;
- hardware validation;
- scientific validation against reference datasets.
