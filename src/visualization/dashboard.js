function formatClock(value) {
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        Number(value) || 0
      )
    );

  const hours =
    Math.floor(
      totalSeconds / 3600
    );

  const minutes =
    Math.floor(
      (totalSeconds % 3600) /
        60
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
  const totalSeconds =
    Math.max(
      0,
      Math.floor(
        Number(value) || 0
      )
    );

  const minutes =
    Math.floor(
      totalSeconds / 60
    );

  const seconds =
    totalSeconds % 60;

  return [minutes, seconds]
    .map(value =>
      String(value).padStart(2, "0")
    )
    .join(":");
}

function formatSensorNumber(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  )
    ? Math.round(value)
        .toLocaleString("en-US")
    : "—";
}

function percentage(value) {
  const numeric =
    Number(value);

  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.round(
    Math.min(
      1,
      Math.max(0, numeric)
    ) * 100
  );
}

export function renderDashboard(
  root,
  state
) {
  if (!root) return;

  const setText =
    (selector, value) => {
      const elements =
        root.querySelectorAll(
          selector
        );

      for (
        const element of elements
      ) {
        element.textContent =
          String(value);
      }
    };

  const setProgress =
    (selector, value) => {
      const element =
        root.querySelector(selector);

      if (!element) return;

      const percent =
        percentage(value);

      element.style.width =
        `${percent}%`;

      element.setAttribute(
        "aria-valuenow",
        String(percent)
      );
    };

  setText(
    "[data-status]",
    state.connection
  );
  setText(
    "[data-recording]",
    state.recording
  );
  setText(
    "[data-packets]",
    state.packetCount
  );
  setText(
    "[data-quality]",
    state.quality
  );

  const battery =
    state.battery;

  setText(
    "[data-battery]",
    typeof battery?.voltageMv ===
      "number"
      ? `${(
          battery.voltageMv / 1000
        ).toFixed(3)} V`
      : "—"
  );

  setText(
    "[data-battery-detail]",
    battery
      ? [
          battery.charging
            ? "charging"
            : "not charging",
          battery.usb
            ? "USB connected"
            : "USB disconnected"
        ].join(" · ")
      : "waiting for ABB4 telemetry"
  );

  const experiment =
    state.experiment ?? {};

  const phaseElapsed =
    Number(
      experiment.phaseElapsedSeconds
    ) || 0;

  const phaseRemaining =
    Number(
      experiment.phaseRemainingSeconds
    ) || 0;

  const phaseDuration =
    phaseElapsed + phaseRemaining;

  const phaseProgress =
    phaseDuration > 0
      ? phaseElapsed / phaseDuration
      : 0;

  setText(
    "[data-session-clock]",
    formatClock(
      experiment.sessionSeconds
    )
  );

  setText(
    "[data-protocol-clock]",
    formatClock(
      experiment.protocolSeconds
    )
  );

  setText(
    "[data-session-status]",
    state.sessionStatus ?? "idle"
  );

  setText(
    "[data-current-phase]",
    experiment.phaseName ?? "—"
  );

  setText(
    "[data-current-phase-type]",
    experiment.phaseType ?? "—"
  );

  setText(
    "[data-phase-remaining]",
    formatCountdown(
      experiment
        .phaseRemainingSeconds
    )
  );

  setText(
    "[data-current-cycle]",
    experiment.cycle ?? "—"
  );

  setText(
    "[data-total-cycles]",
    experiment.totalCycles ?? "—"
  );

  setText(
    "[data-next-phase]",
    experiment.nextPhaseName ?? "—"
  );

  setText(
    "[data-phase-progress-label]",
    `${percentage(
      phaseProgress
    )}%`
  );

  setText(
    "[data-protocol-progress-label]",
    `${percentage(
      experiment.progress
    )}%`
  );

  setProgress(
    "[data-phase-progress]",
    phaseProgress
  );

  setProgress(
    "[data-protocol-progress]",
    experiment.progress
  );

  const sensor =
    state.sensor ?? {};

  setText(
    "[data-temperature]",
    typeof sensor.temperatureC ===
      "number"
      ? `${sensor.temperatureC
          .toFixed(2)} °C`
      : "—"
  );

  setText(
    "[data-decoded-frames]",
    sensor.decodedFrameCount ?? 0
  );

  setText(
    "[data-acquisition-mode]",
    sensor.acquisitionMode ??
      "WAITING"
  );

  for (
    const side of [
      "left",
      "right"
    ]
  ) {
    const channel =
      sensor[side] ?? {};

    setText(
      `[data-${side}-red]`,
      formatSensorNumber(
        channel.red
      )
    );

    setText(
      `[data-${side}-ir]`,
      formatSensorNumber(
        channel.infrared
      )
    );
  }

  const imuValues =
    sensor.imu ?? {};

  for (const [key, selector] of [
    ["accX", "[data-imu-acc-x]"],
    ["accY", "[data-imu-acc-y]"],
    ["accZ", "[data-imu-acc-z]"],
    ["gyroX", "[data-imu-gyro-x]"],
    ["gyroY", "[data-imu-gyro-y]"],
    ["gyroZ", "[data-imu-gyro-z]"]
  ]) {
    setText(
      selector,
      formatSensorNumber(
        imuValues[key]
      )
    );
  }

  const monitor =
    state.monitor ?? {};

  setText(
    "[data-monitor-elapsed]",
    monitor.elapsedSeconds ?? 0
  );

  setText(
    "[data-monitor-rate]",
    monitor.packetRateHz ?? 0
  );

  setText(
    "[data-monitor-signal]",
    monitor.signalQuality ??
      "NO SIGNAL"
  );

  const contact =
    monitor.contact ?? {};

  setText(
    "[data-monitor-left-contact]",
    contact.left ?? "unknown"
  );

  setText(
    "[data-monitor-right-contact]",
    contact.right ?? "unknown"
  );

  const channels =
    monitor.channels ?? {};

  setText(
    "[data-monitor-abb1]",
    channels.ABB1 ?? 0
  );
  setText(
    "[data-monitor-abb4]",
    channels.ABB4 ?? 0
  );
  setText(
    "[data-monitor-abb5]",
    channels.ABB5 ?? 0
  );
  setText(
    "[data-monitor-unknown]",
    channels.unknown ?? 0
  );

  const imu =
    monitor.imu ?? {
      enabled: true,
      status: "WAITING"
    };

  setText(
    "[data-monitor-imu]",
    imu.enabled
      ? imu.status
      : "DISABLED"
  );

  const automarker =
    monitor.automarker ?? {
      enabled: false,
      active: false,
      lastEvent: null
    };

  setText(
    "[data-monitor-automarker]",
    automarker.active === true
      ? "ACTIVE"
      : automarker.enabled
        ? "ENABLED"
        : "DISABLED"
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
          <div>
            <p class="eyebrow">ACQUISITION PAUSED</p>
            <h2>Session Paused</h2>
            <p><strong>Mendi disconnected</strong></p>
            <p>
              The session data are preserved. Protocol time is paused while
              the session clock continues. No automatic timeout.
            </p>
          </div>
          <div class="actions">
            <button
              type="button"
              data-recovery-reconnect
              class="button button-primary"
            >Reconnect Mendi</button>
            <button
              type="button"
              data-recovery-end
              class="button button-danger"
            >End Session</button>
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
              .querySelector(
                "#reconnect"
              )
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
