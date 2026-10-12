import { expect, it, vi } from 'vitest';
import { LslClient } from '../../src/streaming/lsl-client.js';

class Socket {
  static latest;
  constructor(url) { this.url = url; this.readyState = 0; this.bufferedAmount = 0; this.sent = []; Socket.latest = this; }
  send(text) { this.sent.push(JSON.parse(text)); }
  close() { this.readyState = 3; this.onclose?.(); }
  open() { this.readyState = 1; this.onopen(); }
  reply(message) { this.onmessage({data: JSON.stringify(message)}); }
}

function connectedClient() {
  let now = 1000;
  const client = new LslClient({WebSocketClass: Socket, now: () => now});
  client.connect(); const socket = Socket.latest; socket.open();
  for (let i = 0; i < 5; i++) {
    const request = socket.sent.at(-1); now += 20;
    socket.reply({type: 'sync', client_send_ms: request.client_send_ms, server_time_s: request.client_send_ms / 1000 + 100 + 0.01});
  }
  return {client, socket};
}

it('estimates clock offset and waits for session acknowledgement before streaming', () => {
  const {client, socket} = connectedClient();
  client.begin('run-1');
  expect(socket.sent.at(-1)).toMatchObject({type: 'start', run_id: 'run-1', clock_offset_s: 100, clock_rtt_ms: 20});
  expect(client.send({type: 'sample'})).toBe(false);
  socket.reply({type: 'started', run_id: 'run-1'});
  expect(client.send({type: 'sample', timestamp_ms: 1110})).toBe(true);
  expect(socket.sent.at(-1).timestamp_ms).toBe(1110);
  client.disconnect();
});

it('reports backpressure and disconnect without throwing into acquisition', () => {
  const {client, socket} = connectedClient();
  client.begin('run-1'); socket.reply({type: 'started', run_id: 'run-1'});
  socket.bufferedAmount = 300000;
  expect(client.send({type: 'sample'})).toBe(false);
  expect(client.snapshot().unsentSamples).toBe(1);
  socket.close();
  expect(client.send({type: 'sample'})).toBe(false);
  expect(client.snapshot().status).toBe('DISCONNECTED');
  client.disconnect();
});

it('refuses a remote bridge URL', () => {
  const client = new LslClient({WebSocketClass: Socket});
  expect(() => client.connect('ws://example.com:8765')).toThrow(/loopback/i);
});

it('stops the remote session even before its start acknowledgement arrives', () => {
  const {client, socket} = connectedClient();
  client.begin('run-1');
  client.end();
  expect(socket.sent.at(-1)).toMatchObject({type: 'stop', run_id: 'run-1'});
  socket.reply({type: 'started', run_id: 'run-1'});
  expect(client.send({type: 'sample'})).toBe(false);
  expect(client.snapshot().status).toBe('CONNECTED');
  client.disconnect();
});

it('closes the connection if backpressure prevents the stop message', () => {
  const {client, socket} = connectedClient();
  client.begin('run-1'); socket.reply({type: 'started', run_id: 'run-1'});
  socket.bufferedAmount = 300000;
  client.end();
  expect(socket.readyState).toBe(3);
  expect(client.snapshot().status).toBe('ERROR');
  client.disconnect();
});

it('keeps the connection timeout when a session ends during clock synchronization', () => {
  vi.useFakeTimers();
  const client = new LslClient({WebSocketClass: Socket});
  try {
    client.connect(); Socket.latest.open(); client.begin('run-1'); client.end();
    vi.advanceTimersByTime(10001);
    expect(client.snapshot().status).toBe('ERROR');
    expect(Socket.latest.readyState).toBe(3);
  } finally { client.disconnect(); vi.useRealTimers(); }
});
