// @vitest-environment node

import {
  describe,
  expect,
  it
} from "vitest";

import {
  readFileSync
} from "node:fs";

describe("controller prepared experiment lifecycle wiring", () => {
  it("completes the prepared experiment when the session is stopped", () => {
    const source =
      readFileSync(
        new URL(
          "../../src/app/controller.js",
          import.meta.url
        ),
        "utf8"
      );

    expect(source).toMatch(
      /session\.stop\(\);[\s\S]*?completePreparedExperiment\s*\(/
    );
  });
});

it("requests the shared stop action when the protocol completes", () => {
  const source =
    readFileSync(
      new URL(
        "../../src/app/controller.js",
        import.meta.url
      ),
      "utf8"
    );

  expect(source).toMatch(
    /refreshPreparedRecording\s*\([\s\S]*?requestProtocolCompletion\s*\(/
  );
});
