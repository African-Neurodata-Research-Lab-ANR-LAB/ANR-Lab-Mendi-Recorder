// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import * as lifecycle
  from "../../src/app/experiment-start.js";

it("aborts an active protocol cleanly on manual End Session", () => {
  const session = {
    addMarker: vi.fn(),
    stop: vi.fn()
  };

  const experimentEngine = {
    stop: vi.fn()
  };

  const state = {
    recording: "recording",
    sessionStatus: "recording"
  };

  const setProtocolBuilderLocked =
    vi.fn();

  const handler =
    lifecycle.abortPreparedExperiment;

  expect(
    typeof handler
  ).toBe("function");

  handler?.({
    session,
    experimentEngine,
    state,
    root: {},
    setProtocolBuilderLocked
  });

  expect(
    experimentEngine.stop
  ).toHaveBeenCalledOnce();

  expect(
    session.addMarker
  ).toHaveBeenNthCalledWith(
    1,
    "PROTOCOL_ABORTED",
    "system"
  );

  expect(
    session.addMarker
  ).toHaveBeenNthCalledWith(
    2,
    "SESSION_END",
    "system"
  );

  expect(
    session.stop
  ).toHaveBeenCalledOnce();

  expect(
    state.sessionStatus
  ).toBe("completed");

  expect(
    state.recording
  ).toBe("stopped");

  expect(
    setProtocolBuilderLocked
  ).toHaveBeenCalledWith(
    {},
    false
  );
});
