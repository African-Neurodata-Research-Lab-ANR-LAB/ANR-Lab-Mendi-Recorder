export const MENDI_SERVICE_UUID =
  "fc3eabb0-c6c4-49e6-922a-6e551c455af5";

export const MENDI_CHARACTERISTICS = Object.freeze({
  ABB1: {
    key: "ABB1",
    uuid: "abb1",
    read: true,
    notify: true,
    role: "frame-data"
  },
  ABB2: {
    key: "ABB2",
    uuid: "abb2",
    write: true,
    notify: true,
    role: "sensor-control"
  },
  ABB3: {
    key: "ABB3",
    uuid: "abb3",
    write: true,
    notify: true,
    role: "reserved-control"
  },
  ABB4: {
    key: "ABB4",
    uuid: "abb4",
    read: true,
    notify: true,
    role: "adc-telemetry"
  },
  ABB5: {
    key: "ABB5",
    uuid: "abb5",
    notify: true,
    role: "diagnostics"
  },
  ABB6: {
    key: "ABB6",
    uuid: "abb6",
    read: true,
    write: true,
    notify: true,
    role: "calibration-mode"
  }
});

export const DEVICE_INFORMATION_UUIDS = Object.freeze({
  firmware: "2a26",
  hardware: "2a27",
  manufacturer: "2a29"
});

export const TESTED_HARDWARE = Object.freeze({
  generation: "V4",
  hardware: "r2.1b-ty1",
  firmware: "1.0.2"
});

export const PROTOCOL_LIMITATIONS = Object.freeze({
  continuousAbb1Validated: false,
  allowUndocumentedControlWrites: false,
  nominalSamplingRateHz: null
});
