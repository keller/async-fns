export default function(abortEmitter) {
  return {
    abort(message, name) {
      abortEmitter.emit("abort", { message, name });
    },
    signal: {
      addEventListener: abortEmitter.subscribe
    }
  };
}
