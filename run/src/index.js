export default function run(genFn, ...args) {
  const gen = genFn(...args);
  function step(val) {
    const { value, done } = gen.next(val);
    if (done) {
      return;
    }
    Promise.resolve(value).then(data => step(data));
  }
  step();
}
