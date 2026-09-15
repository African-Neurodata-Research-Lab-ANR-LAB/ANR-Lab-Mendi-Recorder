// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  readFileSync
} from "node:fs";

it("pauses the prepared experiment instead of stopping the session on disconnect", () => {
  const source =
    readFileSync(
      new URL(
        "../../src/app/controller.js",
        import.meta.url
      ),
      "utf8"
    );

  const start =
    source.indexOf(
      "driver.onDisconnected"
    );

  const disconnectBlock =
    source.slice(start);

  expect(
    disconnectBlock
  ).toContain(
    "pausePreparedRecordingOnDisconnect"
  );

  expect(
    disconnectBlock
  ).not.toContain(
    "session.stop();"
  );
});
