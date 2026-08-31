import { describe, expect, it, vi } from "vitest";
import { NotificationStream } from "../../src/ble/notification-stream.js";

function makeCharacteristic() {
  const listeners = new Map();

  return {
    uuid: "test-characteristic",
    startNotifications: vi.fn().mockResolvedValue(undefined),
    stopNotifications: vi.fn().mockResolvedValue(undefined),

    addEventListener: vi.fn((name, handler) => {
      listeners.set(name, handler);
    }),

    removeEventListener: vi.fn((name, handler) => {
      if (listeners.get(name) === handler) {
        listeners.delete(name);
      }
    }),

    emit(bytes) {
      const handler = listeners.get("characteristicvaluechanged");

      const buffer = Uint8Array.from(bytes).buffer;

      handler?.({
        target: {
          value: new DataView(buffer)
        }
      });
    }
  };
}

describe("NotificationStream", () => {
  it("emits an independent byte copy with a reception timestamp", async () => {
    const stream = new NotificationStream();
    const characteristic = makeCharacteristic();
    const callback = vi.fn();

    const now = vi.spyOn(Date, "now").mockReturnValue(123456);

    await stream.subscribe(characteristic, callback);

    characteristic.emit([1, 2, 3, 4]);

    expect(callback).toHaveBeenCalledTimes(1);

    const packet = callback.mock.calls[0][0];

    expect(packet.receivedAtMs).toBe(123456);
    expect(packet.characteristicUuid).toBe("test-characteristic");
    expect(packet.bytes).toEqual(new Uint8Array([1, 2, 3, 4]));

    now.mockRestore();
  });

  it("unsubscribes the exact registered handler", async () => {
    const stream = new NotificationStream();
    const characteristic = makeCharacteristic();

    await stream.subscribe(characteristic, vi.fn());
    await stream.unsubscribe(characteristic);

    expect(characteristic.removeEventListener).toHaveBeenCalledTimes(1);
    expect(characteristic.stopNotifications).toHaveBeenCalledTimes(1);
  });
});
