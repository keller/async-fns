import { emitter } from "../src";

describe("emitter", () => {
  it("should subscribe to emitter", done => {
    expect.assertions(5);

    const timer = emitter();

    let count = 0;
    setInterval(() => {
      timer.emit("count", count);
      count += 1;
    }, 10);

    let i = 0;
    const unsub = timer.subscribe("count", val => {
      expect(val).toBe(i);
      i += 1;

      if (i >= 5) {
        unsub();
        setTimeout(done, 50);
      }
    });
  });

  it("should subscribe to multiple types", done => {
    expect.assertions(5);

    const em = emitter();

    em.subscribe("count", i => {
      expect(i).toBe(4);
    });

    em.subscribe("*", (type, msg) => {
      expect(type).toBeTruthy();
      expect(msg).toBeGreaterThan(1);
    });

    em.emit("count", 4);
    em.emit("foo", 8);
    setTimeout(done, 10);
  });
});
