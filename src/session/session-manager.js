export class SessionManager {
  constructor() {
    this.session = null;
  }

  start(metadata = {}) {
    this.session = {
      id: `MENDI-${Date.now()}`,
      startedAt: new Date().toISOString(),
      status: "recording",
      metadata
    };

    return this.getSession();
  }

  stop() {
    if (!this.session) return null;

    this.session.status = "completed";
    this.session.endedAt = new Date().toISOString();

    return this.getSession();
  }

  update(metadata = {}) {
    if (!this.session) return null;

    this.session.metadata = {
      ...this.session.metadata,
      ...metadata
    };

    return this.getSession();
  }

  getSession() {
    if (!this.session) return null;
    return structuredClone(this.session);
  }

  isActive() {
    return this.session?.status === "recording";
  }
}
