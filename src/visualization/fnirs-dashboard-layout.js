export class FnirsDashboardLayout {
  constructor(root) {
    this.root = root;
    this.state = {
      sampleRate: 0,
      frames: 0,
      quality: 'UNKNOWN',
      leftHbO: 0,
      leftHbR: 0,
      rightHbO: 0,
      rightHbR: 0
    };

    this.render();
  }

  update(values = {}) {
    this.state = { ...this.state, ...values };
    this.render();
  }

  render() {
    if (!this.root) return;

    const s = this.state;
    this.root.innerHTML = `
      <section class="fnirs-dashboard">
        <div class="metric-card">Sample Rate<br><strong>${s.sampleRate} Hz</strong></div>
        <div class="metric-card">Decoded Frames<br><strong>${s.frames}</strong></div>
        <div class="metric-card">Stream Quality<br><strong>${s.quality}</strong></div>

        <div class="metric-card">Left ΔHbO<br><strong>${s.leftHbO}</strong></div>
        <div class="metric-card">Left ΔHbR<br><strong>${s.leftHbR}</strong></div>
        <div class="metric-card">Right ΔHbO<br><strong>${s.rightHbO}</strong></div>
        <div class="metric-card">Right ΔHbR<br><strong>${s.rightHbR}</strong></div>
      </section>
    `;
  }
}
