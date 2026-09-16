// @vitest-environment jsdom

import {
  expect,
  it
} from "vitest";

import {
  recorderMarkup
} from "../../src/ui/recorder.js";

it("shows ANR branding, contact details, acquisition mode, and live raw IMU", () => {
  const markup =
    recorderMarkup();

  expect(markup)
    .toContain("anr-logo.png");

  expect(markup)
    .toContain(
      "africanneurodataresearch.org"
    );

  expect(markup)
    .toContain(
      "anrlab.ng@gmail.com"
    );

  expect(markup)
    .toContain(
      "LIVE HEAD MOVEMENT"
    );

  expect(markup)
    .toContain(
      "data-acquisition-mode"
    );
});
