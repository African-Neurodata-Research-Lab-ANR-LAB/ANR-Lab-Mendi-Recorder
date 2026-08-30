export function createSnirf(session) {
  // Deliberately gated. Do not fabricate optode geometry,
  // source-detector distance, wavelength metadata, or Hb values.
  return {
    available: false,
    reason: "SNIRF export is disabled until all required scientific metadata and validated optical mappings are available."
  };
}
