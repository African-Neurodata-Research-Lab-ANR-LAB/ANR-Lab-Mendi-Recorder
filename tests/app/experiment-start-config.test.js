// @vitest-environment node

import {
  describe,
  expect,
  it
} from "vitest";

import {
  buildExperimentStartConfig
} from "../../src/app/state.js";

describe("prepared experiment startup", () => {
  it("uses the prepared protocol and enabled AutoMarker interval", () => {
    const preparedSetup = {
      protocol: {
        repeatCount: 2,
        phases: [
          {
            id: "phase-1",
            name: "Baseline",
            type: "baseline",
            durationSeconds: 30,
            autoMarkerEnabled: true
          },
          {
            id: "phase-2",
            name: "Task",
            type: "task",
            durationSeconds: 60,
            autoMarkerEnabled: true
          }
        ]
      },
      autoMarker: {
        enabled: true,
        intervalSeconds: 5
      }
    };

    expect(
      buildExperimentStartConfig?.(
        preparedSetup
      )
    ).toEqual({
      protocol: preparedSetup.protocol,
      autoMarkerIntervalSeconds: 5
    });
  });
});
