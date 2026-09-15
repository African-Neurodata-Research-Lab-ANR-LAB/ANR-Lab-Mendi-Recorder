
// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import * as lifecycle
  from "../../src/app/experiment-start.js";

it("pauses the protocol on unexpected disconnect without stopping the session", () => {
  const state = {
    recording: "recording",
    sessionStatus: "recording"
  };

  const experimentEngine = {
    pause: vi.fn()
  };

  const session = {
    stop: vi.fn()
  };

  const handler =
    lifecycle.pausePreparedRecordingOnDisconnect;

  expect(
    typeof handler
  ).toBe("function");

  handler?.({
    experimentEngine,
    session,
    state
  });

  expect(
    experimentEngine.pause
  ).toHaveBeenCalledOnce();

  expect(
    session.stop
  ).not.toHaveBeenCalled();

  expect(
    state.recording
  ).toBe("recording");

  expect(
    state.sessionStatus
  ).toBe("paused_disconnected");
});
