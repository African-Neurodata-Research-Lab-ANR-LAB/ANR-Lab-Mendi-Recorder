export function buildMetadata(session) {
  return {
    recorder: {
      name: "ANR Lab Mendi Recorder",
      version: "1.0.0"
    },
    session: session.metadata,
    acquisition: {
      rawPacketCount: session.raw.length,
      decodedSampleCount: session.decoded.length,
      markerCount: session.markers.length
    },
    privacy: {
      participantIdentifiersMustBePseudonymous: true,
      bluetoothMacAddressExported: false,
      browserOpaqueDeviceIdExported: false
    }
  };
}
