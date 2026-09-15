// @vitest-environment node

import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import * as lifecycle
  from "../../src/app/experiment-start.js";

describe("requestProtocolCompletion", () => {
  it("moves the recorder to stopping and triggers the stop action once", () => {
    const state = {
      recording: "recording",
      sessionStatus: "recording"
    };

    const stopAction = vi.fn();

    const triggered =
      lifecycle.requestProtocolCompletion?.({
        completed: true,
        state,
        stopAction
      });

    expect(triggered).toBe(true);

    expect(state.recording)
      .toBe("stopping");

    expect(state.sessionStatus)
      .toBe("stopping");

    expect(stopAction)
      .toHaveBeenCalledOnce();
  });
});
