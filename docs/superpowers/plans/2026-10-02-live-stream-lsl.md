# Mendi Live Streaming Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Extend the existing recorder with trustworthy live monitoring and a local LSL bridge.

**Architecture:** Keep browser acquisition and local export authoritative. Add small health, display, and bridge modules; publish raw optical/IMU values and timestamped markers through Python.

**Tech Stack:** Existing Vite/JavaScript/Vitest; Python 3.10+, websockets 14–15, pylsl 1.17+.

**Spec:** `docs/superpowers/specs/2026-10-02-live-stream-lsl.md`

## Global Constraints

- Raw device units only; HbO/HbR unavailable.
- 30/60/120 second display windows; 20,000 display sample cap.
- 5 second rate window, 2 second stale/gap threshold, 3 repeat warning threshold.
- Explicit loopback connection; no unbounded queue or sample replay.
- LSL timestamps map browser monotonic receipt time and original event onset.
- Preserve existing recording, protocol, recovery, and export behaviour.

## Review Focus

- Disconnected transport or backpressure must not block recording.
- Missing optical/IMU values must not become plausible zero measurements.
- Old frames and markers must align correctly after a pause or sparse arrivals.
- Late/reconnected markers must keep original timestamps without duplication.
- Repeated samples remain raw observations, accompanied by quality flags.

### Task 1: Live display and health

**Files:** `src/streaming/stream-health.js`, `src/visualization/live-trace-buffer.js`, `src/visualization/trace-renderer.js`, `tests/streaming/health.test.js`, `tests/streaming/traces.test.js`.

**Interfaces:** `StreamHealth.observe(optical, imu, nowMs)` returns repeat flag; `snapshot(nowMs)` returns diagnostic values. `LiveTraceBuffer.getWindow(endSeconds, windowSeconds)` returns traces. Renderer options include explicit start/end seconds and gap threshold.

- [ ] Write behavioural tests for repeats, stale arrivals, missing IMU, rolling expiration, irregular timestamps and line gaps; run and confirm failure.
- [ ] Implement diagnostics and timestamp-based plotting.
- [ ] Run focused tests and existing suite; commit.

### Task 2: Browser streaming and recorder integration

**Files:** `src/streaming/lsl-client.js`, `src/streaming/live-session.js`, `src/streaming/live-panel.js`, controller/UI/CSS, haemoglobin preview modules, JS tests.

**Interfaces:** `LslClient.connect(url)`, `begin(runId)`, `send(message)`, `end()`, `disconnect()`, `snapshot()`. `LiveSession.begin(session)`, `observe(optical, imu, receiptMs, transport)`, `flushMarkers()`, `end()`.

- [ ] Write failing tests for clock mapping, connection loss/backpressure, session resets, delayed event timestamps and Hb gate.
- [ ] Implement client and coordinator; wire to the real controller and panel.
- [ ] Run focused integration tests and suite; commit.

### Task 3: Python bridge and user guide

**Files:** `bridge/mendi_lsl.py`, `bridge/requirements.txt`, `bridge/test_mendi_lsl.py`, `bridge/smoke_lsl.py`, `bridge/README.md`, main README.

**Interfaces:** A validated v1 JSON protocol with sync/start/sample/event/stop. `BridgeSession.handle(message)` sends values to injected outlets and returns protocol responses. WebSocket handler enforces loopback origins and one active connection.

- [ ] Write failing Python tests for fixed timestamp mapping, malformed/missing data, duplicates, and actual WebSocket ingestion.
- [ ] Implement bridge, real LSL metadata/outlets, Windows setup instructions, MNE receiver and hardware acceptance procedure.
- [ ] Run unit/integration tests and actual LSL outlet/inlet smoke test; commit.

### Task 4: End-to-end verification and review

- [ ] Run full JS suite, Python suite, production build, and browser-to-LSL smoke test.
- [ ] Request an independent whole-change review and resolve material findings with regression tests.
- [ ] Prepare feature branch/draft PR; report hardware validation still outstanding.
