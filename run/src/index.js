export default function run(genFn, ...args) {
  const gen = genFn(...args);
  function step(method, val) {
    const { value, done } = gen[method](val);
    if (done) {
      return value;
    }
    Promise.resolve(value).then(
      data => step("next", data),
      err => step("throw", err)
    );
  }
  step("next");
}
