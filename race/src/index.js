function queryPromise(pr) {
  let resolved = false;
  const r = Promise.resolve(pr).then(v => {
    resolved = true;
    return v;
  });
  r._isResolved = () => resolved;
  return r;
}

export default function race(fns) {
  const prs = [];
  return Promise.race(
    fns.map(fn => {
      const pr = queryPromise(typeof fn == "function" ? fn() : fn);
      prs.push(pr);
      return pr;
    })
  ).then(v => prs.map(pr => (pr._isResolved() ? v : undefined)));
}
