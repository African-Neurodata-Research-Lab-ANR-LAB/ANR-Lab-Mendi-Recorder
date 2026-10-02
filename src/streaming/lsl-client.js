const finite = value => typeof value === 'number' && Number.isFinite(value);

/** Optional loopback transport. No sample replay; recording never waits on it. */
export class LslClient {
  constructor({WebSocketClass = globalThis.WebSocket, now = () => performance.now()} = {}) {
    this.WebSocketClass = WebSocketClass;
    this.now = now;
    this.socket = null;
    this.runId = null;
    this.status = 'DISCONNECTED';
    this.error = '';
    this.unsentSamples = 0;
    this.synced = false;
    this.active = false;
    this.timer = null;
  }

  connect(url = 'ws://127.0.0.1:8765') {
    const parsed = new URL(url);
    if (parsed.protocol !== 'ws:' || !['localhost', '127.0.0.1'].includes(parsed.hostname)
        || parsed.username || parsed.password || parsed.search || parsed.hash || parsed.pathname !== '/') {
      throw new Error('Use a loopback bridge URL such as ws://127.0.0.1:8765.');
    }
    this.disconnect();
    this.status = 'CONNECTING'; this.error = ''; this.probes = [];
    const socket = new this.WebSocketClass(url);
    this.socket = socket;
    this.timer = setTimeout(() => this.fail('Bridge connection or clock synchronization timed out.'), 10000);
    socket.onopen = () => {
      if (this.socket !== socket) return;
      this.status = 'SYNCHRONIZING'; this.probe();
    };
    socket.onmessage = event => {
      if (this.socket !== socket) return;
      try { this.receive(JSON.parse(event.data)); }
      catch { this.fail('Invalid bridge response.'); }
    };
    socket.onerror = () => { if (this.socket === socket) this.fail('Bridge unavailable. Start Python locally and reconnect.'); };
    socket.onclose = () => {
      if (this.socket !== socket) return;
      clearTimeout(this.timer);
      this.active = false; this.synced = false;
      if (this.status !== 'ERROR') this.status = 'DISCONNECTED';
    };
  }

  probe() {
    this.probeSent = this.now();
    this.rawSend({type: 'sync', client_send_ms: this.probeSent});
  }

  receive(message) {
    if (message.type === 'sync' && !this.synced) {
      const received = this.now();
      if (message.client_send_ms !== this.probeSent || !finite(message.server_time_s)) throw new Error('Invalid clock response');
      const rtt = received - this.probeSent;
      if (rtt < 0 || rtt > 2000) throw new Error('Clock probe delay too high');
      this.probes.push({rtt, offset: message.server_time_s - (this.probeSent + received) / 2000});
      if (this.probes.length < 5) { this.probe(); return; }
      const best = this.probes.reduce((a, b) => a.rtt <= b.rtt ? a : b);
      this.offset = best.offset; this.rtt = best.rtt;
      this.synced = true; this.status = 'CONNECTED';
      clearTimeout(this.timer);
      if (this.runId) this.startRemote();
    } else if (message.type === 'started' && message.run_id === this.runId) {
      clearTimeout(this.timer);
      this.active = true; this.status = 'STREAMING';
    } else if (message.type === 'error') this.fail(String(message.message ?? 'Bridge rejected the stream.'));
  }

  rawSend(message) {
    try {
      if (this.socket?.readyState !== 1 || this.socket.bufferedAmount > 262144) return false;
      this.socket.send(JSON.stringify({schema_version: 1, ...message}));
      return true;
    } catch { return false; }
  }

  startRemote() {
    this.active = false;
    if (!this.rawSend({type: 'start', run_id: this.runId, clock_offset_s: this.offset, clock_rtt_ms: this.rtt})) {
      this.fail('Unable to start the bridge stream.'); return;
    }
    this.status = 'STARTING';
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.fail('Bridge did not acknowledge the session.'), 10000);
  }

  begin(runId) {
    this.runId = runId; this.unsentSamples = 0; this.active = false;
    if (this.synced) this.startRemote();
  }

  send(message) {
    const sent = this.active && this.rawSend({...message, run_id: this.runId});
    if (!sent && message.type === 'sample') this.unsentSamples += 1;
    return Boolean(sent);
  }

  end() {
    if (this.active) this.rawSend({type: 'stop', run_id: this.runId});
    clearTimeout(this.timer);
    this.runId = null; this.active = false;
    if (this.synced) this.status = 'CONNECTED';
  }

  fail(message) {
    this.error = message; this.status = 'ERROR';
    this.active = false; this.synced = false;
    clearTimeout(this.timer);
    this.socket?.close();
  }

  disconnect() {
    clearTimeout(this.timer);
    const socket = this.socket; this.socket = null;
    socket?.close();
    this.active = false; this.synced = false; this.status = 'DISCONNECTED';
  }

  snapshot() {
    return {status: this.status, error: this.error, unsentSamples: this.unsentSamples,
      clockRttMs: this.synced ? this.rtt : null};
  }
}
