const stopType = "@@ASYNCSTOP";
export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (result != null && result[stopType]) {
          stopped = true;
          return Promise[result[stopType]](result._value);
        }
        return stopped ? result : fn(result);
      }),
    null
  );
}
sequence.stop = _value => ({ [stopType]: "resolve", _value });
sequence.throw = _value => ({ [stopType]: "reject", _value });
