import { race } from "../src";

describe("race", () => {
  function waitAndEchoTime(time) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(time);
      }, time);
    });
  }

  it("should return array with only first resolved value", done => {
    race([
      waitAndEchoTime(50),
      waitAndEchoTime(10),
      () => waitAndEchoTime(900),
      () => waitAndEchoTime(40),
      () => waitAndEchoTime(30)
    ]).then(([first, second, third, fourth, fifth]) => {
      expect(first).toBeUndefined();
      expect(second).toBe(10);
      expect(third).toBeUndefined();
      expect(fourth).toBeUndefined();
      expect(fifth).toBeUndefined();
      done();
    });
  });
});
