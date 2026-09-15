// @vitest-environment node

import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  startPreparedExperiment
} from "../../src/app/experiment-start.js";

describe("startPreparedExperiment", () => {
  it("starts an ExperimentEngine with the prepared protocol configuration", () => {
    let now = 0;

    const session = {
      clock: {
        nowSeconds: () => now
      },
      addMarkerAt: event => event
    };

    const preparedSetup = {
      protocol: {
        repeatCount: 1,
        phases: [
          {
            id: "phase-1",
            name: "Baseline",
            type: "baseline",
            durationSeconds: 30,
            autoMarkerEnabled: true
          }
        ]
      },
      autoMarker: {
        enabled: true,
        intervalSeconds: 5
      }
    };

    const engine =
      startPreparedExperiment({
        session,
        preparedSetup,
        setIntervalFn: () => 123,
        clearIntervalFn: vi.fn()
      });

    expect(
      engine.getState()
    ).toMatchObject({
      active: true,
      protocol: {
        phaseName: "Baseline",
        cycle: 1
      },
      autoMarker: {
        active: true,
        intervalSeconds: 5
      }
    });
  });
});
