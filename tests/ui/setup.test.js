// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  readSetupForm,
  validateSetup
} from "../../src/ui/setup.js";

describe("Session setup", () => {
  it("reads a structured protocol builder configuration", () => {
    const form = document.createElement("form");

    form.innerHTML = `
      <input name="participantCode" value="P001">
      <input name="sessionCode" value="S001">

      <div data-protocol-phase>
        <input data-phase-name value="Baseline">
        <select data-phase-type>
          <option value="baseline" selected>Baseline</option>
        </select>
        <input data-phase-duration value="30">
        <input
          type="checkbox"
          data-phase-automarker
          checked
        >
      </div>

      <div data-protocol-phase>
        <input data-phase-name value="Task">
        <select data-phase-type>
          <option value="task" selected>Task</option>
        </select>
        <input data-phase-duration value="60">
        <input
          type="checkbox"
          data-phase-automarker
          checked
        >
      </div>

      <input name="repeatCount" value="2">

      <input
        type="checkbox"
        name="autoMarkerEnabled"
        checked
      >

      <input
        name="autoMarkerIntervalSeconds"
        value="5"
      >

      <textarea name="notes">Pilot session</textarea>

      <input
        type="checkbox"
        name="imuEnabled"
        checked
      >
    `;

    const data = readSetupForm(form);

    expect(data.protocol).toEqual({
      repeatCount: 2,
      phases: [
        {
          id: "phase-1",
          name: "Baseline",
          type: "baseline",
          durationSeconds: 30,
          autoMarkerEnabled: true
        },
        {
          id: "phase-2",
          name: "Task",
          type: "task",
          durationSeconds: 60,
          autoMarkerEnabled: true
        }
      ]
    });

    expect(data.autoMarker).toEqual({
      enabled: true,
      intervalSeconds: 5
    });
  });
});

it("rejects an invalid structured protocol phase", () => {
  const data = {
    participantCode: "P001",
    sessionCode: "S001",
    protocol: {
      repeatCount: 1,
      phases: [
        {
          id: "phase-1",
          name: "Baseline",
          type: "baseline",
          durationSeconds: 0,
          autoMarkerEnabled: true
        }
      ]
    },
    autoMarker: {
      enabled: false,
      intervalSeconds: 0
    }
  };

  const errors = validateSetup(data);

  expect(
    errors.some(error =>
      error.includes("durationSeconds")
    )
  ).toBe(true);
});

