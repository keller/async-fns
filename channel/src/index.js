const TAKE = "@@ASYNCTAKE";
const PUT = "@@ASYNCPUT";
export function run(genFn, ...args) {
  const gen = genFn(...args);
  function step(val) {
    const { value, done } = gen.next(val);
    if (done) {
      return;
    }
    if (value != null && value._type == TAKE) {
      value(step);
    } else if (value != null && value._type == PUT) {
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
        { _type: TAKE }
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
        { _type: PUT }
      );
    }
  };
}