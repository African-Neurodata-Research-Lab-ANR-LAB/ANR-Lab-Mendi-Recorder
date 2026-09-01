export function renderDashboard(root, state) {
  if (!root) return;

  root.querySelector("[data-status]").textContent = state.connection;
  root.querySelector("[data-recording]").textContent = state.recording;
  root.querySelector("[data-packets]").textContent = String(state.packetCount);
  root.querySelector("[data-quality]").textContent = state.quality;

  const monitor = state.monitor;

  if (!monitor) return;

  root.querySelector("[data-monitor-elapsed]").textContent =
    String(monitor.elapsedSeconds);

  root.querySelector("[data-monitor-rate]").textContent =
    String(monitor.packetRateHz);

  root.querySelector("[data-monitor-signal]").textContent =
    monitor.signalQuality;

  root.querySelector("[data-monitor-left-contact]").textContent =
    monitor.contact.left;

  root.querySelector("[data-monitor-right-contact]").textContent =
    monitor.contact.right;
}