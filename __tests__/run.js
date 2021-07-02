import "regenerator-runtime/runtime.js";
import { run } from "../src";

const wait = (time) =>
  new Promise((resolve) => setTimeout(() => resolve(time), time));
const waitReject = (time) =>
  new Promise((resolve, reject) => setTimeout(() => reject("ERROR"), time));

describe("run", () => {
  it("should run a generator that yields promises", (done) => {
    expect.assertions(2);
    run(function*() {
      const val1 = yield wait(50);
      expect(val1).toBe(50);

      const val2 = yield wait(30);
      expect(val2).toBe(30);

      done();
    });
  });

  it("catch exceptions", (done) => {
    expect.assertions(1);
    run(function*() {
      try {
        yield waitReject(50);
        // should not get here:
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBe("ERROR");
      }
      done();
    });
  });
});
