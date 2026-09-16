// @vitest-environment jsdom

import {
  expect,
  it
} from "vitest";

import {
  renderDashboard
} from "../../src/visualization/dashboard.js";

it("updates visible and technical raw IMU values together", () => {
  document.body.innerHTML = `
    <main id="root">
      <strong data-acquisition-mode></strong>
      <strong data-imu-acc-x></strong>
      <strong data-imu-acc-x></strong>
      <strong data-imu-gyro-z></strong>
      <strong data-imu-gyro-z></strong>
    </main>
  `;

  const root =
    document.querySelector(
      "#root"
    );

  renderDashboard(
    root,
    {
      connection:
        "connected",
      recording:
        "recording",
      sessionStatus:
        "recording",
      packetCount: 2,
      quality: "REVIEW",
      battery: null,
      experiment: {},
      sensor: {
        acquisitionMode:
          "POLL",
        decodedFrameCount: 2,
        temperatureC: 26.9,
        left: {},
        right: {},
        imu: {
          accX: 300,
          gyroZ: -2063
        }
      },
      monitor: {}
    }
  );

  expect(
    root.querySelector(
      "[data-acquisition-mode]"
    ).textContent
  ).toBe("POLL");

  const acc =
    Array.from(
      root.querySelectorAll(
        "[data-imu-acc-x]"
      )
    ).map(
      element =>
        element.textContent
    );

  expect(acc)
    .toEqual([
      "300",
      "300"
    ]);
});
