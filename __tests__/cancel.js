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
    const run = cancel.wrap(() => waitAndEcho(45), source.token);

    setTimeout(() => {
      source.cancel(ERROR);
    }, 100);

    return run().catch(e => expect(e).toEqual(ERROR));
  });
});
