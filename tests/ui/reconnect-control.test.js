
// @vitest-environment jsdom

import {
  expect,
  it
} from "vitest";

import {
  mountRecorder
} from "../../src/ui/recorder.js";

it("includes a reconnect control for paused disconnect recovery", () => {
  document.body.innerHTML =
    '<div id="app"></div>';

  const root =
    document.querySelector("#app");

  mountRecorder(root);

  const button =
    root.querySelector("#reconnect");

  expect(button).not.toBeNull();

  expect(
    button.textContent
      .toLowerCase()
  ).toContain("reconnect");
});
