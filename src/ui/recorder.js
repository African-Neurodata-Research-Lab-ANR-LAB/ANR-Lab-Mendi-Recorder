export function recorderMarkup() {
  return `
    <main class="shell">
      <header>
        <div>
          <p class="eyebrow">AFRICAN NEURODATA RESEARCH LAB</p>
          <h1>ANR Lab Mendi Recorder</h1>
          <p>Research acquisition only Ã‚Â· raw-first Ã‚Â· local processing</p>
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
                        <div class="protocol-builder">
              <h3>Protocol Builder</h3>

              <div
                data-protocol-phase
                data-phase-id="phase-1"
              >
                <input
                  data-phase-name
                  value="Baseline"
                  aria-label="Phase name"
                >

                <select
                  data-phase-type
                  aria-label="Phase type"
                >
                  <option
                    value="baseline"
                    selected
                  >
                    Baseline
                  </option>
                  <option value="get_ready">
                    Get Ready
                  </option>
                  <option value="task">
                    Task
                  </option>
                  <option value="rest">
                    Rest
                  </option>
                  <option value="custom">
                    Custom
                  </option>
                </select>

                <input
                  data-phase-duration
                  type="number"
                  min="1"
                  value="30"
                  aria-label="Duration seconds"
                >

                <label>
                  AutoMarker
                  <input
                    type="checkbox"
                    data-phase-automarker
                    checked
                  >
                </label>
              </div>

              <div
                data-protocol-phase
                data-phase-id="phase-2"
              >
                <input
                  data-phase-name
                  value="Task"
                  aria-label="Phase name"
                >

                <select
                  data-phase-type
                  aria-label="Phase type"
                >
                  <option value="baseline">
                    Baseline
                  </option>
                  <option value="get_ready">
                    Get Ready
                  </option>
                  <option
                    value="task"
                    selected
                  >
                    Task
                  </option>
                  <option value="rest">
                    Rest
                  </option>
                  <option value="custom">
                    Custom
                  </option>
                </select>

                <input
                  data-phase-duration
                  type="number"
                  min="1"
                  value="60"
                  aria-label="Duration seconds"
                >

                <label>
                  AutoMarker
                  <input
                    type="checkbox"
                    data-phase-automarker
                    checked
                  >
                </label>
              </div>

              <label>
                Repeat Count
                <input
                  name="repeatCount"
                  type="number"
                  min="1"
                  value="1"
                >
              </label>

              <label>
                Global AutoMarker
                <input
                  type="checkbox"
                  name="autoMarkerEnabled"
                >
              </label>

              <label>
                AutoMarker Interval (seconds)
                <input
                  name="autoMarkerIntervalSeconds"
                  type="number"
                  min="1"
                  value="5"
                >
              </label>
            </div>
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
        <div><span>Battery</span><strong data-battery>Ã¢â‚¬â€</strong></div>
      </section>

      <section class="panel technical-monitor">
  <h2>Live Technical Monitor</h2>

  <p class="warning">
    Technical monitoring only. Values represent device communication,
    signal quality, and acquisition status. This system does not estimate
    neural activation, cognition, diagnosis, or clinical state.
  </p>

  <div class="monitor-grid">

    <div class="monitor-card">
      <span>Elapsed Time</span>
      <strong data-monitor-elapsed>0</strong>
      <small>seconds</small>
    </div>

    <div class="monitor-card">
      <span>Packet Rate</span>
      <strong data-monitor-rate>0</strong>
      <small>Hz</small>
    </div>

    <div class="monitor-card">
      <span>Signal Quality</span>
      <strong data-monitor-signal>NO SIGNAL</strong>
    </div>

    <div class="monitor-card">
      <span>Left Contact</span>
      <strong data-monitor-left-contact>
        unknown
      </strong>
    </div>

    <div class="monitor-card">
      <span>Right Contact</span>
      <strong data-monitor-right-contact>
        unknown
      </strong>
    </div>

  </div>


  <h3>Optical Channel Packet Monitor</h3>

  <div class="channel-grid">

    <div class="channel-card">
      <span>ABB1</span>
      <strong data-monitor-abb1>0</strong>
    </div>

    <div class="channel-card">
      <span>ABB4</span>
      <strong data-monitor-abb4>0</strong>
    </div>

    <div class="channel-card">
      <span>ABB5</span>
      <strong data-monitor-abb5>0</strong>
    </div>

    <div class="channel-card">
      <span>Unknown</span>
      <strong data-monitor-unknown>0</strong>
    </div>

  </div>


  <h3>Hardware Status</h3>

  <div class="hardware-grid">

    <div class="monitor-card">
      <span>IMU</span>
      <strong data-monitor-imu>
        NOT AVAILABLE
      </strong>
    </div>


    <div class="monitor-card">
      <span>AutoMarker</span>
      <strong data-monitor-automarker>
        DISABLED
      </strong>
    </div>


    <div class="monitor-card">
      <span>Last Event</span>
      <strong data-monitor-last-event>
        NONE
      </strong>
    </div>

  </div>


  <canvas
    id="trace"
    width="1000"
    height="260"
    aria-label="Technical signal trace">
  </canvas>

</section>

      <section class="panel">
        <h2>Recent Markers</h2>
        <ol id="markers"></ol>
      </section>

      <section id="recovery"></section>
      <footer>ANR Lab Ã‚Â· Research use only Ã‚Â· Recorder and Analyzer are separate systems</footer>
    </main>
  `;
}

