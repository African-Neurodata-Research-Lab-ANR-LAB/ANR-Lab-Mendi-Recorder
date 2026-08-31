const ACQUISITION_KEYS = ["ABB1", "ABB4", "ABB5"];
const activeAcquisitions = new WeakMap();

export async function startAcquisition(driver, onPacket, options = {}) {
  const subscribed = [];

  try {
    for (const key of ACQUISITION_KEYS) {
      await driver.subscribe(key, onPacket);
      subscribed.push(key);
    }

    activeAcquisitions.set(driver, [...subscribed]);
  } catch (error) {
    for (const key of subscribed.reverse()) {
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

export async function stopAcquisition(driver) {
  const subscribed = activeAcquisitions.get(driver) ?? [];

  activeAcquisitions.delete(driver);

  let firstError = null;

  for (const key of subscribed.slice().reverse()) {
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

export async function handleAcquisitionDisconnect(driver, options = {}) {
  await stopAcquisition(driver);
  options.onDisconnected?.();
}
