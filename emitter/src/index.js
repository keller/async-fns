export default function emitter() {
  const listeners = [];
  return {
    subscribe(listener) {
      listeners.push(listener);
      return () => listeners.splice(listeners.indexOf(listener), 1);
    },
    emit(msg) {
      [...listeners].forEach(cb => cb(msg));
    }
  };
}
