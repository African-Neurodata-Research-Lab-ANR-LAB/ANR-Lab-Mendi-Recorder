// @vitest-environment jsdom

import {
  expect,
  it
} from "vitest";

import {
  recorderMarkup
} from "../../src/ui/recorder.js";

it("makes dual live optical traces and sensor temperature first-class research dashboard elements", () => {
  const root =
    document.createElement("div");

  root.innerHTML =
    recorderMarkup();

  expect(
    root.querySelector("#trace")
  ).not.toBeNull();

  expect(
    root.querySelector(
      "#trace-right"
    )
  ).not.toBeNull();

  expect(
    root.querySelector(
      "[data-temperature]"
    )
  ).not.toBeNull();

  expect(
    root.querySelector(
      ".technical-monitor"
    )?.tagName
  ).toBe("DETAILS");

  expect(
    root.querySelector("#stop")
      ?.textContent
      ?.trim()
  ).toBe("End Session");
});
