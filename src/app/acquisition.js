export async function startAcquisition(driver, onPacket, options = {}) {
  const subscribed = [];

  try {
    for (const key of ["ABB1", "ABB4", "ABB5"]) {
      await driver.subscribe(key, onPacket);
      subscribed.push(key);
    }
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
