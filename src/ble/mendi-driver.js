import {
  MENDI_SERVICE_UUID,
  MENDI_CHARACTERISTICS,
  DEVICE_INFORMATION_UUIDS,
  PROTOCOL_LIMITATIONS
} from "./gatt-profile.js";
import { RecorderError, ERROR_CODES } from "../app/errors.js";
import { CharacteristicManager } from "./characteristic-manager.js";
import { NotificationStream } from "./notification-stream.js";

export class MendiDriver {
  constructor(bluetooth = globalThis.navigator?.bluetooth) {
    this.bluetooth = bluetooth;
    this.device = null;
    this.server = null;
    this.characteristics = null;
    this.stream = new NotificationStream();
  }

  async connect() {
    if (!this.bluetooth) {
      throw new RecorderError(
        ERROR_CODES.UNSUPPORTED_BROWSER,
        "Web Bluetooth is not available in this browser."
      );
    }

    try {
      this.device = await this.bluetooth.requestDevice({
        filters: [{ services: [MENDI_SERVICE_UUID] }]
      });
      this.device.addEventListener("gattserverdisconnected", () => {
        this.onDisconnected?.();
      });
      this.server = await this.device.gatt.connect();

      const manager = new CharacteristicManager({
        serviceUuid: MENDI_SERVICE_UUID,
        characteristics: MENDI_CHARACTERISTICS
      });

      this.characteristics = await manager.discover(this.server);
      return this.device;
    } catch (error) {
      throw new RecorderError(
        ERROR_CODES.GATT_UNAVAILABLE,
        "Mendi Bluetooth connection could not be established.",
        error
      );
    }
  }

  async reconnect() {
    if (!this.device?.gatt) {
      throw new RecorderError(
        ERROR_CODES.GATT_UNAVAILABLE,
        "No previously authorized Mendi device is available."
      );
    }

    this.server =
      await this.device.gatt.connect();

    if (
      typeof this.server?.getPrimaryService ===
      "function"
    ) {
      const manager =
        new CharacteristicManager({
          serviceUuid:
            MENDI_SERVICE_UUID,
          characteristics:
            MENDI_CHARACTERISTICS
        });

      this.characteristics =
        await manager.discover(
          this.server
        );
    }

    return this.device;
  }

  async disconnect() {
    if (this.device?.gatt?.connected) this.device.gatt.disconnect();
    this.server = null;
  }

  async readDeviceInfo() {
    const service = await this.server.getPrimaryService(
      "0000180a-0000-1000-8000-00805f9b34fb"
    );

    const read = async (uuid) => {
      try {
        const c = await service.getCharacteristic(
          `0000${uuid}-0000-1000-8000-00805f9b34fb`
        );
        const value = await c.readValue();
        return new TextDecoder().decode(value);
      } catch {
        return null;
      }
    };

    return {
      firmware: await read(DEVICE_INFORMATION_UUIDS.firmware),
      hardware: await read(DEVICE_INFORMATION_UUIDS.hardware),
      manufacturer: await read(DEVICE_INFORMATION_UUIDS.manufacturer),
      testedHardware: PROTOCOL_LIMITATIONS
    };
  }

  getCharacteristic(key) {
    return this.characteristics?.get(key);
  }

  async subscribe(key, callback) {
    const characteristic = this.getCharacteristic(key);
    if (!characteristic) {
      throw new RecorderError(
        ERROR_CODES.CHARACTERISTIC_UNAVAILABLE,
        `${key} is not available on this device.`
      );
    }
    await this.stream.subscribe(characteristic, callback);
  }

  async unsubscribe(key) {
    const characteristic = this.getCharacteristic(key);
    if (characteristic) await this.stream.unsubscribe(characteristic);
  }
}
