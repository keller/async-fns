export function run(genFn, ...args) {
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

export function channel(em) {
  return {
    take() {
      return new Promise(resolve => {
        const unsub = em.subscribe(data => {
          unsub();
          resolve(data);
        });
      });
    },
    put(payload) {
      setTimeout(() => {
        em.emit(payload);
      }, 0);
    }
  };
}
