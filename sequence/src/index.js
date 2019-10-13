export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (stopped) {
          return Promise.resolve(result);
        }
        if (result != null && result.type == "stop") {
          stopped = true;
          return Promise.resolve(result.value);
        }
        if (result != null && result.type == "throw") {
          return Promise.reject(result.error);
        }
        return fn(result);
      }),
    Promise.resolve()
  );
}
sequence.stop = value => ({ type: "stop", value });
sequence.throw = error => ({ type: "throw", error });
