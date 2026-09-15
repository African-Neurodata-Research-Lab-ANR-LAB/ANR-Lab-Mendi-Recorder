
// @vitest-environment node

import {
  expect,
  it,
  vi
} from "vitest";

import {
  MendiDriver
} from "../../src/ble/mendi-driver.js";

it("reconnects the stored Mendi without requesting a new device", async () => {
  const requestDevice =
    vi.fn();

  const driver =
    new MendiDriver({
      requestDevice
    });

  const server = {};

  driver.device = {
    gatt: {
      connected: false,
      connect:
        vi.fn()
          .mockResolvedValue(server)
    }
  };

  driver.characteristics =
    new Map();

  const reconnect =
    driver.reconnect;

  expect(
    typeof reconnect
  ).toBe("function");

  await reconnect?.call(driver);

  expect(
    driver.device.gatt.connect
  ).toHaveBeenCalledOnce();

  expect(
    requestDevice
  ).not.toHaveBeenCalled();

  expect(
    driver.server
  ).toBe(server);
});

it("rediscovers Mendi characteristics after reconnect", async () => {
  const characteristic = {
    uuid: "test-characteristic",
    properties: {
      notify: true
    }
  };

  const service = {
    uuid: "mendi-service",

    getCharacteristics:
      vi.fn()
        .mockResolvedValue([
          characteristic
        ]),

    getCharacteristic:
      vi.fn()
        .mockResolvedValue(
          characteristic
        )
  };

  const server = {
    getPrimaryService:
      vi.fn()
        .mockResolvedValue(
          service
        )
  };

  const driver =
    new MendiDriver({
      requestDevice: vi.fn()
    });

  driver.device = {
    gatt: {
      connected: false,

      connect:
        vi.fn()
          .mockResolvedValue(
            server
          )
    }
  };

  driver.characteristics =
    new Map();

  await driver.reconnect();

  expect(
    server.getPrimaryService
  ).toHaveBeenCalledOnce();

  expect(
    driver.characteristics.size
  ).toBeGreaterThan(0);
});
