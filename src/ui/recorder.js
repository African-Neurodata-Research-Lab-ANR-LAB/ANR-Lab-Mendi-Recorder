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

                <div class="phase-actions">
                  <button
                    type="button"
                    data-phase-up
                    aria-label="Move phase up"
                  >
                    Move Up
                  </button>

                  <button
                    type="button"
                    data-phase-down
                    aria-label="Move phase down"
                  >
                    Move Down
                  </button>

                  <button
                    type="button"
                    data-phase-remove
                    aria-label="Remove phase"
                  >
                    Remove
                  </button>
                </div>
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

                <div class="phase-actions">
                  <button
                    type="button"
                    data-phase-up
                    aria-label="Move phase up"
                  >
                    Move Up
                  </button>

                  <button
                    type="button"
                    data-phase-down
                    aria-label="Move phase down"
                  >
                    Move Down
                  </button>

                  <button
                    type="button"
                    data-phase-remove
                    aria-label="Remove phase"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <button
                type="button"
                id="add-phase"
              >
                Add Phase
              </button>

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

      <section class="panel protocol-dashboard">
        <h2>Protocol Session</h2>

        <div class="protocol-session-grid">
          <div>
            <span>Session Clock</span>
            <strong data-session-clock>00:00:00</strong>
          </div>

          <div>
            <span>Protocol Clock</span>
            <strong data-protocol-clock>00:00:00</strong>
          </div>

          <div>
            <span>Status</span>
            <strong data-session-status>idle</strong>
          </div>

          <div>
            <span>Current Phase</span>
            <strong data-current-phase>-</strong>
          </div>

          <div>
            <span>Phase Type</span>
            <strong data-current-phase-type>-</strong>
          </div>

          <div>
            <span>Time Remaining</span>
            <strong data-phase-remaining>00:00</strong>
          </div>

          <div>
            <span>Cycle</span>
            <strong>
              <span data-current-cycle>-</span>
              /
              <span data-total-cycles>-</span>
            </strong>
          </div>

          <div>
            <span>Next Phase</span>
            <strong data-next-phase>-</strong>
          </div>
        </div>
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



export function wireProtocolBuilder(root) {
  const addButton =
    root.querySelector("#add-phase");

  if (!addButton) return;

  addButton.addEventListener(
    "click",
    () => {
      const phases = Array.from(
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
        .querySelector("[data-phase-name]")
        .value = "Custom";

      phase
        .querySelector("[data-phase-type]")
        .value = "custom";

      phase
        .querySelector("[data-phase-duration]")
        .value = "60";

      phase
        .querySelector("[data-phase-automarker]")
        .checked = true;

      addButton.before(phase);
    }
  );

  root.addEventListener(
    "change",
    (event) => {
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

      if (type.value === "get_ready") {
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
    (event) => {
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
          phase.parentElement.insertBefore(
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
          phase.parentElement.insertBefore(
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
  root.innerHTML = recorderMarkup();
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
    control.disabled = Boolean(locked);
  }
}
