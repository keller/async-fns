export function run(genFn, ...args) {
  const gen = genFn(...args);
  function step(val) {
    const { value, done } = gen.next(val);
    if (done) {
      return;
    }
    if (value != null && value.type == "tk") {
      value(step);
    } else if (value != null && value.type == "pt") {
      value(step);
    } else {
      Promise.resolve(value).then(data => step(data));
    }
  }
  step();
}

export function channel(em) {
  return {
    take() {
      return Object.assign(
        next => {
          const unsub = em.subscribe(data => {
            unsub();
            next(data);
          });
        },
        { type: "tk" }
      );
    },
    put(payload) {
      return Object.assign(
        next => {
          Promise.resolve().then(() => {
            em.emit(payload);
          });
          next();
        },
        { type: "pt" }
      );
    }
  };
}
