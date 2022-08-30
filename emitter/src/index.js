export default function() {
  const listeners = {};
  return {
    subscribe(name, listener) {
      const namedListeners = listeners[name] || (listeners[name] = []);
      namedListeners.push(listener);

      return () => listeners[name].splice(listeners[name].indexOf(listener), 1);
    },
    emit(name, msg) {
      const named = [].concat(listeners[name] || []);

      const splat = [].concat(listeners["*"] || []);
      return Promise.all(
        named.map(cb => cb(msg)).concat(splat.map(cb => cb(name, msg)))
      );
    }
  };
}
