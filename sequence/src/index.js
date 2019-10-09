import { validate, valid } from "../../src/helpers";

export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (stopped) {
          return Promise.resolve(result);
        }
        if (result != null && validate(result) && result.type == "stop") {
          stopped = true;
          return Promise.resolve(result.value);
        }
        if (result != null && validate(result) && result.type == "throw") {
          return Promise.reject(result.error);
        }
        return fn(result);
      }),
    Promise.resolve()
  );
}
sequence.stop = value => valid({ type: "stop", value });
sequence.throw = error => valid({ type: "throw", error });
