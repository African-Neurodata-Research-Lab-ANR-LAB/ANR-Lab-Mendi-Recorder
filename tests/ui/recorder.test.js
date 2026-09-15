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

it("adds a new phase when Add Phase is clicked", async () => {
  const ui = await import("../../src/ui/recorder.js");

  expect(
    typeof ui.wireProtocolBuilder
  ).toBe("function");

  const root = document.createElement("div");
  root.innerHTML = ui.recorderMarkup();

  ui.wireProtocolBuilder?.(root);

  root
    .querySelector("#add-phase")
    .click();

  expect(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  ).toHaveLength(3);
});

it("mounts the recorder with protocol builder behavior enabled", async () => {
  const ui = await import("../../src/ui/recorder.js");

  expect(
    typeof ui.mountRecorder
  ).toBe("function");

  const root = document.createElement("div");

  ui.mountRecorder?.(root);

  root
    .querySelector("#add-phase")
    .click();

  expect(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  ).toHaveLength(3);
});

it("removes a phase when Remove is clicked", async () => {
  const ui = await import("../../src/ui/recorder.js");

  const root = document.createElement("div");
  ui.mountRecorder(root);

  const phasesBefore =
    root.querySelectorAll(
      "[data-protocol-phase]"
    );

  expect(phasesBefore).toHaveLength(2);

  phasesBefore[0]
    .querySelector(
      "[data-phase-remove]"
    )
    .click();

  expect(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  ).toHaveLength(1);
});

it("reorders protocol phases with Move Up and Move Down", async () => {
  const ui = await import("../../src/ui/recorder.js");

  const root = document.createElement("div");
  ui.mountRecorder(root);

  let phases = Array.from(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  );

  phases[0]
    .querySelector("[data-phase-down]")
    .click();

  phases = Array.from(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  );

  expect(
    phases[0]
      .querySelector("[data-phase-name]")
      .value
  ).toBe("Task");

  expect(
    phases[1]
      .querySelector("[data-phase-name]")
      .value
  ).toBe("Baseline");

  phases[1]
    .querySelector("[data-phase-up]")
    .click();

  phases = Array.from(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  );

  expect(
    phases[0]
      .querySelector("[data-phase-name]")
      .value
  ).toBe("Baseline");
});

it("turns AutoMarker off when a phase is changed to Get Ready", async () => {
  const ui = await import("../../src/ui/recorder.js");

  const root = document.createElement("div");
  ui.mountRecorder(root);

  root
    .querySelector("#add-phase")
    .click();

  const phases = Array.from(
    root.querySelectorAll(
      "[data-protocol-phase]"
    )
  );

  const phase = phases.at(-1);
  const type =
    phase.querySelector("[data-phase-type]");
  const autoMarker =
    phase.querySelector("[data-phase-automarker]");

  expect(autoMarker.checked).toBe(true);

  type.value = "get_ready";
  type.dispatchEvent(
    new Event("change", { bubbles: true })
  );

  expect(autoMarker.checked).toBe(false);
});

it("locks all protocol builder controls when the active protocol is locked", async () => {
  const ui = await import("../../src/ui/recorder.js");

  const root = document.createElement("div");
  ui.mountRecorder(root);

  ui.setProtocolBuilderLocked?.(
    root,
    true
  );

  const controls = root.querySelectorAll(`
    [data-phase-name],
    [data-phase-type],
    [data-phase-duration],
    [data-phase-automarker],
    [data-phase-up],
    [data-phase-down],
    [data-phase-remove],
    #add-phase,
    [name="repeatCount"],
    [name="autoMarkerEnabled"],
    [name="autoMarkerIntervalSeconds"]
  `);

  expect(controls.length).toBeGreaterThan(0);

  for (const control of controls) {
    expect(control.disabled).toBe(true);
  }
});

it("unlocks protocol builder controls after the active protocol ends", async () => {
  const ui = await import("../../src/ui/recorder.js");

  const root = document.createElement("div");
  ui.mountRecorder(root);

  ui.setProtocolBuilderLocked(
    root,
    true
  );

  ui.setProtocolBuilderLocked(
    root,
    false
  );

  const controls = root.querySelectorAll(`
    [data-phase-name],
    [data-phase-type],
    [data-phase-duration],
    [data-phase-automarker],
    [data-phase-up],
    [data-phase-down],
    [data-phase-remove],
    #add-phase,
    [name="repeatCount"],
    [name="autoMarkerEnabled"],
    [name="autoMarkerIntervalSeconds"]
  `);

  for (const control of controls) {
    expect(control.disabled).toBe(false);
  }
});

it("renders the protocol session dashboard fields", () => {
  const root = document.createElement("div");
  root.innerHTML = recorderMarkup();

  const selectors = [
    "[data-session-clock]",
    "[data-protocol-clock]",
    "[data-session-status]",
    "[data-current-phase]",
    "[data-current-phase-type]",
    "[data-phase-remaining]",
    "[data-current-cycle]",
    "[data-total-cycles]",
    "[data-next-phase]"
  ];

  for (const selector of selectors) {
    expect(
      root.querySelector(selector)
    ).not.toBeNull();
  }
});
