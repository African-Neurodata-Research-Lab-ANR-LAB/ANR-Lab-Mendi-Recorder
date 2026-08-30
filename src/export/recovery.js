export function recoveryManifest(error) {
  return {
    export_status: "recovery",
    snirf_created: false,
    raw_data_preserved: true,
    error: String(error?.message ?? error)
  };
}
