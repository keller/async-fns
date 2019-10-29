export default function(fn, options) {
  let abort;
  options.signal.addEventListener("abort", () => {
    const msg = "The operation was aborted.";
    const name = "AbortError";

    abort(
      typeof DOMException == "function"
        ? new DOMException(msg, name)
        : { msg, name }
    );
  });
  return function(...args) {
    return Promise.race([
      fn(...args),
      new Promise((_, reject) => {
        abort = e => reject(e);
      })
    ]);
  };
}
