import { MENDI_CHARACTERISTICS } from "./gatt-profile.js";

export function isMendiCharacteristic(uuid, key) {
  const definition = MENDI_CHARACTERISTICS[key];

  if (!definition || !uuid) {
    return false;
  }

  return uuid.toLowerCase() === definition.uuid.toLowerCase();
}
