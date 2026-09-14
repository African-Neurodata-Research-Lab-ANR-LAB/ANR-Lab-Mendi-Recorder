import {
  describe,
  expect,
  it
} from "vitest";

import {
  PausableProtocolClock
} from "../../src/recording/pausable-protocol-clock.js";

describe("PausableProtocolClock", () => {
  it("advances with the Session Clock while running", () => {
    let sessionNow = 0;

    const sessionClock = {
      nowSeconds: () => sessionNow
    };

    const clock = new PausableProtocolClock({
      sessionClock
    });

    clock.start({
      sessionStartSeconds: 0
    });

    sessionNow = 12;

    expect(clock.nowSeconds()).toBe(12);
  });

  it("freezes protocol time while the Session Clock continues", () => {
    let sessionNow = 0;

    const sessionClock = {
      nowSeconds: () => sessionNow
    };

    const clock = new PausableProtocolClock({
      sessionClock
    });

    clock.start({
      sessionStartSeconds: 0
    });

    sessionNow = 8;
    clock.pause();

    sessionNow = 68;

    expect(clock.nowSeconds()).toBe(8);
  });

  it("resumes without counting paused Session Clock time", () => {
    let sessionNow = 0;

    const sessionClock = {
      nowSeconds: () => sessionNow
    };

    const clock = new PausableProtocolClock({
      sessionClock
    });

    clock.start({
      sessionStartSeconds: 0
    });

    sessionNow = 8;
    clock.pause();

    sessionNow = 68;
    clock.resume();

    sessionNow = 70;

    expect(clock.nowSeconds()).toBe(10);
  });

  it("maps protocol timestamps to true Session Clock timestamps", () => {
    let sessionNow = 0;

    const sessionClock = {
      nowSeconds: () => sessionNow
    };

    const clock = new PausableProtocolClock({
      sessionClock
    });

    clock.start({
      sessionStartSeconds: 0
    });

    sessionNow = 8;
    clock.pause();

    sessionNow = 68;
    clock.resume();

    expect(
      clock.protocolToSessionSeconds(5)
    ).toBe(5);

    expect(
      clock.protocolToSessionSeconds(10)
    ).toBe(70);
  });
});

it("supports multiple pause and resume cycles", () => {
  let sessionNow = 0;

  const sessionClock = {
    nowSeconds: () => sessionNow
  };

  const clock =
    new PausableProtocolClock({
      sessionClock
    });

  clock.start({
    sessionStartSeconds: 0
  });

  sessionNow = 5;
  clock.pause();

  sessionNow = 15;
  clock.resume();

  sessionNow = 20;

  expect(
    clock.nowSeconds()
  ).toBe(10);

  clock.pause();

  sessionNow = 50;
  clock.resume();

  sessionNow = 55;

  expect(
    clock.nowSeconds()
  ).toBe(15);

  expect(
    clock.protocolToSessionSeconds(15)
  ).toBe(55);
});

it("reports its current protocol and Session Clock state", () => {
  let sessionNow = 0;

  const sessionClock = {
    nowSeconds: () => sessionNow
  };

  const clock =
    new PausableProtocolClock({
      sessionClock
    });

  clock.start({
    sessionStartSeconds: 0
  });

  sessionNow = 8;
  clock.pause();

  sessionNow = 68;

  expect(
    clock.getState()
  ).toMatchObject({
    started: true,
    paused: true,
    stopped: false,
    protocolSeconds: 8,
    sessionSeconds: 68
  });
});

it("stops and freezes protocol time permanently", () => {
  let sessionNow = 0;

  const sessionClock = {
    nowSeconds: () => sessionNow
  };

  const clock =
    new PausableProtocolClock({
      sessionClock
    });

  clock.start({
    sessionStartSeconds: 0
  });

  sessionNow = 12;

  clock.stop();

  sessionNow = 100;

  expect(
    clock.nowSeconds()
  ).toBe(12);

  expect(
    clock.getState()
  ).toMatchObject({
    started: true,
    paused: false,
    stopped: true,
    protocolSeconds: 12,
    sessionSeconds: 100
  });
});
