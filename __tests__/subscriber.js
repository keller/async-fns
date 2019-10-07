import { subscriber } from "../src";

describe("subscriber", () => {
  it("should subscribe to subscriber", done => {
    expect.assertions(5);
    const timer = subscriber(emit => {
      setInterval(() => {
        emit(9);
      }, 100);
    });
    let i = 0;
    return timer.subscribe(val => {
      expect(val).toBe(9);
      if (++i >= 5) done();
    });
  });
});
