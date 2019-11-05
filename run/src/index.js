export default function run(genFn, ...args) {
  const gen = genFn(...args);
  // step() is a higher order function. step("next") and step("throw") return a function that takes a value and either runs gen.next(value) or gen.throw(value).
  const step = method => value => {
    const next = gen[method](value);
    if (next.done) return;

    Promise.resolve(next.value).then(step("next"), step("throw"));
  };
  step("next")();
}
