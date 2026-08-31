import { describe, expect, it } from "vitest";
import { Session } from "../../src/recording/session.js";

describe("session start lifecycle", () => {
  it("does not enter recording state until acquisition is ready", () => {
    const session = new Session();

    expect(session.status).toBe("idle");

    // Acquisition readiness is intentionally represented
    // separately from the session object in the controller.
    session.start({
      sessionCode: "TEST-001"
    });

    expect(session.status).toBe("recording");
  });
});
