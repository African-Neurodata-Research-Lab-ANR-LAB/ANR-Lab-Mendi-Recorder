export class ConnectionManager {
  constructor(driver) {
    this.driver = driver;
    this.state = "disconnected";
    this.listeners = new Set();
  }

  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setState(state) {
    this.state = state;
    for (const listener of this.listeners) listener(state);
  }

  async connect() {
    this.setState("connecting");
    try {
      const device = await this.driver.connect();
      this.setState("connected");
      return device;
    } catch (error) {
      this.setState("error");
      throw error;
    }
  }

  async disconnect() {
    await this.driver.disconnect();
    this.setState("disconnected");
  }
}
