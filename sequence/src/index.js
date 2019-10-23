const stopSymbol = "@@STOP";
export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (result && result[stopSymbol]) {
          stopped = true;
          return Promise[result[stopSymbol]](result._value);
        }
        return stopped ? result : fn(result);
      }),
    null
  );
}
sequence.stop = _value => ({ [stopSymbol]: "resolve", _value });
sequence.throw = _value => ({ [stopSymbol]: "reject", _value });
