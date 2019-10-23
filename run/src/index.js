export default function run(genFn, ...args) {
  const gen = genFn(...args);
  const step = method => val => {
    const next = gen[method](val);
    if (next.done) return;

    Promise.resolve(next.value).then(step("next"), step("throw"));
  };
  step("next")();
}
