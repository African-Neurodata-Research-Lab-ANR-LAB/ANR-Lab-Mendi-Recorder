import { describe, expect, it } from 'vitest';
import { NotificationPipeline } from "../src/ble/notification-pipeline.js";
import { MendiWatchdog } from "../src/ble/mendi-watchdog.js";
import { StreamManager } from "../src/stream/stream-manager.js";
import { FrameValidator } from "../src/qc/frame-validator.js";
import { PacketInspector } from "../src/qc/packet-inspector.js";
import { StreamQualityEngine } from "../src/qc/stream-quality-engine.js";

function runIntegrationTest() {
  const streamManager = new StreamManager();
  const validator = new FrameValidator();
  const packetInspector = new PacketInspector();
  const qualityEngine = new StreamQualityEngine();
  const watchdog = new MendiWatchdog();

  const pipeline = new NotificationPipeline({
    streamManager,
    validator,
    qualityEngine,
    packetInspector,
    watchdog
  });

  let received = null;

  streamManager.subscribe((packet) => {
    received = packet;
  });

  pipeline.process(new Uint8Array([
    0x41, 0x42, 0x42, 0x31,
    0x01, 0x02, 0x03
  ]), Date.now());

  return received;
}

describe('Mendi acquisition integration', () => {
  it('runs the ABB1 frame through the acquisition pipeline', () => {
    const result = runIntegrationTest();

    expect(result).not.toBeNull();
    expect(result.validation).toBeDefined();
    expect(result.quality).toBeDefined();
  });
});
