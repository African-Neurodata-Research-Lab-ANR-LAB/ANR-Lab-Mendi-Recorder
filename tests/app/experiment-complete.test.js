// @vitest-environment node

import {
  describe,
  expect,
  it,
  vi
} from "vitest";

import * as lifecycle
  from "../../src/app/experiment-start.js";

describe("completePreparedExperiment", () => {
  it("stops the experiment, marks the session completed, and unlocks the protocol builder", () => {
    const state = {
      sessionStatus: "recording"
    };

    const experimentEngine = {
      stop: vi.fn()
    };

    const root = {};
    const setProtocolBuilderLocked =
      vi.fn();

    lifecycle.completePreparedExperiment?.({
      experimentEngine,
      state,
      root,
      setProtocolBuilderLocked
    });

    expect(
      experimentEngine.stop
    ).toHaveBeenCalledOnce();

    expect(
      state.sessionStatus
    ).toBe("completed");

    expect(
      setProtocolBuilderLocked
    ).toHaveBeenCalledWith(
      root,
      false
    );
  });
});
