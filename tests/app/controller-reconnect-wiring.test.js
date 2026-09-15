
// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  readFileSync
} from "node:fs";

it("wires the reconnect control to acquisition recovery and protocol resume", () => {
  const source =
    readFileSync(
      new URL(
        "../../src/app/controller.js",
        import.meta.url
      ),
      "utf8"
    );

  expect(
    source
  ).toContain(
    'querySelector("#reconnect")'
  );

  expect(
    source
  ).toContain(
    "reconnectAcquisition"
  );

  expect(
    source
  ).toContain(
    "resumePreparedRecordingAfterReconnect"
  );

  expect(
    source
  ).toContain(
    "DEVICE_RECONNECTED"
  );
});
