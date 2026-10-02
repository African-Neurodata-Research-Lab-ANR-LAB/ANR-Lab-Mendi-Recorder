// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';

const hardware = vi.hoisted(() => ({callbacks: new Map()}));
vi.mock('../../src/ble/mendi-driver.js', () => ({MendiDriver: class {
  async connect() { return {name: 'Synthetic test Mendi'}; }
  async subscribe(key, callback) { hardware.callbacks.set(key, callback); }
  async unsubscribe(key) { hardware.callbacks.delete(key); }
  async enableSensor() {
    hardware.callbacks.get('ABB1')?.({
      characteristicUuid:'fc3eabb1-c6c4-49e6-922a-6e551c455af5',
      bytes:Uint8Array.from([8,1,16,2,24,3,32,4,40,5,48,6,64,20,72,10,80,0,88,40,96,30,104,0]),
      timestampMs:Date.now()
    });
  }
}}));

class Socket {
  static latest;
  constructor() { this.readyState = 1; this.bufferedAmount = 0; this.sent = []; Socket.latest = this; queueMicrotask(() => this.onopen()); }
  send(text) {
    const message = JSON.parse(text); this.sent.push(message);
    const reply = message.type === 'sync' ? {type:'sync', client_send_ms:message.client_send_ms, server_time_s:message.client_send_ms / 1000 + 100}
      : message.type === 'start' ? {type:'started', run_id:message.run_id} : null;
    if (reply) queueMicrotask(() => this.onmessage({data:JSON.stringify(reply)}));
  }
  close() { this.readyState = 3; this.onclose?.(); }
}

afterEach(() => { window.dispatchEvent(new Event('pagehide')); vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it('routes actual recorder controls and decoded frames into health, plots, LSL and final markers', async () => {
  vi.useFakeTimers(); vi.stubGlobal('WebSocket', Socket);
  vi.stubGlobal('alert', vi.fn()); vi.stubGlobal('prompt', () => 'TASK_BUTTON');
  Object.defineProperty(navigator, 'bluetooth', {value: {}, configurable: true});
  URL.createObjectURL = () => 'blob:test'; URL.revokeObjectURL = () => {};
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  const drawing = [];
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ({
    clearRect() {}, beginPath() {}, moveTo(x,y) {drawing.push([x,y]);}, lineTo() {}, stroke() {}, fillText() {}, setLineDash() {}, arc() {}, fill() {}
  }));
  document.body.innerHTML = '<div id="app"></div>';
  await import('../../src/app/controller.js');
  const $ = selector => document.querySelector(selector);
  $('#bridge-connect').click(); await vi.advanceTimersByTimeAsync(300);
  expect($('[data-live-bridge]').textContent).toBe('CONNECTED');
  $('[name=participantCode]').value = 'SYNTHETIC'; $('[name=sessionCode]').value = 'TEST';
  $('#setup-form').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
  await $('#connect').onclick(); await $('#start').onclick();
  await vi.advanceTimersByTimeAsync(300);
  expect($('[data-live-bridge]').textContent).toBe('STREAMING');
  for (let i=0;i<4;i++) {
    hardware.callbacks.get('ABB1')({characteristicUuid:'fc3eabb1-c6c4-49e6-922a-6e551c455af5', bytes:Uint8Array.from([8,1,16,2,24,3,32,4,40,5,48,6,64,20,72,10,80,0,88,40,96,30,104,0]), timestampMs:Date.now()});
    await vi.advanceTimersByTimeAsync(500);
  }
  expect($('[data-live-status]').textContent).toBe('REPEATED VALUES');
  expect($('[data-live-repeats]').textContent).toBe('4');
  expect(drawing.length).toBeGreaterThan(0);
  const samples=Socket.latest.sent.filter(m=>m.type==='sample');
  expect(samples).toHaveLength(5);
  expect(samples[0].optical).toEqual([10,20,30,40]);
  expect(samples[4].repeated).toBe(true);
  $('#marker').click();
  await $('#stop').onclick();
  const events=Socket.latest.sent.filter(m=>m.type==='event');
  expect(events.map(m=>m.event.description)).toContain('TASK_BUTTON');
  expect(events.at(-1).event.description).toBe('STOP_RECORDING');
  expect(Socket.latest.sent.at(-1).type).toBe('stop');
  expect($('[data-live-status]').textContent).toBe('ENDED');
});
