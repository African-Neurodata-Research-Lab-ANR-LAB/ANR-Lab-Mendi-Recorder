export function recorderMarkup() {
  return `
    <main class="shell">
      <header>
        <div>
          <p class="eyebrow">AFRICAN NEURODATA RESEARCH LAB</p>
          <h1>ANR Lab Mendi Recorder</h1>
          <p>Research acquisition only Â· raw-first Â· local processing</p>
        </div>
        <div class="status-card">
          <span>Device</span>
          <strong data-status>disconnected</strong>
        </div>
      </header>

      <section class="panel">
        <h2>Session Setup</h2>
        <form id="setup-form">
          <div class="grid">
            <label>Participant Code<input name="participantCode" autocomplete="off" required></label>
            <label>Session Code<input name="sessionCode" autocomplete="off" required></label>
            <label>Protocol<input name="protocol" required></label>
            <label>IMU<input type="checkbox" name="imuEnabled" checked></label>
          </div>
          <label>Notes<textarea name="notes"></textarea></label>
          <p class="privacy">Use pseudonymous codes. Do not enter names, emails, phone numbers, hospital IDs, or addresses.</p>
          <div class="actions">
            <button type="submit">Prepare Session</button>
            <button type="button" id="connect">Connect Mendi</button>
            <button type="button" id="start">Start Recording</button>
            <button type="button" id="stop">Stop Recording</button>
            <button type="button" id="marker">Add Marker</button>
          </div>
        </form>
      </section>

      <section class="metrics">
        <div><span>Recording</span><strong data-recording>idle</strong></div>
        <div><span>Packets</span><strong data-packets>0</strong></div>
        <div><span>Quality</span><strong data-quality>NO SIGNAL</strong></div>
        <div><span>Battery</span><strong data-battery>â€”</strong></div>
      </section>

      <section class="panel">
        <h2>Live Technical Monitor</h2>
        <p>This display is technical monitoring only. It does not estimate neural activation, cognition, or clinical state.</p>
        <canvas id="trace" width="1000" height="260" aria-label="Technical signal trace"></canvas>
      </section>

      <section class="panel">
        <h2>Recent Markers</h2>
        <ol id="markers"></ol>
      </section>

      <section id="recovery"></section>
      <footer>ANR Lab Â· Research use only Â· Recorder and Analyzer are separate systems</footer>
    </main>
  `;
}
