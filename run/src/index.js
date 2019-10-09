import { validate, valid } from "../../src/helpers";

export default function run(genFn, ...args) {
  const gen = genFn(...args);
  function step(val) {
    const { value, done } = gen.next(val);
    if (done) {
      return;
    }
    if (value != null && validate(value) && value.type == "take") {
      const unsub = value.emitter.subscribe(data => {
        unsub();
        step(data);
      });
    } else if (value != null && validate(value) && value.type == "put") {
      Promise.resolve().then(() => {
        value.emitter.emit(value.payload);
      });
      step();
    } else {
      Promise.resolve(value).then(data => step(data));
    }
  }
  step();
}

export function channel(emitter) {
  return {
    take() {
      return valid({ type: "take", emitter });
    },
    put(payload) {
      return valid({ type: "put", payload, emitter });
    }
  };
}
