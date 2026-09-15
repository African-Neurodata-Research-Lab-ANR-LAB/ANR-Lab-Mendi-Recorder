// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  decodedOpticalCsv
} from "../../src/export/csv.js";

it("exports validated decoded optical and temperature fields", () => {
  const csv =
    decodedOpticalCsv([
      {
        timeS: 1.25,
        temperature: 26.3125,
        left: {
          red: 42101,
          ir: 97716,
          ambient: 17155
        },
        right: {
          red: 19656,
          ir: 45633,
          ambient: 6586
        },
        pulseReference: {
          red: 94214,
          ir: 276919,
          ambient: 3156
        },
        imu: {
          accX: 30,
          accY: 14949,
          accZ: -886,
          gyroX: 1151,
          gyroY: -2624,
          gyroZ: -1920
        }
      }
    ]);

  expect(csv)
    .toContain(
      "temperature_c,left_red_raw,left_ir_raw"
    );

  expect(csv)
    .toContain(
      "1.25,26.3125,42101,97716"
    );
});
