export function run(genFn, ...args) {
  const gen = genFn(...args);
  function step(val) {
    const { value, done } = gen.next(val);
    if (done) {
      return;
    }
    if (value != null && value._type == "tk") {
      value(step);
    } else if (value != null && value._type == "pt") {
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
        { _type: "tk" }
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
        { _type: "pt" }
      );
    }
  };
}
