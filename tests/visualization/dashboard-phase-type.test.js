// @vitest-environment jsdom


it("renders the experiment phase type into the protocol dashboard field", async () => {
  const dashboard = await import(
    "../../src/visualization/dashboard.js"
  );

  const root = document.createElement("div");

  root.innerHTML = `
    <select data-phase-type>
      <option value="baseline">Baseline</option>
    </select>
    <strong data-current-phase-type>-</strong>
  `;

  dashboard.renderDashboard(root, {
    connection: "connected",
    recording: "recording",
    packetCount: 0,
    quality: "REVIEW",
    sessionStatus: "recording",
    experiment: {
      phaseType: "task"
    },
    monitor: {}
  });

  expect(
    root.querySelector(
      "[data-current-phase-type]"
    ).textContent
  ).toBe("task");

  expect(
    root.querySelector(
      "[data-phase-type]"
    ).value
  ).toBe("baseline");
});
