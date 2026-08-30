export class CharacteristicManager {
  constructor(profile) {
    this.profile = profile;
    this.characteristics = new Map();
  }

  async discover(server) {
    const service = await server.getPrimaryService(this.profile.serviceUuid);
    for (const definition of Object.values(this.profile.characteristics)) {
      try {
        const characteristic = await service.getCharacteristic(definition.uuid);
        this.characteristics.set(definition.key, characteristic);
      } catch {
        // Individual characteristics may be unavailable on a hardware revision.
      }
    }
    return this.characteristics;
  }

  get(key) {
    return this.characteristics.get(key);
  }
}
