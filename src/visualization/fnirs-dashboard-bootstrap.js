import { HbDualChannelRenderer } from './hb-dual-channel-renderer.js';
import { FnirsDashboardLayout } from './fnirs-dashboard-layout.js';

/**
 * Connects the fNIRS visualization layer to the application runtime.
 * Keeps acquisition code independent from rendering code.
 */
export function initializeFnirsDashboard({
  hbStream,
  leftCanvas,
  rightCanvas,
  dashboardRoot,
}) {
  const renderer = new HbDualChannelRenderer({
    leftCanvas,
    rightCanvas,
  });

  const dashboard = new FnirsDashboardLayout({
    root: dashboardRoot,
  });

  hbStream.subscribe((sample) => {
    renderer.update(sample);

    dashboard.update({
      leftHbO: sample.left?.hbo ?? 0,
      leftHbR: sample.left?.hbr ?? 0,
      rightHbO: sample.right?.hbo ?? 0,
      rightHbR: sample.right?.hbr ?? 0,
      frames: hbStream.frames ?? 0,
      sampleRate: hbStream.sampleRate ?? 0,
      quality: hbStream.quality ?? 'UNKNOWN',
    });
  });

  return {
    renderer,
    dashboard,
  };
}
