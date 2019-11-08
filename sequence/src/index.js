const stopType = "@@STOP";
export default function sequence(fns) {
  let stopped = false;
  return fns.reduce(
    (pr, fn) =>
      Promise.resolve(pr).then(result => {
        if (stopped) return result;

        if (result && result[stopType]) {
          stopped = true;
          return Promise[result[stopType]](result._value);
        }

        return typeof fn == "function" ? fn(result) : fn;
      }),
    undefined
  );
}
sequence.stop = _value => ({ [stopType]: "resolve", _value });
sequence.throw = _value => ({ [stopType]: "reject", _value });
