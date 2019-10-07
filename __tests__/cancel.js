import { cancel } from "../src";

describe("cancel", () => {
  function waitAndEcho(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 1000);
    });
  }
  it("should throw when canceled", () => {
    const ERROR = { error: "error!" };
    const source = cancel.source();
    const run = cancel.wrap(() => waitAndEcho(10), source.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    return run().catch(e => expect(e).toEqual(ERROR));
  });

  it("should cancel multiple async fns", () => {
    const ERROR = { error: "error!" };
    const source = cancel.source();
    const run = cancel.wrap(() => waitAndEcho(10), source.token);
    const run2 = cancel.wrap(() => waitAndEcho(42), source.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    return run().catch(e => expect(e).toEqual(ERROR));
    return run2().catch(e => expect(e).toEqual(ERROR));
  });

  it("shouldn't cancel all fns", () => {
    const ERROR = { error: "error!" };
    const source = cancel.source();
    const source2 = cancel.source();
    const run = cancel.wrap(() => waitAndEcho(10), source.token);
    const run2 = cancel.wrap(() => waitAndEcho(42), source2.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    return run().catch(e => expect(e).toEqual(ERROR));
    return run2().resolves.toEqual(42);
  });
});
