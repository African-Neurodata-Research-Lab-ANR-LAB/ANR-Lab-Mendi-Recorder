// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  LiveTraceBuffer
} from "../../src/visualization/live-trace-buffer.js";

it("buffers left and right optical traces while preserving legacy left aliases", () => {
  const buffer =
    new LiveTraceBuffer(3);

  buffer.push(
    {
      left: {
        red: 10,
        infrared: 20
      },
      right: {
        red: 30,
        infrared: 40
      }
    },
    0.1
  );

  expect(buffer.get())
    .toEqual({
      red: [10],
      infrared: [20]
    });

  expect(buffer.getDual())
    .toEqual({
      times: [0.1],
      left: {
        red: [10],
        infrared: [20]
      },
      right: {
        red: [30],
        infrared: [40]
      }
    });
});
