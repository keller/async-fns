export default function emitter(listeners) {
  listeners = listeners || {};
  return {
    subscribe(name, listener) {
      (listeners[name] || (listeners[name] = [])).push(listener);
      return () => listeners[name].splice(listeners[name].indexOf(listener), 1);
    },
    emit(name, msg) {
      [...(listeners[name] || [])].map(cb => cb(msg));
      [...(listeners["*"] || [])].map(cb => cb(name, msg));
    }
  };
}
