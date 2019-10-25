export default function(fn, options) {
  let cancel;
  options.signal.addEventListener("abort", () => {
    cancel(new DOMException("The operation was aborted.", "AbortError"));
  });
  return function(...args) {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => {
        cancel = e => reject(e);
      })
    ]);
  };
}
