import { describe, expect, it } from 'vitest';
import { StreamHealth } from '../../src/streaming/stream-health.js';

const optical = {left: {red: 100, infrared: 200}, right: {red: 110, infrared: 210}};
const imu = {accX: 0, accY: 0, accZ: 10, gyroX: 0, gyroY: 0, gyroZ: 0};

describe('acquisition health', () => {
  it('distinguishes recently received repeated values from changing sensor values', () => {
    const health = new StreamHealth();
    for (const t of [0, 500, 1000, 1500]) health.observe(optical, imu, t);
    expect(health.snapshot(1600)).toMatchObject({status: 'REPEATED VALUES', dataAgeMs: 100, changeAgeMs: 1600, consecutiveRepeats: 3, arrivalRateHz: 2});
    health.observe({...optical, left: {red: 101, infrared: 202}}, {...imu, accX: 3, accY: 4}, 2000);
    expect(health.snapshot(2000)).toMatchObject({status: 'RECEIVING', consecutiveRepeats: 0, accelerationDelta: 5});
  });
  it('ages without incoming packets and stops reporting an old arrival rate', () => {
    const health = new StreamHealth();
    health.observe(optical, imu, 0);
    health.observe(optical, imu, 1000);
    expect(health.snapshot(3000).status).toBe('STALE');
    expect(health.snapshot(6500).arrivalRateHz).toBe(0);
  });
  it('does not turn missing optical data or movement into a fresh zero measurement', () => {
    const health = new StreamHealth();
    health.observe(null, imu, 100);
    expect(health.snapshot(200).dataAgeMs).toBeNull();
    health.observe(optical, {}, 300);
    expect(health.snapshot(400).accelerationDelta).toBeNull();
    health.reset();
    expect(health.snapshot(500).status).toBe('WAITING');
  });
});
