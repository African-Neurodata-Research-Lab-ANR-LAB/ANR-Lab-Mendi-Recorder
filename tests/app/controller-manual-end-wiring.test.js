// @vitest-environment node

import {
  expect,
  it
} from "vitest";

import {
  readFileSync
} from "node:fs";

it("routes the stop button through manual protocol abort handling", () => {
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
  ).toMatch(
    /import\s*\{[\s\S]*abortPreparedExperiment[\s\S]*\}\s*from\s*"\.\/experiment-start\.js"/
  );

  const markerStart =
    source.indexOf(
      'querySelector("#marker")'
    );

  const stopStart =
    source.lastIndexOf(
      'querySelector("#stop")',
      markerStart
    );

  const stopBlock =
    source.slice(
      stopStart,
      markerStart
    );

  expect(
    stopBlock
  ).toContain(
    "abortPreparedExperiment"
  );
});
