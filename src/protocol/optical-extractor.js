function finite(value) {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

function mapChannel(channel) {
  if (!channel) {
    return null;
  }

  if (
    !finite(channel.red) ||
    !finite(channel.ir)
  ) {
    return null;
  }

  return {
    red: channel.red,
    infrared: channel.ir,
    ambient:
      finite(channel.ambient)
        ? channel.ambient
        : null
  };
}

/**
 * Backward-compatible trace sample for the original left-channel pipeline.
 */
export function extractOpticalSample(frame) {
  if (
    !frame ||
    frame.decoded !== true
  ) {
    return null;
  }

  const left =
    mapChannel(frame.left);

  if (!left) {
    return null;
  }

  return {
    red: left.red,
    infrared: left.infrared
  };
}

/**
 * Full validated raw optical view for the research dashboard.
 * Values remain raw device measurements; no HbO/HbR conversion occurs here.
 */
export function extractOpticalChannels(frame) {
  if (
    !frame ||
    frame.decoded !== true
  ) {
    return null;
  }

  const left =
    mapChannel(frame.left);
  const right =
    mapChannel(frame.right);

  if (!left && !right) {
    return null;
  }

  return {
    left,
    right,
    pulseReference:
      mapChannel(
        frame.pulseReference
      ),
    temperatureC:
      finite(frame.temperature)
        ? frame.temperature
        : null
  };
}
