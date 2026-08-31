# Mendi Recorder Acquisition Controller Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ANR Lab Mendi Recorder acquisition lifecycle deterministic, recoverable, and safe from duplicate subscriptions while preserving all captured raw data.

**Architecture:** Keep multi-characteristic BLE ownership inside `src/app/acquisition.js`, while `controller.js` coordinates UI/session state. Acquisition will explicitly support start, rollback, and stop, with controller integration for normal stop and unexpected disconnect.

**Tech Stack:** Vite, JavaScript ES modules, Web Bluetooth, Vitest, PowerShell, Git.

**Spec:** `docs/superpowers/specs/2026-08-31-mendi-acquisition-controller-design.md`

## Global Constraints

- Acquisition characteristics remain `ABB1`, `ABB4`, and `ABB5`.
- Preserve raw packets exactly as received.
- Preserve explicit packet timestamps when supplied.
- Fall back to notification reception time when no explicit timestamp exists.
- Failed acquisition must roll back previously established subscriptions.
- Acquisition failure must not leave the application in `"recording"` state.
- Device disconnect must preserve already captured data.
- Do not add neural activation estimation.
- Do not add cognitive-state inference.
- Do not add clinical interpretation.
- Do not fabricate optical measurements.
- Do not introduce unvalidated SNIRF metadata.
- Do not add new external services.

---

### Task 1: Explicit acquisition ownership

**Files:**
- Modify: `src/app/acquisition.js`
- Test: `tests/ble/acquisition-lifecycle.test.js`
- Test: `tests/ble/acquisition-state.test.js`

**Interfaces:**
- Consumes: `driver.subscribe(key, onPacket)` and `driver.unsubscribe(key)`.
- Produces:
  - `startAcquisition(driver, onPacket, options = {})`
  - `stopAcquisition(driver)`

- [ ] **Step 1: Write the failing stop test**

Add:

```js
it("unsubscribes all active acquisition streams on stop", async () => {
  const driver = {
    subscribe: vi.fn().mockResolvedValue(undefined),
    unsubscribe: vi.fn().mockResolvedValue(undefined)
  };

  await startAcquisition(driver, vi.fn());
  await stopAcquisition(driver);

  expect(driver.unsubscribe).toHaveBeenNthCalledWith(1, "ABB5");
  expect(driver.unsubscribe).toHaveBeenNthCalledWith(2, "ABB4");
  expect(driver.unsubscribe).toHaveBeenNthCalledWith(3, "ABB1");
});
