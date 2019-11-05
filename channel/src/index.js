const CHANNEL = "@@CHAN";
export default function channel(em) {
  return {
    take() {
      return new Promise(resolve => {
        const unsub = em.subscribe(CHANNEL, data => {
          unsub();
          resolve(data);
        });
      });
    },
    put(payload) {
      setTimeout(() => {
        em.emit(CHANNEL, payload);
      }, 0);
    }
  };
}
