export class MendiNotificationAdapter {
  constructor({ driver, acquisitionPipeline }) {
    this.driver = driver;
    this.acquisitionPipeline = acquisitionPipeline;
    this.unsubscribe = null;
  }

  connect() {
    if (!this.driver) {
      throw new Error("Mendi driver is required");
    }

    if (typeof this.driver.onPacket === "function") {
      this.unsubscribe = this.driver.onPacket((packet) => {
        this.acquisitionPipeline.process(packet);
      });
    }

    return {
      status: "connected",
      pipelineAttached: true
    };
  }

  disconnect() {
    if (typeof this.unsubscribe === "function") {
      this.unsubscribe();
      this.unsubscribe = null;
    }

    return {
      status: "disconnected"
    };
  }

  handleNotification(packet) {
    return this.acquisitionPipeline.process(packet);
  }
}
