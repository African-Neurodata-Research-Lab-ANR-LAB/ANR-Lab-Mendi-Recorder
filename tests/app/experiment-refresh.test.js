// @vitest-environment node

import {
  describe,
  expect,
  it
} from "vitest";

import {
  createState
} from "../../src/app/state.js";

import * as lifecycle
  from "../../src/app/experiment-start.js";

describe("refreshPreparedRecording", () => {
  it("refreshes experiment timing and reports protocol completion", () => {
    const state = createState();

    const preparedSetup = {
      protocol: {
        repeatCount: 1
      }
    };

    const experimentEngine = {
      getState() {
        return {
          active: true,
          protocol: {
            phaseName: "Task",
            phaseType: "task",
            cycle: 1,
            phaseElapsedSeconds: 12,
            phaseRemainingSeconds: 48,
            nextPhaseName: null,
            totalDurationSeconds: 60,
            completed: false
          },
          protocolClock: {
            protocolSeconds: 12,
            sessionSeconds: 12
          }
        };
      }
    };

    const completed =
      lifecycle.refreshPreparedRecording?.({
        experimentEngine,
        state,
        preparedSetup
      });

    expect(state.experiment).toMatchObject({
      sessionSeconds: 12,
      protocolSeconds: 12,
      phaseName: "Task",
      phaseRemainingSeconds: 48,
      cycle: 1
    });

    expect(completed).toBe(false);
  });
});
