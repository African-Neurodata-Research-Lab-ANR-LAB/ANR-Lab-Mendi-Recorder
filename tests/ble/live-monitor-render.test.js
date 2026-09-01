// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import { renderDashboard } from "../../src/visualization/dashboard.js";

describe("live technical monitor rendering", () => {
  it("renders the live monitor values", () => {
    const root = document.createElement("div");

    root.innerHTML = `
      <div data-status></div>
      <div data-recording></div>
      <div data-packets></div>
      <div data-quality></div>

      <div data-monitor-elapsed></div>
      <div data-monitor-rate></div>
      <div data-monitor-signal></div>
      <div data-monitor-left-contact></div>
      <div data-monitor-right-contact></div>
    `;

    const state = {
      connection: "connected",
      recording: "recording",
      packetCount: 25,
      quality: "GOOD",

      monitor: {
        elapsedSeconds: 12,
        packetRateHz: 8.5,
        signalQuality: "GOOD",
        contact: {
          left: "GOOD",
          right: "GOOD"
        }
      }
    };

    renderDashboard(root, state);

    expect(root.querySelector("[data-monitor-elapsed]").textContent).toBe(
      "12"
    );

    expect(root.querySelector("[data-monitor-rate]").textContent).toBe(
      "8.5"
    );

    expect(root.querySelector("[data-monitor-signal]").textContent).toBe(
      "GOOD"
    );

    expect(
      root.querySelector("[data-monitor-left-contact]").textContent
    ).toBe("GOOD");

    expect(
      root.querySelector("[data-monitor-right-contact]").textContent
    ).toBe("GOOD");
  });
});