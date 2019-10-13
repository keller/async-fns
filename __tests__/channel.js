import { emitter, channel, run } from "../src";

const wait = time => new Promise(resolve => setTimeout(resolve, time));

describe("run", () => {
  it("run 2 generators sharing the same chanel", done => {
    expect.assertions(12);

    const chan = channel(emitter());

    const counts = { ping: 0, pong: 0 };
    function* pingpong(name) {
      if (name == "pong") {
        yield chan.put("ping");
      }
      while (true) {
        const msg = yield chan.take();

        if (msg != name) {
          const expected = name == "ping" ? "pong" : "ping";
          expect(msg).toBe(expected);
          counts[name] += 1;

          yield wait(10);
          yield chan.put(name);

          if (counts[name] == 5) {
            break;
          }
        }
      }
      if (counts.ping >= 5 && counts.pong >= 5) {
        expect(counts.ping).toBe(5);
        expect(counts.pong).toBe(5);
        done();
      }
    }

    run(pingpong, "ping");
    run(pingpong, "pong");
  });
});
