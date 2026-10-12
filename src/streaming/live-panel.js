const value = (n, unit = '') => typeof n === 'number' && Number.isFinite(n) ? `${n.toFixed(1)}${unit}` : '—';

export function renderLivePanel(root, health, bridge) {
  const set = (key, text) => {
    const element = root.querySelector(`[data-live-${key}]`);
    if (element) element.textContent = text;
  };
  set('status', health.status);
  set('age', health.dataAgeMs === null ? '—' : value(health.dataAgeMs / 1000, ' s'));
  set('change-age', health.changeAgeMs === null ? '—' : value(health.changeAgeMs / 1000, ' s'));
  set('rate', value(health.arrivalRateHz, ' /s'));
  set('repeats', String(health.consecutiveRepeats));
  set('movement', `Acc Δ ${value(health.accelerationDelta)} · Gyro Δ ${value(health.gyroDelta)}`);
  set('bridge', bridge.status);
  set('unsent', String(bridge.unsentSamples));
  set('rtt', value(bridge.clockRttMs, ' ms'));
  set('bridge-error', bridge.error || '');
  const warning = health.status === 'STALE'
    ? 'Optical data has stopped arriving. Check the headset connection.'
    : health.status === 'REPEATED VALUES'
      ? 'Optical and IMU values are repeating. Check contact and movement; these may be cached frames.' : '';
  set('warning', warning);
  const disconnect = root.querySelector('#bridge-disconnect');
  if (disconnect) disconnect.disabled = ['DISCONNECTED', 'ERROR'].includes(bridge.status);
}
