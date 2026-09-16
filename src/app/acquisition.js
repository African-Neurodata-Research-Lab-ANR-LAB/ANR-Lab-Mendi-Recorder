import {
  isMendiCharacteristic
} from "../ble/characteristic-utils.js";

const ACQUISITION_KEYS = [
  "ABB1",
  "ABB4",
  "ABB5"
];

const DEFAULT_FRAME_STALL_MS = 1200;
const DEFAULT_FRAME_POLL_MS = 500;

const activeAcquisitions =
  new WeakMap();

export async function startAcquisition(
  driver,
  onPacket,
  options = {}
) {
  if (
    activeAcquisitions.has(driver)
  ) {
    return false;
  }

  const nowFn =
    options.nowFn ?? Date.now;

  const setIntervalFn =
    options.setIntervalFn ??
    globalThis.setInterval;

  const clearIntervalFn =
    options.clearIntervalFn ??
    globalThis.clearInterval;

  const frameStallAfterMs =
    Number(
      options.frameStallAfterMs ??
        DEFAULT_FRAME_STALL_MS
    );

  const framePollIntervalMs =
    Number(
      options.framePollIntervalMs ??
        DEFAULT_FRAME_POLL_MS
    );

  const acquisition = {
    subscribed: [],
    fallbackTimer: null,
    pollInFlight: false,
    lastAbb1NotificationAtMs:
      nowFn(),
    fallbackActive: false,
    clearIntervalFn
  };

  activeAcquisitions.set(
    driver,
    acquisition
  );

  const handlePacket =
    packet => {
      if (
        isMendiCharacteristic(
          packet.characteristicUuid,
          "ABB1"
        ) &&
        packet.transport !== "poll"
      ) {
        acquisition
          .lastAbb1NotificationAtMs =
          nowFn();

        acquisition.fallbackActive =
          false;
      }

      if (options.packetInspector) {
        options.packetInspector
          .record(packet);
      }

      onPacket(packet);
    };

  // Preserve the original acquisition callback contract when no wrapper
  // behavior is required. Existing lifecycle tests and callers rely on this.
  const subscriptionHandler =
    (
      options.packetInspector ||
      typeof driver.readFrame ===
        "function"
    )
      ? handlePacket
      : onPacket;

  try {
    for (
      const key of
      ACQUISITION_KEYS
    ) {
      await driver.subscribe(
        key,
        subscriptionHandler
      );

      acquisition
        .subscribed
        .push(key);
    }

    // Some Mendi V4 firmware needs this documented ABB2 request before
    // optical frame data becomes available.
    if (
      typeof driver.enableSensor ===
      "function"
    ) {
      await driver.enableSensor();
    }

    // If ABB1 notifications stall, fall back to the characteristic's
    // read-only readValue() path. Notifications remain preferred.
    if (
      typeof driver.readFrame ===
        "function" &&
      Number.isFinite(
        frameStallAfterMs
      ) &&
      frameStallAfterMs >= 0 &&
      Number.isFinite(
        framePollIntervalMs
      ) &&
      framePollIntervalMs > 0
    ) {
      acquisition.fallbackTimer =
        setIntervalFn.call(
          globalThis,
          async () => {
            const staleForMs =
              nowFn() -
              acquisition
                .lastAbb1NotificationAtMs;

            if (
              staleForMs <
                frameStallAfterMs ||
              acquisition.pollInFlight
            ) {
              return;
            }

            acquisition.fallbackActive =
              true;

            acquisition.pollInFlight =
              true;

            try {
              const packet =
                await driver.readFrame();

              if (packet) {
                handlePacket({
                  ...packet,
                  transport: "poll"
                });
              }
            } catch (error) {
              options.onPollingWarning?.(
                error
              );
            } finally {
              acquisition.pollInFlight =
                false;
            }
          },
          framePollIntervalMs
        );
    }

    return true;
  } catch (error) {
    activeAcquisitions.delete(
      driver
    );

    if (
      acquisition.fallbackTimer !==
      null
    ) {
      try {
        clearIntervalFn.call(
          globalThis,
          acquisition.fallbackTimer
        );
      } catch {
        // Preserve the original acquisition error.
      }
    }

    for (
      const key of
      acquisition.subscribed
        .slice()
        .reverse()
    ) {
      try {
        await driver.unsubscribe(key);
      } catch {
        // Preserve the original acquisition error.
      }
    }

    options.onFailure?.(error);
    throw error;
  }
}

export async function stopAcquisition(
  driver
) {
  const acquisition =
    activeAcquisitions.get(driver);

  activeAcquisitions.delete(driver);

  if (!acquisition) {
    return;
  }

  if (
    acquisition.fallbackTimer !==
    null
  ) {
    try {
      acquisition.clearIntervalFn.call(
        globalThis,
        acquisition.fallbackTimer
      );
    } catch {
      // Continue cleanup even if the browser timer was already cleared.
    }
  }

  let firstError = null;

  for (
    const key of
    acquisition.subscribed
      .slice()
      .reverse()
  ) {
    try {
      await driver.unsubscribe(key);
    } catch (error) {
      firstError ??= error;
    }
  }

  if (firstError) {
    throw firstError;
  }
}

export async function handleAcquisitionDisconnect(
  driver,
  options = {}
) {
  await stopAcquisition(driver);
  options.onDisconnected?.();
}

export async function reconnectAcquisition(
  driver,
  onPacket,
  options = {}
) {
  await driver.reconnect();

  return startAcquisition(
    driver,
    onPacket,
    options
  );
}
