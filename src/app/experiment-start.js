import {
  ExperimentEngine
} from "../markers/experiment-engine.js";

import {
  buildExperimentStartConfig,
  syncExperimentState
} from "./state.js";

export function startPreparedExperiment({
  session,
  preparedSetup,
  setIntervalFn = globalThis.setInterval,
  clearIntervalFn = globalThis.clearInterval
}) {
  const engine = new ExperimentEngine({
    session,
    setIntervalFn,
    clearIntervalFn
  });

  engine.start(
    buildExperimentStartConfig(
      preparedSetup
    )
  );

  engine.tick();

  return engine;
}

export function completePreparedExperiment({
  experimentEngine,
  state,
  root,
  setProtocolBuilderLocked
}) {
  experimentEngine?.stop();

  state.sessionStatus =
    "completed";

  setProtocolBuilderLocked?.(
    root,
    false
  );
}

export function beginPreparedRecording({
  session,
  preparedSetup,
  state,
  root,
  setProtocolBuilderLocked,
  setIntervalFn = globalThis.setInterval,
  clearIntervalFn = globalThis.clearInterval
}) {
  session.start(
    preparedSetup
  );

  const engine =
    startPreparedExperiment({
      session,
      preparedSetup,
      setIntervalFn,
      clearIntervalFn
    });

  syncExperimentState(
    state,
    engine.getState(),
    preparedSetup
  );

  state.sessionStatus =
    "recording";

  state.recording =
    "recording";

  setProtocolBuilderLocked?.(
    root,
    true
  );

  return engine;
}

export function refreshPreparedRecording({
  experimentEngine,
  state,
  preparedSetup
}) {
  if (!experimentEngine) {
    return false;
  }

  const engineState =
    experimentEngine.getState();

  syncExperimentState(
    state,
    engineState,
    preparedSetup
  );

  return (
    engineState.protocol?.completed === true
  );
}

export function requestProtocolCompletion({
  completed,
  state,
  stopAction
}) {
  if (
    completed !== true ||
    state.recording !== "recording"
  ) {
    return false;
  }

  state.recording =
    "stopping";

  state.sessionStatus =
    "stopping";

  stopAction?.();

  return true;
}

export function pausePreparedRecordingOnDisconnect({
  experimentEngine,
  state
}) {
  experimentEngine?.pause();

  state.sessionStatus =
    "paused_disconnected";

  state.recording =
    "recording";
}

export function resumePreparedRecordingAfterReconnect({
  experimentEngine,
  state
}) {
  experimentEngine?.resume();

  state.sessionStatus =
    "recording";

  state.recording =
    "recording";
}

export function abortPreparedExperiment({
  session,
  experimentEngine,
  state,
  root,
  setProtocolBuilderLocked
}) {
  experimentEngine?.stop();

  session.addMarker(
    "PROTOCOL_ABORTED",
    "system"
  );

  session.addMarker(
    "SESSION_END",
    "system"
  );

  session.stop();

  state.sessionStatus =
    "completed";

  state.recording =
    "stopped";

  setProtocolBuilderLocked?.(
    root,
    false
  );
}
