import { parallel, sequence } from "../src";

function fakeFetch(url) {
  const id = +url.match(/\d+$/)[0];
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        json: () => Promise.resolve({ data: id })
      });
    }, id * 100);
  });
}
const fetchJson = url => sequence([() => fakeFetch(url), r => r.json()]);

describe("parallel", () => {
  it("should run async fns in parallel", () => {
    const url = id => `http://example.com/api/${id}`;

    return expect(
      parallel([() => fetchJson(url(3)), () => fetchJson(url(2))])
    ).resolves.toEqual([{ data: 3 }, { data: 2 }]);
  });
});
