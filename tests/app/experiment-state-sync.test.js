// @vitest-environment node

import {
  describe,
  expect,
  it
} from "vitest";

import * as stateModule
  from "../../src/app/state.js";

describe("syncExperimentState", () => {
  it("maps engine timing and phase state into the app experiment state", () => {
    const state =
      stateModule.createState();

    const engineState = {
      active: true,
      protocol: {
        phaseName: "Baseline",
        phaseType: "baseline",
        cycle: 1,
        phaseElapsedSeconds: 4,
        phaseRemainingSeconds: 26,
        nextPhaseName: "Task",
        totalDurationSeconds: 90,
        completed: false
      },
      protocolClock: {
        protocolSeconds: 4,
        sessionSeconds: 4
      }
    };

    const preparedSetup = {
      protocol: {
        repeatCount: 2
      }
    };

    stateModule.syncExperimentState?.(
      state,
      engineState,
      preparedSetup
    );

    expect(state.experiment).toMatchObject({
      sessionSeconds: 4,
      protocolSeconds: 4,
      phaseName: "Baseline",
      phaseType: "baseline",
      phaseElapsedSeconds: 4,
      phaseRemainingSeconds: 26,
      cycle: 1,
      totalCycles: 2,
      nextPhaseName: "Task"
    });
  });
});
