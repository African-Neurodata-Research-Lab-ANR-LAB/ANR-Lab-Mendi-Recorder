import { describe, expect, it } from "vitest";
import { MENDI_CHARACTERISTICS } from "../../src/ble/gatt-profile.js";

describe("Mendi GATT characteristic UUIDs", () => {
  it("uses the full custom UUIDs exposed by Mendi V4", () => {
    expect(MENDI_CHARACTERISTICS.ABB1.uuid)
      .toBe("fc3eabb1-c6c4-49e6-922a-6e551c455af5");

    expect(MENDI_CHARACTERISTICS.ABB4.uuid)
      .toBe("fc3eabb4-c6c4-49e6-922a-6e551c455af5");

    expect(MENDI_CHARACTERISTICS.ABB5.uuid)
      .toBe("fc3eabb5-c6c4-49e6-922a-6e551c455af5");
  });
});
