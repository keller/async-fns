import { cancel, parallel } from "../src";

describe("cancel", () => {
  function waitAndEcho(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 200);
    });
  }
  it("should throw when canceled", () => {
    const ERROR = { error: "error!" };
    const source = cancel.source();
    const run = cancel.wrap(() => waitAndEcho(10), source.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    expect.assertions(1);

    return run().catch(e => expect(e).toEqual(ERROR));
  });

  it("should cancel multiple async fns", () => {
    expect.assertions(2);

    const ERROR = { error: "error!" };
    const source = cancel.source();
    const run = cancel.wrap(() => waitAndEcho(10), source.token);
    const run2 = cancel.wrap(() => waitAndEcho(42), source.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    return parallel([
      () => run().catch(e => expect(e).toEqual(ERROR)),
      () => run2().catch(e => expect(e).toEqual(ERROR))
    ]);
  });

  it("shouldn't cancel all fns", () => {
    expect.assertions(2);

    const ERROR = { error: "error!" };
    const source = cancel.source();
    const source2 = cancel.source();
    const run = cancel.wrap(() => waitAndEcho(10), source.token);
    const run2 = cancel.wrap(() => waitAndEcho(42), source2.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    return parallel([
      () => run().catch(e => expect(e).toEqual(ERROR)),
      () =>
        run2().then(value => {
          expect(value).toBe(42);
        })
    ]);
  });
});
