import { sequence } from "../src";

describe("sequence", () => {
  function waitAndEcho(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value);
      }, 10);
    });
  }
  it("should run async fns in sequence", () => {
    return expect(
      sequence([
        waitAndEcho(1),
        a => waitAndEcho(a + 1),
        b => waitAndEcho(b + 2)
      ])
    ).resolves.toEqual(4);
  });

  it("should stop in async sequence", () => {
    return expect(
      sequence([
        waitAndEcho(1),
        a => waitAndEcho(a + 1),
        s => sequence.stop(s),
        b => waitAndEcho(b + 2),
        () => waitAndEcho(41)
      ])
    ).resolves.toEqual(2);
  });

  it("should throw in async sequence", () => {
    const ERROR = { error: "error!" };
    return sequence([
      waitAndEcho(1),
      a => waitAndEcho(a + 1),
      () => sequence.throw(ERROR),
      b => waitAndEcho(b + 2)
    ]).catch(e => expect(e).toEqual(ERROR));
  });
});
