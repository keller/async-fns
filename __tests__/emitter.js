import { emitter } from "../src";

describe("emitter", () => {
  it("should subscribe to emitter", done => {
    expect.assertions(5);

    const timer = emitter();

    let a = 0;
    setInterval(() => {
      timer.emit(a++);
    }, 10);

    let i = 0;
    timer.subscribe(val => {
      expect(val).toBe(i);
      if (++i >= 5) done();
    });
  });
});
