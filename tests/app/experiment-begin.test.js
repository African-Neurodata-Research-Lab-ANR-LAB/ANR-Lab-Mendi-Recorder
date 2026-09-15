// @vitest-environment node

import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import {
  createState
} from "../../src/app/state.js";

import * as lifecycle
  from "../../src/app/experiment-start.js";

describe("beginPreparedRecording", () => {
  it("starts the session and prepared experiment, updates state, and locks the protocol", () => {
    const state = createState();

    const session = {
      start: vi.fn(),
      clock: {
        nowSeconds: () => 0
      },
      addMarkerAt: vi.fn()
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
        enabled: false,
        intervalSeconds: 5
      }
    };

    const root = {};
    const setProtocolBuilderLocked =
      vi.fn();

    const engine =
      lifecycle.beginPreparedRecording?.({
        session,
        preparedSetup,
        state,
        root,
        setProtocolBuilderLocked,
        setIntervalFn: () => 123,
        clearIntervalFn: vi.fn()
      });

    expect(session.start)
      .toHaveBeenCalledWith(
        preparedSetup
      );

    expect(
      engine?.getState().protocol.phaseName
    ).toBe("Baseline");

    expect(state.sessionStatus)
      .toBe("recording");

    expect(state.recording)
      .toBe("recording");

    expect(
      setProtocolBuilderLocked
    ).toHaveBeenCalledWith(
      root,
      true
    );
  });
});
