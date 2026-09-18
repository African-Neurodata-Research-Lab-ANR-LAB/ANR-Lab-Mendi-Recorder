export class AcquisitionPipeline {
  constructor({
    notificationPipeline,
    streamManager,
    sessionManager
  }) {
    this.notificationPipeline = notificationPipeline;
    this.streamManager = streamManager;
    this.sessionManager = sessionManager;
    this.running = false;
  }

  start(metadata = {}) {
    this.sessionManager.start(metadata);
    this.streamManager.start();
    this.running = true;

    return {
      status: "running",
      session: this.sessionManager.getSession()
    };
  }

  process(packet) {
    if (!this.running) {
      throw new Error("Acquisition pipeline is not running");
    }

    return this.notificationPipeline.process(packet);
  }

  stop() {
    this.running = false;
    this.streamManager.stop();
    this.sessionManager.stop();

    return {
      status: "stopped",
      session: this.sessionManager.getSession()
    };
  }

  getState() {
    return {
      running: this.running,
      session: this.sessionManager.getSession(),
      stream: this.streamManager.getState()
    };
  }
}
