import { expect, it, vi } from 'vitest';
import { startAcquisition, stopAcquisition } from '../../src/app/acquisition.js';

it('cancels a pending subscription before enabling or polling the sensor', async () => {
  let finishSubscription;
  const pending = new Promise(resolve => { finishSubscription = resolve; });
  const subscriptions = new Set();
  let handler;
  const driver = {
    async subscribe(key, callback) {
      handler = callback;
      await pending;
      subscriptions.add(key);
    },
    async unsubscribe(key) { subscriptions.delete(key); },
    enableSensor: vi.fn(),
    readFrame: vi.fn()
  };
  const receive = vi.fn();
  const schedule = vi.fn();
  const started = startAcquisition(driver, receive, {setIntervalFn: schedule});
  const stopped = stopAcquisition(driver);
  finishSubscription();
  await stopped;
  expect(await started).toBe(false);
  handler({characteristicUuid: 'ABB1', bytes: new Uint8Array()});
  expect(subscriptions.size).toBe(0);
  expect(driver.enableSensor).not.toHaveBeenCalled();
  expect(schedule).not.toHaveBeenCalled();
  expect(receive).not.toHaveBeenCalled();
});

it('discards a poll result from a stopped acquisition after a new run starts', async () => {
  let finishRead;
  const pending = new Promise(resolve => { finishRead = resolve; });
  let tick;
  const driver = {
    async subscribe() {}, async unsubscribe() {},
    readFrame: () => pending
  };
  const oldReceive = vi.fn();
  const newReceive = vi.fn();
  const options = {frameStallAfterMs: 0, setIntervalFn: callback => { tick = callback; return 1; }, clearIntervalFn() {}};
  await startAcquisition(driver, oldReceive, options);
  const reading = tick();
  await stopAcquisition(driver);
  await startAcquisition(driver, newReceive, options);
  finishRead({characteristicUuid: 'ABB1', bytes: new Uint8Array()});
  await reading;
  expect(oldReceive).not.toHaveBeenCalled();
  expect(newReceive).not.toHaveBeenCalled();
  await stopAcquisition(driver);
});
