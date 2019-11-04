import emitter from "../../emitter/src";

export default function(abortEmitter) {
  if (!abortEmitter) abortEmitter = emitter();
  return {
    abort(message, name) {
      abortEmitter.emit("abort", { message, name });
    },
    signal: {
      addEventListener: abortEmitter.subscribe
    }
  };
}
