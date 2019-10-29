import { abortable, aborter, emitter } from "../src";

// remove DOMException for this test because assuming older browser and using own error object
window.DOMException = undefined;

describe("cancel", () => {
  function waitAndEcho(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 200);
    });
  }
  it("should throw when canceled", () => {
    const controller = aborter(emitter());
    const signal = controller.signal;

    const start = abortable(() => waitAndEcho(10), { signal });

    setTimeout(() => {
      controller.abort();
    }, 100);

    expect.assertions(1);

    return start().catch(e => expect(e.name).toEqual("AbortError"));
  });

  it("should cancel multiple async fns", () => {
    expect.assertions(2);

    const controller = aborter(emitter());
    const signal = controller.signal;

    const start = abortable(time => waitAndEcho(time), { signal });
    const start2 = abortable(time => waitAndEcho(time), { signal });

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

    const controller = aborter(emitter());
    const controller2 = aborter(emitter());
    const run = abortable(time => waitAndEcho(time), {
      signal: controller.signal
    });
    const run2 = abortable(time => waitAndEcho(time), {
      signal: controller2.signal
    });

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
