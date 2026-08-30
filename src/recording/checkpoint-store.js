const KEY = "anr-mendi-recorder-recovery";

export class CheckpointStore {
  save(snapshot) {
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  }

  load() {
    const value = localStorage.getItem(KEY);
    return value ? JSON.parse(value) : null;
  }

  clear() {
    localStorage.removeItem(KEY);
  }
}
