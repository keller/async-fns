import { emitter } from "../src";

describe("emitter", () => {
  it("should subscribe to emitter", done => {
    expect.assertions(5);
    const timer = emitter();
    setInterval(() => {
      timer.emit(9);
    }, 100);
    let i = 0;
    return timer.subscribe(val => {
      expect(val).toBe(9);
      if (++i >= 5) done();
    });
  });
});
