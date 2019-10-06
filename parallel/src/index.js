export default function parallel(fns) {
  return Promise.all(fns.map(fn => Promise.resolve(fn())));
}
