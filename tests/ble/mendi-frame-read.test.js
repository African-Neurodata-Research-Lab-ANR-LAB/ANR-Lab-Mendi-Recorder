// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import {
  MendiDriver
} from "../../src/ble/mendi-driver.js";

it("reads an ABB1 frame without issuing a control write", async () => {
  const bytes =
    Uint8Array.from([
      8, 1,
      61, 0, 0, 200, 65
    ]);

  const characteristic = {
    uuid:
      "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
    readValue:
      vi.fn().mockResolvedValue(
        new DataView(
          bytes.buffer
        )
      )
  };

  const driver =
    new MendiDriver();

  driver.characteristics =
    new Map([
      ["ABB1", characteristic]
    ]);

  const packet =
    await driver.readFrame();

  expect(
    characteristic.readValue
  ).toHaveBeenCalledOnce();

  expect(
    Array.from(packet.bytes)
  ).toEqual(
    Array.from(bytes)
  );

  expect(packet.transport)
    .toBe("poll");
});
