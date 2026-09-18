export class NotificationPipeline {
  constructor({
    streamManager,
    validator,
    qualityEngine,
    packetInspector,
    watchdog
  }) {
    this.streamManager = streamManager;
    this.validator = validator;
    this.qualityEngine = qualityEngine;
    this.packetInspector = packetInspector;
    this.watchdog = watchdog;
  }

  process(packet) {
    const validation = this.validator.validate(packet);

    this.packetInspector.inspect(packet, validation);

    const quality = this.qualityEngine.update(validation);

    this.watchdog.recordPacket();

    const enrichedPacket = {
      packet,
      validation,
      quality
    };

    this.streamManager.publish(enrichedPacket);

    return enrichedPacket;
  }
}
