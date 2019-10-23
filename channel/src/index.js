import emitter from '../../emitter/src';
const CHANNEL = "@@CHANNEL";
export default function channel(em) {
  em = em || emitter();
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
