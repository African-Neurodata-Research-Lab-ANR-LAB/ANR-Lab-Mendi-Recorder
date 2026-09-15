function formatClock(value) {
  const totalSeconds = Math.max(
    0,
    Math.floor(Number(value) || 0)
  );

  const hours = Math.floor(
    totalSeconds / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return [
    hours,
    minutes,
    seconds
  ]
    .map(value =>
      String(value).padStart(2, "0")
    )
    .join(":");
}

function formatCountdown(value) {
  const totalSeconds = Math.max(
    0,
    Math.floor(Number(value) || 0)
  );

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds =
    totalSeconds % 60;

  return [
    minutes,
    seconds
  ]
    .map(value =>
      String(value).padStart(2, "0")
    )
    .join(":");
}
export function renderDashboard(root, state) {
  if (!root) return;

  const setText = (selector, value) => {
    const element = root.querySelector(selector);

    if (element) {
      element.textContent = String(value);
    }
  };

  setText("[data-status]", state.connection);
  setText("[data-recording]", state.recording);
  setText("[data-packets]", state.packetCount);
  setText("[data-quality]", state.quality);

  const experiment =
    state.experiment ?? {};

  setText(
    "[data-session-clock]",
    formatClock(experiment.sessionSeconds)
  );

  setText(
    "[data-protocol-clock]",
    formatClock(experiment.protocolSeconds)
  );

  setText(
    "[data-session-status]",
    state.sessionStatus ?? "idle"
  );

  setText(
    "[data-current-phase]",
    experiment.phaseName ?? "-"
  );

  setText(
    "[data-current-phase-type]",
    experiment.phaseType ?? "-"
  );

  setText(
    "[data-phase-remaining]",
    formatCountdown(
      experiment.phaseRemainingSeconds
    )
  );

  setText(
    "[data-current-cycle]",
    experiment.cycle ?? "-"
  );

  setText(
    "[data-total-cycles]",
    experiment.totalCycles ?? "-"
  );

  setText(
    "[data-next-phase]",
    experiment.nextPhaseName ?? "-"
  );
  const monitor = state.monitor ?? {};

  setText("[data-monitor-elapsed]", monitor.elapsedSeconds ?? 0);
  setText("[data-monitor-rate]", monitor.packetRateHz ?? 0);
  setText("[data-monitor-signal]", monitor.signalQuality ?? "NO SIGNAL");

  const contact = monitor.contact ?? {};

  setText(
    "[data-monitor-left-contact]",
    contact.left ?? "unknown"
  );

  setText(
    "[data-monitor-right-contact]",
    contact.right ?? "unknown"
  );

  const channels = monitor.channels ?? {};

  setText("[data-monitor-abb1]", channels.ABB1 ?? 0);
  setText("[data-monitor-abb4]", channels.ABB4 ?? 0);
  setText("[data-monitor-abb5]", channels.ABB5 ?? 0);
  setText("[data-monitor-unknown]", channels.unknown ?? 0);

  const imu = monitor.imu ?? {
    enabled: true,
    status: "NOT AVAILABLE"
  };

  setText(
    "[data-monitor-imu]",
    imu.enabled ? imu.status : "DISABLED"
  );

  const automarker = monitor.automarker ?? {
    enabled: true,
    lastEvent: null
  };

  setText(
    "[data-monitor-automarker]",
    automarker.enabled ? "ENABLED" : "DISABLED"
  );

  setText(
    "[data-monitor-last-event]",
    automarker.lastEvent ?? "NONE"
  );
  const recovery =
    root.querySelector("#recovery");

  if (recovery) {
    if (
      state.sessionStatus ===
      "paused_disconnected"
    ) {
      recovery.innerHTML = `
        <section class="panel recovery-panel">
          <h2>Session Paused</h2>
          <p><strong>Mendi disconnected</strong></p>
          <p>Waiting for device reconnection...</p>
          <p>No automatic timeout</p>
          <div class="actions">
            <button
              type="button"
              data-recovery-reconnect
            >
              Reconnect Mendi
            </button>
            <button
              type="button"
              data-recovery-end
            >
              End Session
            </button>
          </div>
        </section>
      `;

      recovery
        .querySelector(
          "[data-recovery-reconnect]"
        )
        ?.addEventListener(
          "click",
          () =>
            root
              .querySelector("#reconnect")
              ?.click()
        );

      recovery
        .querySelector(
          "[data-recovery-end]"
        )
        ?.addEventListener(
          "click",
          () =>
            root
              .querySelector("#stop")
              ?.click()
        );
    } else {
      recovery.innerHTML = "";
    }
  }
}
