export class CharacteristicManager {
  constructor(profile) {
    this.profile = profile;
    this.characteristics = new Map();
  }

  async discover(server) {
    const service = await server.getPrimaryService(this.profile.serviceUuid);

    console.log("[MENDI DIAGNOSTIC] Service UUID:", service.uuid);

    try {
      const exposed = await service.getCharacteristics();

      console.log(
        "[MENDI DIAGNOSTIC] Characteristics exposed by physical device:"
      );

      console.table(
        exposed.map((characteristic) => ({
          uuid: characteristic.uuid,
          properties: Object.keys(characteristic.properties)
            .filter((key) => characteristic.properties[key])
            .join(", ")
        }))
      );
    } catch (error) {
      console.warn(
        "[MENDI DIAGNOSTIC] Could not enumerate characteristics:",
        error
      );
    }

    for (const definition of Object.values(this.profile.characteristics)) {
      try {
        console.log(
          `[MENDI DIAGNOSTIC] Requesting ${definition.key}: ${definition.uuid}`
        );

        const characteristic = await service.getCharacteristic(
          definition.uuid
        );

        console.log(
          `[MENDI DIAGNOSTIC] FOUND ${definition.key}:`,
          characteristic.uuid
        );

        this.characteristics.set(definition.key, characteristic);
      } catch (error) {
        console.warn(
          `[MENDI DIAGNOSTIC] MISSING ${definition.key}: ${definition.uuid}`,
          error
        );
      }
    }

    console.log(
      "[MENDI DIAGNOSTIC] Final discovered keys:",
      [...this.characteristics.keys()]
    );

    return this.characteristics;
  }

  get(key) {
    return this.characteristics.get(key);
  }
}
