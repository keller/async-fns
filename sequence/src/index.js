const STOP = "@@ASYNCSTOP";
const THROW = "@@ASYNCTHROW";
export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (stopped) {
          return Promise.resolve(result);
        }
        if (result != null && result._type == STOP) {
          stopped = true;
          return Promise.resolve(result._value);
        }
        if (result != null && result._type == THROW) {
          return Promise.reject(result._error);
        }
        return fn(result);
      }),
    Promise.resolve()
  );
}
sequence.stop = _value => ({ _type: STOP, _value });
sequence.throw = _error => ({ _type: THROW, _error });
