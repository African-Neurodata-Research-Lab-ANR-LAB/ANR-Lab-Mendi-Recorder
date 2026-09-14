// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  recorderMarkup
} from "../../src/ui/recorder.js";

describe("Recorder protocol builder markup", () => {
  it("renders Baseline and Task as the default protocol", () => {
    const root = document.createElement("div");
    root.innerHTML = recorderMarkup();

    const phases = Array.from(
      root.querySelectorAll(
        "[data-protocol-phase]"
      )
    );

    expect(phases).toHaveLength(2);

    expect(
      phases[0]
        .querySelector("[data-phase-name]")
        .value
    ).toBe("Baseline");

    expect(
      phases[0]
        .querySelector("[data-phase-type]")
        .value
    ).toBe("baseline");

    expect(
      phases[1]
        .querySelector("[data-phase-name]")
        .value
    ).toBe("Task");

    expect(
      phases[1]
        .querySelector("[data-phase-type]")
        .value
    ).toBe("task");

    expect(
      root.querySelector(
        '[name="repeatCount"]'
      )
    ).not.toBeNull();

    expect(
      root.querySelector(
        '[name="autoMarkerEnabled"]'
      )
    ).not.toBeNull();

    expect(
      root.querySelector(
        '[name="autoMarkerIntervalSeconds"]'
      )
    ).not.toBeNull();
  });
});

it("provides add, reorder, and remove controls for protocol phases", () => {
  const root = document.createElement("div");
  root.innerHTML = recorderMarkup();

  const phases = Array.from(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  );

  expect(
    root.querySelector("#add-phase")
  ).not.toBeNull();

  for (const phase of phases) {
    expect(
      phase.querySelector(
        "[data-phase-up]"
      )
    ).not.toBeNull();

    expect(
      phase.querySelector(
        "[data-phase-down]"
      )
    ).not.toBeNull();

    expect(
      phase.querySelector(
        "[data-phase-remove]"
      )
    ).not.toBeNull();
  }
});
