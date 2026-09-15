function readVarint(bytes, start) {
  let value = 0n;
  let shift = 0n;
  let offset = start;

  while (offset < bytes.length) {
    const byte = BigInt(bytes[offset]);
    offset += 1;

    value |= (byte & 0x7fn) << shift;

    if ((byte & 0x80n) === 0n) {
      return { value, offset };
    }

    shift += 7n;

    if (shift > 70n) {
      throw new Error(
        "Invalid protobuf varint."
      );
    }
  }

  throw new Error(
    "Unexpected end of protobuf varint."
  );
}

function skipField(raw, offset, wireType) {
  if (wireType === 0) {
    return readVarint(raw, offset).offset;
  }

  if (wireType === 1) {
    return offset + 8;
  }

  if (wireType === 5) {
    return offset + 4;
  }

  if (wireType === 2) {
    const length =
      readVarint(raw, offset);

    return (
      length.offset +
      Number(length.value)
    );
  }

  throw new Error(
    `Unsupported protobuf wire type: ${wireType}`
  );
}

/**
 * Decode Mendi V4 ABB4 Adc protobuf.
 * voltage is device supply voltage in millivolts.
 */
export function decodeAdc(bytes) {
  const raw =
    Uint8Array.from(bytes ?? []);

  const result = {
    rawBytes: Array.from(raw),
    voltage: null,
    charging: false,
    usb: false,
    decoded: false
  };

  let offset = 0;
  let recognized = 0;

  try {
    while (offset < raw.length) {
      const tag =
        readVarint(raw, offset);

      offset = tag.offset;

      const fieldNumber =
        Number(tag.value >> 3n);

      const wireType =
        Number(tag.value & 7n);

      if (
        wireType === 0 &&
        fieldNumber >= 1 &&
        fieldNumber <= 3
      ) {
        const value =
          readVarint(raw, offset);

        offset = value.offset;

        if (fieldNumber === 1) {
          result.voltage =
            Number(value.value);
        } else if (fieldNumber === 2) {
          result.charging =
            value.value !== 0n;
        } else {
          result.usb =
            value.value !== 0n;
        }

        recognized += 1;
        continue;
      }

      offset =
        skipField(
          raw,
          offset,
          wireType
        );
    }

    result.decoded =
      recognized > 0;

    return result;
  } catch {
    return result;
  }
}
