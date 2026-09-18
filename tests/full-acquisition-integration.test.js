import { NotificationPipeline } from "../src/ble/notification-pipeline.js";
import { MendiWatchdog } from "../src/ble/mendi-watchdog.js";
import { StreamManager } from "../src/stream/stream-manager.js";
import { FrameValidator } from "../src/qc/frame-validator.js";
import { PacketInspector } from "../src/qc/packet-inspector.js";
import { StreamQualityEngine } from "../src/qc/stream-quality-engine.js";

export function runIntegrationTest() {
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

  const mockABB1Frame = new Uint8Array([
    0x41, 0x42, 0x42, 0x31,
    0x01, 0x02, 0x03
  ]);

  pipeline.process(mockABB1Frame, Date.now());

  return {
    passed: Boolean(received),
    validation: received?.validation,
    quality: received?.quality,
    packets: packetInspector.getReport(),
    watchdog: watchdog.getState()
  };
}
