export default function subscriber(fn) {
  const listeners = [];
  const dispatch = event => listeners.forEach(cb => cb(event));
  fn(dispatch);
  return {
    subscribe(listener) {
      listeners.push(listener);
      return () => listeners.splice(listeners.indexOf(listener), 1);
    }
  };
}
