export function renderDashboard(root, state) {
  if (!root) return;

  root.querySelector("[data-status]").textContent = state.connection;
  root.querySelector("[data-recording]").textContent = state.recording;
  root.querySelector("[data-packets]").textContent = String(state.packetCount);
  root.querySelector("[data-quality]").textContent = state.quality;
}
