// @vitest-environment jsdom

import {
  expect,
  it
} from "vitest";

import {
  renderDashboard
} from "../../src/visualization/dashboard.js";

it("renders the paused disconnect recovery interface", () => {
  const root =
    document.createElement("div");

  root.innerHTML = `
    <strong data-status></strong>
    <strong data-recording></strong>
    <strong data-packets></strong>
    <strong data-quality></strong>
    <strong data-session-clock></strong>
    <strong data-protocol-clock></strong>
    <strong data-session-status></strong>
    <strong data-current-phase></strong>
    <strong data-current-phase-type></strong>
    <strong data-phase-remaining></strong>
    <strong data-current-cycle></strong>
    <strong data-total-cycles></strong>
    <strong data-next-phase></strong>
    <section id="recovery"></section>
  `;

  renderDashboard(root, {
    connection: "disconnected",
    recording: "recording",
    packetCount: 12,
    quality: "REVIEW",
    sessionStatus:
      "paused_disconnected",
    experiment: {
      sessionSeconds: 318,
      protocolSeconds: 231,
      phaseName: "Task",
      phaseType: "task",
      phaseRemainingSeconds: 37
    },
    monitor: {}
  });

  const recovery =
    root.querySelector("#recovery");

  expect(
    recovery.textContent
  ).toContain("Mendi disconnected");

  expect(
    recovery.textContent
  ).toContain("No automatic timeout");

  expect(
    recovery.textContent
  ).toContain("Reconnect Mendi");

  expect(
    recovery.textContent
  ).toContain("End Session");
});
