const CHANNEL = "@@CHAN";
export default function channel(em) {
  return {
    take() {
      return new Promise(resolve => {
        const unsubscribe = em.subscribe(CHANNEL, data => {
          unsubscribe();
          resolve(data);
        });
      });
    },
    put(payload) {
      // it's important that both take and put are async so generator function can continue as if forked process
      // take() is because it's returning a promise.
      // put() is made async by wrapping in setTimeout
      setTimeout(() => {
        em.emit(CHANNEL, payload);
      }, 0);
    }
  };
}
