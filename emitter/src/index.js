export default function emitter(listeners) {
  if (!listeners) listeners = {};
  return {
    subscribe(name, listener) {
      const namedListeners = listeners[name] || (listeners[name] = []);
      namedListeners.push(listener);

      return () => listeners[name].splice(listeners[name].indexOf(listener), 1);
    },
    emit(name, msg) {
      const named = [].concat(listeners[name] || []);
      named.map(cb => cb(msg));

      const splat = [].concat(listeners["*"] || []);
      splat.map(cb => cb(name, msg));
    }
  };
}
