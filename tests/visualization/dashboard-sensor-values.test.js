// @vitest-environment jsdom

import {
  expect,
  it
} from "vitest";

import {
  renderDashboard
} from "../../src/visualization/dashboard.js";

it("renders Mendi sensor temperature and battery voltage", () => {
  const root =
    document.createElement("div");

  root.innerHTML = `
    <span data-temperature></span>
    <span data-battery></span>
    <span data-battery-detail></span>
    <span data-decoded-frames></span>
    <span data-left-red></span>
    <span data-right-ir></span>
  `;

  renderDashboard(
    root,
    {
      connection: "connected",
      recording: "recording",
      sessionStatus: "recording",
      packetCount: 5,
      quality: "REVIEW",
      battery: {
        voltageMv: 3744,
        charging: false,
        usb: false
      },
      sensor: {
        decodedFrameCount: 4,
        temperatureC: 26.3125,
        left: {
          red: 42101,
          infrared: 97716
        },
        right: {
          red: 19656,
          infrared: 45633
        }
      },
      experiment: {},
      monitor: {
        channels: {},
        contact: {},
        imu: {},
        automarker: {}
      }
    }
  );

  expect(
    root.querySelector(
      "[data-temperature]"
    ).textContent
  ).toBe("26.31 °C");

  expect(
    root.querySelector(
      "[data-battery]"
    ).textContent
  ).toBe("3.744 V");

  expect(
    root.querySelector(
      "[data-decoded-frames]"
    ).textContent
  ).toBe("4");
});
