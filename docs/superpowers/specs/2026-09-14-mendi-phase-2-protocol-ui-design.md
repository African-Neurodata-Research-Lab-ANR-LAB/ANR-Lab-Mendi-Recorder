# ANR Mendi Recorder Phase 2 - Protocol UI and Pausable Experiment Runtime

Date: 2026-09-14
Branch: phase-2-protocol-ui
Project: ANR Lab Mendi Recorder

## 1. Goal

Phase 2 connects the protocol timing engine created in Phase 1 to the actual ANR Mendi Recorder interface.

The phase must provide:

- a structured research Protocol Builder;
- Baseline and Task as the default protocol;
- optional Get Ready, Rest, and Custom phases;
- repeatable protocol sequences;
- configurable AutoMarker behavior;
- protocol locking once acquisition starts;
- separate visible Session and Protocol clocks;
- automatic phase transitions;
- automatic recording completion;
- manual End Session control;
- pause/resume behavior when Mendi disconnects unexpectedly;
- reconnection to the same research session;
- accurate event export across disconnect gaps.

This phase must preserve the existing working Mendi BLE acquisition and raw-first storage paths.

The recorder remains an acquisition tool. It must not perform scientific interpretation such as HbO/HbR estimation, Beer-Lambert conversion, neural activation scoring, cognition estimation, diagnosis, or clinical interpretation.

---

## 2. Scope Boundary

Phase 2 includes protocol setup, live protocol state, session lifecycle, pause/resume, and Mendi reconnection.

Phase 2 does NOT include the complete LEFT/RIGHT optical visualization redesign.

The current technical signal trace may remain available while the protocol interface is developed.

Dual validated optical plots belong to Phase 3.

Temperature decoding and other unvalidated hardware fields remain outside Phase 2 unless independently validated from physical-device evidence.

---

## 3. Default Protocol

A newly prepared session starts with two editable phases:

1. Baseline
2. Task

Get Ready is NOT inserted automatically.

Rest and Custom are also optional.

The default structure therefore is:

Baseline -> Task

Researchers may change durations before starting acquisition.

The UI may provide convenient initial duration values, but they are editable templates and must not imply a scientifically required duration.

---

## 4. Supported Phase Types

The Protocol Builder supports:

- Baseline
- Get Ready
- Task
- Rest
- Custom

Internal normalized type values:

- baseline
- get_ready
- task
- rest
- custom

Each phase contains:

- stable phase ID;
- phase name;
- phase type;
- duration in seconds;
- AutoMarker enabled/disabled.

Duration must be a finite number greater than zero.

Phase names must not be empty after normalization.

---

## 5. Get Ready Phase

Get Ready is optional.

A researcher may insert it between any phases where a preparation countdown is useful.

Example:

Baseline -> Get Ready -> Task

Get Ready duration is configurable.

Examples:

5 seconds
10 seconds
15 seconds

There is no hard-coded 10-second requirement.

During Get Ready:

- Mendi acquisition continues normally;
- raw packets continue to be recorded;
- the Session Clock continues;
- the Protocol Clock continues;
- a prominent countdown is displayed;
- GET_READY_START is emitted;
- GET_READY_END is emitted;
- AutoMarker is OFF by default for newly added Get Ready phases;
- the researcher may manually enable AutoMarker for that phase before recording begins.

---

## 6. Protocol Builder Interface

The builder uses an ordered research phase table.

Columns:

Phase Name | Type | Duration | AutoMarker | Reorder | Remove

Researchers can:

- add a phase;
- remove a phase;
- move a phase up;
- move a phase down;
- change the phase name;
- change the phase type;
- change duration;
- enable or disable AutoMarker per phase.

Additional protocol controls:

- Repeat Count;
- global AutoMarker enabled/disabled;
- AutoMarker interval in seconds.

Repeat Count defaults to 1.

AutoMarker must never be described as active unless its scheduler is actually active.

If global AutoMarker is disabled, no interval markers are emitted even if a phase-level toggle is enabled.

If global AutoMarker is enabled, only phases whose phase-level AutoMarker toggle is enabled may emit interval markers.

---

## 7. Protocol Validation

A protocol is valid only when:

- at least one phase exists;
- every phase duration is greater than zero;
- every phase type is supported;
- Repeat Count is an integer of at least 1;
- AutoMarker interval is greater than zero when global AutoMarker is enabled.

The UI must prevent Start Recording when protocol validation fails.

Validation errors must identify the affected phase or field.

---

## 8. Protocol Locking

Before recording:

- all protocol fields are editable.

Immediately when Start Recording succeeds:

- the complete protocol configuration is deep-cloned;
- the active protocol configuration becomes immutable for that session;
- phase editing controls are disabled;
- Repeat Count is disabled;
- AutoMarker configuration is disabled.

Changes to DOM input fields after recording begins must not affect the running experiment.

Protocol controls remain locked while:

- recording;
- paused because of Mendi disconnection;
- stopping.

A new editable protocol may be prepared after the active session has completed.

---

## 9. Two-Clock Architecture

Phase 2 keeps two clocks.

### 9.1 Session Clock

The Session Clock is the authoritative real elapsed experimental-session timeline.

It:

- starts when the recording session starts;
- uses a monotonic timing source;
- never pauses because of Mendi disconnection;
- continues until the session is formally ended;
- timestamps raw data and exported events.

If Mendi is disconnected for 81 seconds, that 81-second gap remains visible in Session Clock time.

### 9.2 Protocol Clock

The Protocol Clock controls experimental phase timing.

It:

- starts with the protocol;
- advances while the protocol is active;
- pauses on unexpected Mendi disconnection;
- resumes from exactly the same protocol position after reconnection;
- controls phase elapsed time;
- controls phase remaining time;
- controls AutoMarker scheduling.

The Protocol Clock does not replace the Session Clock.

---

## 10. Clock Mapping

Protocol events are scheduled in Protocol Clock time but exported against Session Clock time.

Example:

Protocol time:

Task starts at protocol 30 s.

A device disconnect occurs at protocol 53 s.

The protocol remains paused for 81 real seconds.

After reconnection, Task continues from protocol 53 s.

A later Task end scheduled for protocol 90 s must be exported at the corresponding real Session Clock time, including the 81-second interruption.

Therefore the pausable protocol clock must maintain sufficient pause history or offset information to convert:

protocol time -> session time

without losing the real disconnect interval.

Browser polling delays must not collapse multiple scheduled events onto the same incorrect timestamp.

---

## 11. Exported Event Timing

The existing `onset` field remains Session Clock seconds.

This keeps `events.tsv` aligned with the real raw acquisition timeline.

Phase 2 may additionally store `protocolTime` / `protocol_time` metadata for events where protocol timing is meaningful.

Examples:

- phase boundaries;
- AutoMarkers;
- manual markers during an active protocol;
- disconnect/reconnect events.

For system events where protocol time is not meaningful, the field may be blank.

A disconnect and reconnect may share the same protocol time because the Protocol Clock is frozen while the Session Clock continues.

Example:

DEVICE_DISCONNECTED:
session onset = 53 s
protocol time = 53 s

DEVICE_RECONNECTED:
session onset = 134 s
protocol time = 53 s

This accurately represents an 81-second hardware interruption.

---

## 12. Experiment Start

Start Recording performs the following logical sequence:

1. validate session metadata;
2. validate the protocol;
3. confirm Mendi is connected and acquisition can start;
4. create/reset the Session;
5. start the Session Clock;
6. create the immutable active protocol configuration;
7. start the Protocol Clock;
8. start the Experiment Engine;
9. start AutoMarker if configured;
10. lock protocol controls;
11. set application state to recording.

The first phase begins immediately.

For a default protocol:

0.000 s -> BASELINE_START

No separate Start Protocol button is required.

---

## 13. Live Research Dashboard

During an active session, both clocks are visible.

The dashboard displays:

- Session Clock;
- Protocol Clock;
- connection status;
- recording/session status;
- packet count;
- signal quality;
- current phase;
- current phase type;
- phase elapsed time;
- phase remaining time;
- next phase;
- current cycle;
- total cycles;
- overall protocol progress;
- AutoMarker status;
- AutoMarker interval;
- time until next AutoMarker where available;
- recent markers.

Example:

SESSION          00:04:32
PROTOCOL         00:03:51

CURRENT PHASE
TASK

Remaining        00:37
Cycle            2 / 3
Next             REST

AutoMarker       ON - every 5 s

The dashboard must use descriptive acquisition terminology and avoid scientific interpretation.

---

## 14. Session Status Model

Application state must explicitly track the lifecycle.

Supported statuses:

- idle
- prepared
- recording
- paused_disconnected
- stopping
- completed

The application must not infer the entire session lifecycle only from BLE connection state.

Connection and session status are related but separate.

For example:

connection = disconnected
sessionStatus = paused_disconnected

means a valid experiment is still active and waiting for the Mendi to return.

---

## 15. Normal Protocol Completion

When the final phase of the final cycle ends:

1. emit the final phase END marker;
2. mark the protocol completed;
3. emit SESSION_END with automatic completion reason;
4. stop AutoMarker;
5. stop Mendi acquisition;
6. stop the Protocol Clock;
7. end the Session;
8. save the final checkpoint;
9. create/export the completed session data;
10. set sessionStatus to completed.

The Mendi recording stops automatically.

The researcher does not need to press End Session after successful protocol completion.

---

## 16. Manual End Session

The researcher can press End Session at any time during:

- recording;
- paused_disconnected.

Manual termination must:

1. prevent future protocol events;
2. stop AutoMarker;
3. stop acquisition where possible;
4. stop the active protocol;
5. emit a system event identifying manual early termination;
6. emit SESSION_END;
7. checkpoint the available data;
8. export the available session;
9. set sessionStatus to completed.

Future planned phase boundaries must NOT be synthesized.

For example, pressing End Session halfway through Task must not falsely create a normal TASK_END at its planned time.

A dedicated event such as:

PROTOCOL_ABORTED

should distinguish early manual termination from normal protocol completion.

---

## 17. Unexpected Mendi Disconnection

Unexpected hardware disconnection does NOT automatically end the session.

When the active Mendi disconnects:

1. guard against duplicate disconnect handling;
2. emit DEVICE_DISCONNECTED exactly once for that disconnect episode;
3. preserve the existing Session object;
4. preserve raw packets already collected;
5. save a checkpoint;
6. pause the Protocol Clock;
7. pause phase progression;
8. pause AutoMarker progression;
9. keep the Session Clock running;
10. set sessionStatus to paused_disconnected;
11. show a clear recovery interface.

There is NO automatic session timeout.

The recorder waits indefinitely until:

- reconnection succeeds; or
- the researcher presses End Session.

---

## 18. Paused Disconnect Screen

While disconnected, the dashboard must clearly communicate that data acquisition is interrupted.

Example:

SESSION          00:05:18
PROTOCOL         00:03:51

SESSION PAUSED
Mendi disconnected

Current phase: TASK
Remaining: 00:37

Waiting for device reconnection...
No automatic timeout

Actions:

- Reconnect Mendi
- End Session

The Session Clock continues updating.

The Protocol Clock and phase countdown remain frozen.

---

## 19. Reconnection Strategy

The driver must distinguish initial connection from recovery reconnection.

### Initial connection

The researcher selects a Mendi using the Web Bluetooth device chooser.

The driver stores the authorized device reference for the active browser page/session.

### Recovery reconnection

After an unexpected disconnect, the recorder must first attempt to reuse the same stored device.

It should use the existing authorized device reference and reconnect through the device GATT server where supported.

The recorder must NOT automatically reopen the Bluetooth chooser repeatedly.

After reconnection it must:

- reconnect GATT;
- rediscover required characteristics if necessary;
- restore notification subscriptions;
- prevent duplicate notification subscriptions;
- preserve the existing Session object;
- preserve packet count;
- preserve event history;
- preserve trace history where appropriate;
- preserve the active protocol;
- preserve the current phase/cycle;
- preserve AutoMarker scheduling state.

A manual Reconnect Mendi control must remain available.

If the stored device can no longer be reused, the researcher may explicitly initiate a new device-selection action.

---

## 20. Reconnect Failure

A failed reconnect attempt does not terminate the session.

On failure:

- sessionStatus remains paused_disconnected;
- Session Clock continues;
- Protocol Clock remains paused;
- AutoMarker remains paused;
- existing recorded data remains preserved;
- the UI reports the reconnect error;
- the researcher may retry;
- the researcher may End Session.

Failed browser retry attempts are operational errors, not experimental events.

They should not each be added to `events.tsv`.

---

## 21. Successful Reconnection

On successful reconnection:

1. restore BLE notification acquisition;
2. emit DEVICE_RECONNECTED exactly once;
3. resume the Protocol Clock;
4. resume phase countdown from the exact paused value;
5. resume AutoMarker from protocol time;
6. set sessionStatus to recording;
7. continue storing packets in the same Session.

Baseline or Task must NOT restart.

A new Session must NOT be created.

Example:

Task remaining before disconnect: 37 s

After reconnection:

Task remaining: 37 s

---

## 22. AutoMarker Across Disconnection

AutoMarker is driven by Protocol Clock time.

Therefore AutoMarkers are not generated for time that passed only on the Session Clock while the protocol was paused.

Example:

AutoMarker interval = 5 protocol seconds

Device disconnects with 2 protocol seconds remaining until the next AutoMarker.

The device remains disconnected for 60 real seconds.

After reconnect:

the next AutoMarker still occurs after 2 additional protocol seconds.

No backlog of twelve AutoMarkers is emitted for the 60-second hardware outage.

---

## 23. Phase Boundaries Across Disconnection

A phase must not finish while the protocol is paused.

Example:

Task has 37 seconds remaining when disconnection occurs.

After an 81-second outage:

Task still has 37 seconds remaining.

The eventual TASK_END event is placed on the Session Clock at the real session time when those remaining 37 protocol seconds have actually elapsed after reconnection.

---

## 24. Manual Markers

Manual markers remain available during an active session.

They use Session Clock onset.

When a protocol is active, they may additionally store the current Protocol Clock time and phase context.

Manual markers may also be added while sessionStatus is paused_disconnected if the researcher needs to annotate an experimental observation.

Such a marker records:

- current Session Clock onset;
- frozen Protocol Clock time;
- current phase;
- source = manual.

---

## 25. Checkpointing

Checkpoint saves must occur at minimum when:

- session is prepared where appropriate;
- recording starts;
- significant marker events occur;
- packets are being collected according to the existing checkpoint policy;
- device disconnects;
- device reconnects;
- session ends;
- protocol completes.

Checkpoint data must preserve enough Phase 2 state to avoid losing experiment context during a same-page disconnect/reconnect episode.

This includes:

- session snapshot;
- active protocol configuration;
- sessionStatus;
- protocol elapsed state;
- pause state;
- accumulated pause information needed for clock mapping;
- active phase;
- current cycle;
- AutoMarker scheduler state where serializable.

The Web Bluetooth device object itself is not serialized into checkpoint storage.

Full continuation after a browser refresh or browser crash is not a required Phase 2 acceptance criterion.

Same-page Mendi power-off/disconnect/reconnect recovery IS required.

---

## 26. Existing Acquisition Preservation

Phase 2 must preserve the existing working BLE path.

Existing validated behavior includes:

- connection through the known Mendi service;
- notification subscription;
- raw packet storage;
- packet inspection;
- ABB characteristic monitoring;
- checkpoint saving;
- current technical trace behavior;
- raw export.

Protocol work must not introduce undocumented Mendi control writes.

No new hardware byte interpretation may be guessed during this phase.

---

## 27. Controller Structure

The existing application controller is already responsible for many concerns.

Phase 2 should avoid placing the entire new protocol feature directly inside one larger controller file.

Responsibilities should be separated into focused modules such as:

- protocol builder model/UI;
- pausable protocol clock;
- session lifecycle coordinator;
- protocol dashboard renderer;
- reconnect coordinator;
- existing ExperimentEngine.

The exact filenames may change during implementation planning, but responsibilities must remain independently testable.

---

## 28. Error Handling

Errors must fail safely.

Protocol validation failure:
- recording does not start;
- user receives a specific validation message.

Initial BLE connection failure:
- session does not enter recording state.

Disconnect:
- active session pauses rather than ends.

Reconnect failure:
- session remains paused.

Acquisition stop failure:
- session data is still checkpointed and the lifecycle is completed as safely as possible.

Export failure:
- recorded in-memory/checkpointed data must not be discarded.

No error path may silently reset an active research Session.

---

## 29. UI Terminology

Primary controls:

- Prepare Session
- Connect Mendi
- Start Recording
- Add Marker
- End Session
- Reconnect Mendi

Use "End Session" for intentional termination during an active experiment.

Avoid ambiguous language implying that an unexpected Bluetooth disconnect equals session completion.

---

## 30. Testing Requirements

Implementation follows test-driven development.

### Protocol Clock

Tests must verify:

- normal advancement;
- pause freezes protocol time;
- Session Clock continues independently;
- resume excludes disconnected duration;
- multiple pause/resume cycles remain accurate;
- protocol-to-session timestamp mapping remains correct.

### Protocol Builder

Tests must verify:

- default Baseline -> Task structure;
- add Get Ready;
- add Rest;
- add Custom;
- remove phase;
- reorder phases;
- positive duration validation;
- Repeat Count validation;
- AutoMarker interval validation;
- Get Ready AutoMarker default OFF;
- phase AutoMarker toggling;
- protocol locking during an active session.

### Experiment Lifecycle

Tests must verify:

- Start Recording starts both clocks;
- first phase starts immediately;
- final protocol completion ends acquisition automatically;
- manual End Session terminates early;
- early termination does not fabricate future phase END markers;
- disconnect pauses protocol;
- disconnect does not stop Session Clock;
- reconnect resumes exact phase position;
- no AutoMarkers occur during paused protocol time;
- no automatic disconnect timeout.

### Reconnection

Tests must verify:

- same authorized device reference is attempted first;
- notification subscriptions are restored;
- duplicate subscriptions are prevented;
- same Session object is preserved;
- DEVICE_DISCONNECTED is emitted once;
- DEVICE_RECONNECTED is emitted once;
- failed reconnect leaves session paused;
- retry remains possible.

### Export

Tests must verify:

- event onset remains Session Clock time;
- protocol time is preserved where required;
- disconnect/reconnect gap is visible;
- phase markers remain chronologically ordered;
- AutoMarker scheduling remains correct across pauses;
- manual termination is distinguishable from normal completion.

### Regression

The complete existing project test suite must remain green.

The production Vite build must succeed.

---

## 31. Physical Hardware Validation

Automated tests are necessary but not sufficient.

Phase 2 requires a physical Mendi validation session.

Suggested validation protocol:

Baseline 30 s
Get Ready 10 s
Task 60 s
Rest 20 s
Repeat x2
AutoMarker every 5 s

Validation must confirm:

1. protocol table is editable before acquisition;
2. protocol locks when recording starts;
3. first phase starts immediately;
4. Session Clock and Protocol Clock are both visible;
5. each phase changes at the correct time;
6. Get Ready countdown behaves correctly;
7. AutoMarkers occur only in enabled phases;
8. normal final-phase completion automatically stops acquisition;
9. End Session stops acquisition early;
10. powering off/disconnecting Mendi pauses protocol time;
11. Session Clock continues during the outage;
12. no AutoMarkers are emitted for paused protocol time;
13. reconnecting the Mendi resumes the exact phase position;
14. packet acquisition resumes into the same session;
15. DEVICE_DISCONNECTED and DEVICE_RECONNECTED appear in exported events;
16. the real outage duration remains visible on the Session Clock;
17. events.tsv timing remains chronologically and scientifically coherent.

---

## 32. Phase 2 Completion Criteria

Phase 2 is complete only when:

- the Protocol Builder is functional;
- Baseline -> Task is the default structure;
- optional Get Ready, Rest, and Custom phases work;
- protocol locking works;
- two-clock timing works;
- the live phase dashboard works;
- normal completion automatically stops acquisition;
- manual End Session works;
- unexpected disconnection pauses rather than ends the protocol;
- there is no disconnect timeout;
- same-session reconnection works on physical Mendi hardware;
- exact protocol position is preserved across disconnection;
- checkpoints preserve session data;
- exported events accurately represent real Session Clock time;
- all automated tests pass;
- production build succeeds.

---

## 33. Deferred Work

The following are intentionally deferred to later phases:

- full LEFT/RIGHT validated optical plot redesign;
- validated Mendi temperature extraction;
- unconfirmed battery/contact/IMU decoding;
- HbO/HbR conversion;
- Beer-Lambert processing;
- GLM/statistical analysis;
- neural activation interpretation;
- clinical/cognitive interpretation;
- browser-refresh/crash continuation of an actively running protocol.

These exclusions keep Phase 2 focused on reliable experimental control and acquisition lifecycle behavior.
