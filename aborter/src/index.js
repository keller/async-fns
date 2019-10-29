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

// export default function(abortEmitter) {
//   let abort;
//   options.signal.addEventListener("abort", () => {
//     abort(new DOMException("The operation was aborted.", "AbortError"));
//   });
//   return function(...args) {
//     return Promise.race([
//       fn(...args),
//       new Promise((_, reject) => {
//         abort = e => reject(e);
//       })
//     ]);
//   };
// }
