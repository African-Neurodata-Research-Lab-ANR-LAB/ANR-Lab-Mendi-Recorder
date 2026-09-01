import { describe, expect, it } from "vitest";
import { isMendiCharacteristic } from "../../src/ble/characteristic-utils.js";

describe("Mendi characteristic routing", () => {
  it("recognizes the full UUID for ABB1 frame data", () => {
    expect(
      isMendiCharacteristic(
        "fc3eabb1-c6c4-49e6-922a-6e551c455af5",
        "ABB1"
      )
    ).toBe(true);
  });

  it("does not confuse ABB4 telemetry with ABB1 frame data", () => {
    expect(
      isMendiCharacteristic(
        "fc3eabb4-c6c4-49e6-922a-6e551c455af5",
        "ABB1"
      )
    ).toBe(false);
  });
});
