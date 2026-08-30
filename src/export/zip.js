export function createExportManifest(session, metadata, snirfResult) {
  return {
    session: session.metadata?.sessionCode ?? "session",
    files: [
      "metadata.json",
      "raw_packets.csv",
      "events.tsv",
      "README.txt",
      ...(snirfResult.available ? ["session.snirf"] : [])
    ],
    snirf: snirfResult
  };
}
