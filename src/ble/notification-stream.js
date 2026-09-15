export class NotificationStream {
  constructor() {
    this.subscriptions =
      new Map();
  }

  async subscribe(
    characteristic,
    callback
  ) {
    const handler = event => {
      const source =
        event.target.value;

      const bytes =
        new Uint8Array(
          source.byteLength
        );

      bytes.set(
        new Uint8Array(
          source.buffer,
          source.byteOffset,
          source.byteLength
        )
      );

      const timestampMs =
        Date.now();

      callback({
        timestampMs,
        receivedAtMs: timestampMs,
        characteristicUuid:
          characteristic.uuid,
        bytes
      });
    };

    await characteristic
      .startNotifications();

    characteristic.addEventListener(
      "characteristicvaluechanged",
      handler
    );

    this.subscriptions.set(
      characteristic,
      handler
    );
  }

  async unsubscribe(
    characteristic
  ) {
    const handler =
      this.subscriptions.get(
        characteristic
      );

    if (!handler) return;

    characteristic.removeEventListener(
      "characteristicvaluechanged",
      handler
    );

    try {
      await characteristic
        .stopNotifications();
    } catch {
      // A disconnected GATT server may reject stopNotifications().
    }

    this.subscriptions.delete(
      characteristic
    );
  }
}
