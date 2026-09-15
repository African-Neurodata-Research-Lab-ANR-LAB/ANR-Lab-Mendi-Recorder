
// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import * as lifecycle
  from "../../src/app/experiment-start.js";

it("resumes the paused protocol after reconnect", () => {
  const state = {
    recording: "recording",
    sessionStatus: "paused_disconnected"
  };

  const experimentEngine = {
    resume: vi.fn()
  };

  const handler =
    lifecycle.resumePreparedRecordingAfterReconnect;

  expect(
    typeof handler
  ).toBe("function");

  handler?.({
    experimentEngine,
    state
  });

  expect(
    experimentEngine.resume
  ).toHaveBeenCalledOnce();

  expect(
    state.recording
  ).toBe("recording");

  expect(
    state.sessionStatus
  ).toBe("recording");
});
