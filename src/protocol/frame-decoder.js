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
      throw new Error("Invalid protobuf varint.");
    }
  }

  throw new Error(
    "Unexpected end of protobuf varint."
  );
}

function toInt32(value) {
  return Number(
    BigInt.asIntN(32, value)
  );
}

function skipField(raw, offset, wireType) {
  if (wireType === 0) {
    return readVarint(raw, offset).offset;
  }

  if (wireType === 1) {
    const next = offset + 8;

    if (next > raw.length) {
      throw new Error(
        "Invalid protobuf fixed64 field."
      );
    }

    return next;
  }

  if (wireType === 2) {
    const lengthResult =
      readVarint(raw, offset);

    const next =
      lengthResult.offset +
      Number(lengthResult.value);

    if (next > raw.length) {
      throw new Error(
        "Invalid protobuf length-delimited field."
      );
    }

    return next;
  }

  if (wireType === 5) {
    const next = offset + 4;

    if (next > raw.length) {
      throw new Error(
        "Invalid protobuf fixed32 field."
      );
    }

    return next;
  }

  throw new Error(
    `Unsupported protobuf wire type: ${wireType}`
  );
}

/**
 * Decode Mendi V4 ABB1 Frame protobuf.
 *
 * Field mapping follows the published Mendi V4 wire schema:
 * 1-3 accelerometer, 4-6 angular velocity, 7 sensor temperature °C,
 * 8-10 left IR/red/ambient, 11-13 right IR/red/ambient,
 * 14-16 auxiliary pulse/reference IR/red/ambient.
 *
 * The recorder preserves these as raw device measurements. It does not
 * convert them to HbO/HbR or infer neural activation.
 */
export function decodeFrame(bytes) {
  const raw = Uint8Array.from(
    bytes ?? []
  );

  const frame = {
    rawBytes: Array.from(raw),

    left: {
      red: null,
      ir: null,
      ambient: null
    },

    right: {
      red: null,
      ir: null,
      ambient: null
    },

    pulseReference: {
      red: null,
      ir: null,
      ambient: null
    },

    imu: {
      accX: null,
      accY: null,
      accZ: null,
      gyroX: null,
      gyroY: null,
      gyroZ: null
    },

    temperature: null,
    decoded: false
  };

  let offset = 0;
  let recognizedFields = 0;

  try {
    while (offset < raw.length) {
      const tagResult =
        readVarint(raw, offset);

      offset = tagResult.offset;

      const fieldNumber =
        Number(tagResult.value >> 3n);

      const wireType =
        Number(tagResult.value & 7n);

      if (
        fieldNumber >= 1 &&
        fieldNumber <= 6 &&
        wireType === 0
      ) {
        const valueResult =
          readVarint(raw, offset);

        offset = valueResult.offset;

        const value =
          toInt32(valueResult.value);

        const keys = [
          "accX",
          "accY",
          "accZ",
          "gyroX",
          "gyroY",
          "gyroZ"
        ];

        frame.imu[
          keys[fieldNumber - 1]
        ] = value;

        recognizedFields += 1;
        continue;
      }

      if (
        fieldNumber === 7 &&
        wireType === 5
      ) {
        if (offset + 4 > raw.length) {
          throw new Error(
            "Invalid Mendi temperature field."
          );
        }

        const view =
          new DataView(
            raw.buffer,
            raw.byteOffset,
            raw.byteLength
          );

        frame.temperature =
          view.getFloat32(
            offset,
            true
          );

        offset += 4;
        recognizedFields += 1;
        continue;
      }

      if (
        fieldNumber >= 8 &&
        fieldNumber <= 16 &&
        wireType === 0
      ) {
        const valueResult =
          readVarint(raw, offset);

        offset = valueResult.offset;

        const value =
          toInt32(valueResult.value);

        switch (fieldNumber) {
          case 8:
            frame.left.ir = value;
            break;
          case 9:
            frame.left.red = value;
            break;
          case 10:
            frame.left.ambient =
              value;
            break;
          case 11:
            frame.right.ir = value;
            break;
          case 12:
            frame.right.red = value;
            break;
          case 13:
            frame.right.ambient =
              value;
            break;
          case 14:
            frame.pulseReference.ir =
              value;
            break;
          case 15:
            frame.pulseReference.red =
              value;
            break;
          case 16:
            frame.pulseReference.ambient =
              value;
            break;
        }

        recognizedFields += 1;
        continue;
      }

      offset =
        skipField(
          raw,
          offset,
          wireType
        );
    }

    frame.decoded =
      recognizedFields > 0;

    return frame;
  } catch {
    return frame;
  }
}
