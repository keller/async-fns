export default function(options, fn) {
  const higherOrderFunction = wrapped => {
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
    return (...args) =>
      Promise.race([
        wrapped(...args),
        new Promise((_, reject) => {
          abort = e => reject(e);
        })
      ]);
  };
  return fn ? higherOrderFunction(fn) : higherOrderFunction;
}
