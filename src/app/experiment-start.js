import {
  ExperimentEngine
} from "../markers/experiment-engine.js";

import {
  buildExperimentStartConfig
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
