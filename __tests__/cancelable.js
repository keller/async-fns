import { call, cancelable, parallel } from "../src";

describe("cancel", () => {
  function waitAndEcho(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 200);
    });
  }
  it("should throw when canceled", () => {
    const controller = new AbortController();
    const signal = controller.signal;

    const start = cancelable(call(waitAndEcho, 10), { signal });

    setTimeout(() => {
      controller.abort();
    }, 100);

    expect.assertions(1);

    return start().catch(e => expect(e.name).toEqual("AbortError"));
  });

  it("should cancel multiple async fns", () => {
    expect.assertions(2);

    const controller = new AbortController();
    const signal = controller.signal;

    const start = cancelable(time => waitAndEcho(time), { signal });
    const start2 = cancelable(time => waitAndEcho(time), { signal });

    setTimeout(() => {
      controller.abort();
    }, 100);

    return parallel([
      () => start(10).catch(e => expect(e.name).toEqual("AbortError")),
      () => start2(42).catch(e => expect(e.name).toEqual("AbortError"))
    ]);
  });

  it("shouldn't cancel all fns", () => {
    expect.assertions(2);

    const controller = new AbortController();
    const controller2 = new AbortController();
    const run = cancelable(time => waitAndEcho(time), {
      signal: controller.signal
    });
    const run2 = cancelable(time => waitAndEcho(time), {
      signal: controller2.signal
    });

    setTimeout(() => {
      controller.abort();
    }, 100);

    return parallel([
      () => run(10).catch(e => expect(e.name).toEqual("AbortError")),
      () =>
        run2(42).then(value => {
          expect(value).toBe(42);
        })
    ]);
  });
});
