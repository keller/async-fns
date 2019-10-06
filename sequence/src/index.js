const STOP = "@@STOP_SEQUENCE";
const THROW = "@@STOP_SEQUENCE";
export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (stopped) {
          return Promise.resolve(result);
        }
        if (result != null && result.STOP == STOP) {
          stopped = true;
          return Promise.resolve(result.value);
        }
        if (result != null && result.THROW == THROW) {
          return Promise.reject(result.error);
        }
        return fn(result);
      }),
    Promise.resolve()
  );
}
sequence.stop = value => ({ STOP, value });
sequence.throw = error => ({ THROW, error });
