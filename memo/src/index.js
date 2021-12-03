function shallowCompareArray(a, b) {
  return a.length === b.length && a.every((e, i) => e === b[i]);
}
let cached, prevArgs;
export default function memo(fn) {
  return function(...args) {
    if (!prevArgs || !shallowCompareArray(args, prevArgs)) {
      cached = fn(...args);
      prevArgs = args;
    }
    return cached;
  };
}
