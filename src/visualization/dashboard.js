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
}
