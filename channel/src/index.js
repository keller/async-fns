export default function channel(em) {
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
