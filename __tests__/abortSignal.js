import { abortSignal } from "../src";

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

    const start = abortSignal({ signal }, () => waitAndEcho(10));

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

    const withSignal = abortSignal({ signal });
    const start = withSignal(time => waitAndEcho(time));
    const start2 = withSignal(time => waitAndEcho(time));

    setTimeout(() => {
      controller.abort();
    }, 100);

    return Promise.all([
      start(10).catch(e => expect(e.name).toEqual("AbortError")),
      start2(42).catch(e => expect(e.name).toEqual("AbortError"))
    ]);
  });

  it("shouldn't cancel all fns", () => {
    expect.assertions(2);

    const controller = new AbortController();
    const controller2 = new AbortController();
    const run = abortSignal(
      {
        signal: controller.signal
      },
      time => waitAndEcho(time)
    );
    const run2 = abortSignal(
      {
        signal: controller2.signal
      },
      time => waitAndEcho(time)
    );

    setTimeout(() => {
      controller.abort();
    }, 100);

    return Promise.all([
      run(10).catch(e => expect(e.name).toEqual("AbortError")),
      run2(42).then(value => {
        expect(value).toBe(42);
      })
    ]);
  });
});
