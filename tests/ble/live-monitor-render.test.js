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

  it("renders channel, IMU, and automarker details", () => {
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

      <div data-monitor-abb1></div>
      <div data-monitor-abb4></div>
      <div data-monitor-abb5></div>
      <div data-monitor-unknown></div>
      <div data-monitor-imu></div>
      <div data-monitor-automarker></div>
      <div data-monitor-last-event></div>
    `;

    const state = {
      connection: "connected",
      recording: "recording",
      packetCount: 42,
      quality: "GOOD",

      monitor: {
        elapsedSeconds: 12,
        packetRateHz: 10,
        signalQuality: "GOOD",
        contact: {
          left: "GOOD",
          right: "GOOD"
        },
        channels: {
          ABB1: 20,
          ABB4: 15,
          ABB5: 7,
          unknown: 0
        },
        imu: {
          enabled: true,
          status: "AVAILABLE"
        },
        automarker: {
          enabled: true,
          lastEvent: "START"
        }
      }
    };

    renderDashboard(root, state);

    expect(root.querySelector("[data-monitor-abb1]").textContent).toBe("20");

    expect(root.querySelector("[data-monitor-abb4]").textContent).toBe("15");

    expect(root.querySelector("[data-monitor-abb5]").textContent).toBe("7");

    expect(root.querySelector("[data-monitor-unknown]").textContent).toBe(
      "0"
    );

    expect(root.querySelector("[data-monitor-imu]").textContent).toBe(
      "AVAILABLE"
    );

    expect(root.querySelector("[data-monitor-automarker]").textContent).toBe(
      "ENABLED"
    );

    expect(root.querySelector("[data-monitor-last-event]").textContent).toBe(
      "START"
    );
  });
});
