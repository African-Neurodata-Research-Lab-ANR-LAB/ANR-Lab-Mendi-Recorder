// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  recorderMarkup
} from "../../src/ui/recorder.js";

it("renders recorder text without mojibake encoding corruption", () => {
  const html =
    recorderMarkup();

  expect(html).not.toContain("Ã");
  expect(html).not.toContain("Â");
  expect(html).not.toContain("â‚¬");
  expect(html).toContain("·");
  expect(html).toContain("—");
});
