function phaseOptions(selected) {
  const options = [
    ["baseline", "Baseline"],
    ["get_ready", "Get Ready"],
    ["task", "Task"],
    ["rest", "Rest"],
    ["custom", "Custom"]
  ];

  return options
    .map(
      ([value, label]) => `
        <option
          value="${value}"
          ${
            value === selected
              ? "selected"
              : ""
          }
        >${label}</option>
      `
    )
    .join("");
}

function phaseMarkup({
  id,
  name,
  type,
  durationSeconds,
  autoMarkerEnabled
}) {
  return `
    <div
      class="phase-row"
      data-protocol-phase
      data-phase-id="${id}"
    >
      <label class="phase-field phase-name">
        <span>Phase</span>
        <input
          data-phase-name
          value="${name}"
          aria-label="Phase name"
        >
      </label>

      <label class="phase-field">
        <span>Type</span>
        <select
          data-phase-type
          aria-label="Phase type"
        >
          ${phaseOptions(type)}
        </select>
      </label>

      <label class="phase-field phase-duration">
        <span>Duration</span>
        <div class="input-suffix">
          <input
            data-phase-duration
            type="number"
            min="1"
            value="${durationSeconds}"
            aria-label="Duration seconds"
          >
          <span>s</span>
        </div>
      </label>

      <label class="check-field">
        <input
          type="checkbox"
          data-phase-automarker
          ${
            autoMarkerEnabled
              ? "checked"
              : ""
          }
        >
        <span>AutoMarker</span>
      </label>

      <div class="phase-actions">
        <button
          type="button"
          data-phase-up
          class="icon-button"
          aria-label="Move phase up"
          title="Move phase up"
        >↑</button>
        <button
          type="button"
          data-phase-down
          class="icon-button"
          aria-label="Move phase down"
          title="Move phase down"
        >↓</button>
        <button
          type="button"
          data-phase-remove
          class="icon-button icon-button-danger"
          aria-label="Remove phase"
          title="Remove phase"
        >×</button>
      </div>
    </div>
  `;
}

export function recorderMarkup() {
  return `
    <main class="shell">
      <header class="app-header">
        <div class="brand-lockup">
          <div class="brand-logo-frame">
            <img
              class="brand-logo"
              src="./anr-logo.png"
              alt="African Neurodata Research Lab logo"
            >
          </div>
          <div>
            <p class="eyebrow">AFRICAN NEURODATA RESEARCH LAB</p>
            <h1>ANR Mendi Research Recorder</h1>
            <p class="subhead">
              Raw optical acquisition · protocol timing · local research export
            </p>
            <div class="brand-contact">
              <a
                href="https://africanneurodataresearch.org/"
                target="_blank"
                rel="noreferrer"
              >africanneurodataresearch.org</a>
              <span class="brand-contact-separator">·</span>
              <a
                href="mailto:anrlab.ng@gmail.com"
              >anrlab.ng@gmail.com</a>
            </div>
          </div>
        </div>

        <div class="header-statuses">
          <div class="status-pill">
            <span class="status-dot" aria-hidden="true"></span>
            <span>Device</span>
            <strong data-status>disconnected</strong>
          </div>
          <div class="status-pill status-pill-muted">
            <span>Session</span>
            <strong data-session-status>idle</strong>
          </div>
        </div>
      </header>

      <section id="recovery"></section>

      <details class="panel setup-panel" open>
        <summary>
          <div>
            <p class="eyebrow">STEP 1</p>
            <h2>Session Setup & Protocol</h2>
          </div>
          <span class="summary-hint">Configure session</span>
        </summary>

        <form id="setup-form">
          <div class="setup-grid">
            <label class="field">
              <span>Participant Code</span>
              <input
                name="participantCode"
                autocomplete="off"
                placeholder="e.g. ANR_001"
                required
              >
            </label>

            <label class="field">
              <span>Session Code</span>
              <input
                name="sessionCode"
                autocomplete="off"
                placeholder="e.g. SES_001"
                required
              >
            </label>

            <label class="field field-wide">
              <span>Session Notes <small>optional</small></span>
              <textarea
                name="notes"
                rows="2"
                placeholder="Research notes without direct participant identifiers"
              ></textarea>
            </label>
          </div>

          <div class="protocol-builder">
            <div class="section-heading">
              <div>
                <h3>Protocol Builder</h3>
                <p>Phases run continuously after Start Session.</p>
              </div>
              <button
                type="button"
                id="add-phase"
                class="button button-secondary"
              >+ Add Phase</button>
            </div>

            <div class="phase-list">
              ${phaseMarkup({
                id: "phase-1",
                name: "Baseline",
                type: "baseline",
                durationSeconds: 30,
                autoMarkerEnabled: true
              })}

              ${phaseMarkup({
                id: "phase-2",
                name: "Task",
                type: "task",
                durationSeconds: 60,
                autoMarkerEnabled: true
              })}
            </div>

            <div class="protocol-options">
              <label class="field compact-field">
                <span>Repeat Count</span>
                <input
                  name="repeatCount"
                  type="number"
                  min="1"
                  value="1"
                >
              </label>

              <label class="check-field option-check">
                <input
                  type="checkbox"
                  name="autoMarkerEnabled"
                >
                <span>Global AutoMarker</span>
              </label>

              <label class="field compact-field">
                <span>AutoMarker Interval</span>
                <div class="input-suffix">
                  <input
                    name="autoMarkerIntervalSeconds"
                    type="number"
                    min="1"
                    value="5"
                  >
                  <span>s</span>
                </div>
              </label>

              <label class="check-field option-check">
                <input
                  type="checkbox"
                  name="imuEnabled"
                  checked
                >
                <span>Record IMU</span>
              </label>
            </div>
          </div>

          <p class="privacy">
            Use pseudonymous codes only. Do not enter names, email addresses,
            phone numbers, hospital IDs, or home addresses.
          </p>
        </form>
      </details>

      <section class="session-toolbar panel">
        <div class="toolbar-copy">
          <p class="eyebrow">ACQUISITION CONTROL</p>
          <strong>Prepare → Connect → Start</strong>
        </div>
        <div class="actions primary-actions">
          <button
            type="submit"
            form="setup-form"
            class="button button-secondary"
          >Prepare Session</button>
          <button
            type="button"
            id="connect"
            class="button button-primary"
          >Connect Mendi</button>
          <button
            type="button"
            id="start"
            class="button button-record"
          >Start Session</button>
          <button
            type="button"
            id="marker"
            class="button button-secondary"
          >+ Add Marker</button>
          <button
            type="button"
            id="stop"
            class="button button-danger"
          >End Session</button>
          <button
            type="button"
            id="reconnect"
            class="button button-quiet"
          >Reconnect</button>
        </div>
      </section>

      <section class="panel protocol-dashboard">
        <div class="protocol-hero">
          <div>
            <p class="eyebrow">CURRENT PHASE</p>
            <div class="phase-title-row">
              <h2 data-current-phase>—</h2>
              <span class="phase-type" data-current-phase-type>—</span>
            </div>
            <p>
              Next: <strong data-next-phase>—</strong>
              · Cycle
              <strong>
                <span data-current-cycle>—</span>/<span data-total-cycles>—</span>
              </strong>
            </p>
          </div>
          <div class="countdown-card">
            <span>Time Remaining</span>
            <strong data-phase-remaining>00:00</strong>
          </div>
        </div>

        <div class="progress-stack">
          <div class="progress-row">
            <div class="progress-label">
              <span>Phase progress</span>
              <strong data-phase-progress-label>0%</strong>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                data-phase-progress
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="0"
              ></div>
            </div>
          </div>
          <div class="progress-row progress-row-secondary">
            <div class="progress-label">
              <span>Protocol progress</span>
              <strong data-protocol-progress-label>0%</strong>
            </div>
            <div class="progress-track">
              <div
                class="progress-fill"
                data-protocol-progress
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="0"
              ></div>
            </div>
          </div>
        </div>

        <div class="clock-grid">
          <div class="clock-card">
            <span>Session Clock</span>
            <strong data-session-clock>00:00:00</strong>
          </div>
          <div class="clock-card">
            <span>Protocol Clock</span>
            <strong data-protocol-clock>00:00:00</strong>
          </div>
          <div class="clock-card">
            <span>Recording</span>
            <strong data-recording>idle</strong>
          </div>
        </div>
      </section>

      <section class="signal-layout">
        <div class="panel signal-panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">LIVE RAW OPTICAL SIGNAL</p>
              <h2>Left Channel</h2>
            </div>
            <div class="trace-legend" aria-label="Trace legend">
              <span><i class="legend-red"></i>Red</span>
              <span><i class="legend-ir"></i>IR/NIR</span>
            </div>
          </div>

          <div class="latest-values">
            <span>Red <strong data-left-red>—</strong></span>
            <span>IR/NIR <strong data-left-ir>—</strong></span>
          </div>

          <div class="canvas-shell">
            <canvas
              id="trace"
              width="1000"
              height="300"
              aria-label="Live left raw optical Red and IR/NIR traces"
            ></canvas>
            <div class="canvas-watermark">RAW DEVICE UNITS</div>
          </div>
        </div>

        <div class="panel signal-panel">
          <div class="section-heading">
            <div>
              <p class="eyebrow">LIVE RAW OPTICAL SIGNAL</p>
              <h2>Right Channel</h2>
            </div>
            <div class="trace-legend" aria-label="Trace legend">
              <span><i class="legend-red"></i>Red</span>
              <span><i class="legend-ir"></i>IR/NIR</span>
            </div>
          </div>

          <div class="latest-values">
            <span>Red <strong data-right-red>—</strong></span>
            <span>IR/NIR <strong data-right-ir>—</strong></span>
          </div>

          <div class="canvas-shell">
            <canvas
              id="trace-right"
              width="1000"
              height="300"
              aria-label="Live right raw optical Red and IR/NIR traces"
            ></canvas>
            <div class="canvas-watermark">RAW DEVICE UNITS</div>
          </div>
        </div>
      </section>

      <section class="sensor-grid">
        <article class="sensor-card sensor-card-featured">
          <span>Mendi Sensor Temperature</span>
          <strong data-temperature>—</strong>
          <small>Device sensor temperature · not body temperature</small>
        </article>

        <article class="sensor-card">
          <span>Battery Voltage</span>
          <strong data-battery>—</strong>
          <small data-battery-detail>waiting for ABB4 telemetry</small>
        </article>

        <article class="sensor-card">
          <span>Signal State</span>
          <strong data-quality>NO SIGNAL</strong>
          <small>Technical acquisition state</small>
        </article>

        <article class="sensor-card">
          <span>Decoded Frames</span>
          <strong data-decoded-frames>0</strong>
          <small>Validated ABB1 frames</small>
        </article>

        <article class="sensor-card">
          <span>Raw Packets</span>
          <strong data-packets>0</strong>
          <small>All subscribed characteristics</small>
        </article>

        <article class="sensor-card">
          <span>Optical Acquisition</span>
          <strong data-acquisition-mode>WAITING</strong>
          <small>NOTIFY preferred · POLL is read-only fallback</small>
        </article>
      </section>

      <section class="panel imu-live-panel">
        <div class="section-heading imu-live-heading">
          <div>
            <p class="eyebrow">LIVE HEAD MOVEMENT</p>
            <h2>Raw IMU Monitor</h2>
            <p>
              Accelerometer and gyroscope fields decoded from the same ABB1
              frame as the optical data.
            </p>
          </div>
          <span class="acquisition-mode-badge">
            Optical source:
            <strong data-acquisition-mode>WAITING</strong>
          </span>
        </div>

        <div class="imu-live-grid">
          <div class="imu-live-value">
            <span>Accel X</span>
            <strong data-imu-acc-x>—</strong>
          </div>
          <div class="imu-live-value">
            <span>Accel Y</span>
            <strong data-imu-acc-y>—</strong>
          </div>
          <div class="imu-live-value">
            <span>Accel Z</span>
            <strong data-imu-acc-z>—</strong>
          </div>
          <div class="imu-live-value">
            <span>Gyro X</span>
            <strong data-imu-gyro-x>—</strong>
          </div>
          <div class="imu-live-value">
            <span>Gyro Y</span>
            <strong data-imu-gyro-y>—</strong>
          </div>
          <div class="imu-live-value">
            <span>Gyro Z</span>
            <strong data-imu-gyro-z>—</strong>
          </div>
        </div>

        <p class="imu-live-note">
          Raw device values only. The recorder does not infer calibrated g,
          degrees/s, head pose, or clinical movement measures.
        </p>
      </section>

      <details class="panel technical-monitor">
        <summary>
          <div>
            <p class="eyebrow">ADVANCED</p>
            <h2>Technical Diagnostics</h2>
          </div>
          <span class="summary-hint">Packet & hardware details</span>
        </summary>

        <p class="warning">
          Technical monitoring only. These values describe device communication
          and acquisition. The recorder does not estimate HbO/HbR, neural
          activation, cognition, diagnosis, or clinical state.
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
            <span>Signal</span>
            <strong data-monitor-signal>NO SIGNAL</strong>
          </div>
          <div class="monitor-card">
            <span>Left Contact</span>
            <strong data-monitor-left-contact>unknown</strong>
          </div>
          <div class="monitor-card">
            <span>Right Contact</span>
            <strong data-monitor-right-contact>unknown</strong>
          </div>
        </div>

        <h3>Characteristic Packet Monitor</h3>
        <div class="channel-grid">
          <div class="channel-card"><span>ABB1 Frame</span><strong data-monitor-abb1>0</strong></div>
          <div class="channel-card"><span>ABB4 ADC</span><strong data-monitor-abb4>0</strong></div>
          <div class="channel-card"><span>ABB5 Diagnostics</span><strong data-monitor-abb5>0</strong></div>
          <div class="channel-card"><span>Unknown</span><strong data-monitor-unknown>0</strong></div>
        </div>

        <h3>Raw Head-Movement IMU</h3>
        <p class="diagnostic-note">
          Raw accelerometer and gyroscope values from ABB1. These are displayed
          for acquisition monitoring only; physical units/calibration are not
          inferred here.
        </p>
        <div class="hardware-grid imu-grid">
          <div class="monitor-card"><span>Accel X</span><strong data-imu-acc-x>—</strong></div>
          <div class="monitor-card"><span>Accel Y</span><strong data-imu-acc-y>—</strong></div>
          <div class="monitor-card"><span>Accel Z</span><strong data-imu-acc-z>—</strong></div>
          <div class="monitor-card"><span>Gyro X</span><strong data-imu-gyro-x>—</strong></div>
          <div class="monitor-card"><span>Gyro Y</span><strong data-imu-gyro-y>—</strong></div>
          <div class="monitor-card"><span>Gyro Z</span><strong data-imu-gyro-z>—</strong></div>
        </div>

        <h3>Hardware & Marker Status</h3>
        <div class="hardware-grid">
          <div class="monitor-card">
            <span>IMU</span>
            <strong data-monitor-imu>WAITING</strong>
          </div>
          <div class="monitor-card">
            <span>AutoMarker</span>
            <strong data-monitor-automarker>DISABLED</strong>
          </div>
          <div class="monitor-card">
            <span>Last Event</span>
            <strong data-monitor-last-event>NONE</strong>
          </div>
        </div>
      </details>

      <section class="panel markers-panel">
        <div class="section-heading">
          <div>
            <p class="eyebrow">EVENT LOG</p>
            <h2>Recent Markers</h2>
          </div>
        </div>
        <ol id="markers" class="marker-list"></ol>
      </section>

      <footer>
        <div>
          <strong>African NeuroData Research Lab</strong>
          <span>Research use only · local browser processing</span>
        </div>
        <div>
          <a href="https://africanneurodataresearch.org/" target="_blank" rel="noreferrer">africanneurodataresearch.org</a>
          <a href="mailto:anrlab.ng@gmail.com">anrlab.ng@gmail.com</a>
        </div>
      </footer>
    </main>
  `;
}

export function wireProtocolBuilder(
  root
) {
  const addButton =
    root.querySelector("#add-phase");

  if (!addButton) return;

  addButton.addEventListener(
    "click",
    () => {
      const phases =
        Array.from(
          root.querySelectorAll(
            "[data-protocol-phase]"
          )
        );

      const template =
        phases.at(-1);

      if (!template) return;

      const phase =
        template.cloneNode(true);

      const nextNumber =
        phases.length + 1;

      phase.dataset.phaseId =
        `phase-${nextNumber}`;

      phase
        .querySelector(
          "[data-phase-name]"
        )
        .value = "Custom";

      phase
        .querySelector(
          "[data-phase-type]"
        )
        .value = "custom";

      phase
        .querySelector(
          "[data-phase-duration]"
        )
        .value = "60";

      phase
        .querySelector(
          "[data-phase-automarker]"
        )
        .checked = true;

      const phaseList =
        root.querySelector(
          ".phase-list"
        );

      if (phaseList) {
        phaseList.appendChild(phase);
      } else {
        addButton.before(phase);
      }
    }
  );

  root.addEventListener(
    "change",
    event => {
      const type =
        event.target.closest(
          "[data-phase-type]"
        );

      if (!type) return;

      const phase =
        type.closest(
          "[data-protocol-phase]"
        );

      if (!phase) return;

      if (
        type.value === "get_ready"
      ) {
        const autoMarker =
          phase.querySelector(
            "[data-phase-automarker]"
          );

        if (autoMarker) {
          autoMarker.checked = false;
        }
      }
    }
  );

  root.addEventListener(
    "click",
    event => {
      const phase =
        event.target.closest(
          "[data-protocol-phase]"
        );

      if (!phase) return;

      if (
        event.target.closest(
          "[data-phase-up]"
        )
      ) {
        const previous =
          phase.previousElementSibling;

        if (
          previous?.matches(
            "[data-protocol-phase]"
          )
        ) {
          phase.parentElement
            .insertBefore(
              phase,
              previous
            );
        }

        return;
      }

      if (
        event.target.closest(
          "[data-phase-down]"
        )
      ) {
        const next =
          phase.nextElementSibling;

        if (
          next?.matches(
            "[data-protocol-phase]"
          )
        ) {
          phase.parentElement
            .insertBefore(
              next,
              phase
            );
        }

        return;
      }

      if (
        event.target.closest(
          "[data-phase-remove]"
        )
      ) {
        phase.remove();
      }
    }
  );
}

export function mountRecorder(root) {
  root.innerHTML =
    recorderMarkup();

  wireProtocolBuilder(root);
}

export function setProtocolBuilderLocked(
  root,
  locked
) {
  if (!root) return;

  const controls =
    root.querySelectorAll(`
      [data-protocol-phase] input,
      [data-protocol-phase] select,
      [data-protocol-phase] button,
      #add-phase,
      [name="repeatCount"],
      [name="autoMarkerEnabled"],
      [name="autoMarkerIntervalSeconds"]
    `);

  for (const control of controls) {
    control.disabled =
      Boolean(locked);
  }
}
