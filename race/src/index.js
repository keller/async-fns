function queryPromise(pr) {
  let done = false;
  const r = Promise.resolve(pr).then(v => {
    done = true;
    return v;
  });
  r._isDone = () => done;
  return r;
}

export default function race(fns) {
  const prs = [];
  return Promise.race(
    fns.map(fn => {
      const pr = queryPromise(fn());
      prs.push(pr);
      return pr;
    })
  ).then(v => prs.map(pr => (pr._isDone() ? v : undefined)));
}
