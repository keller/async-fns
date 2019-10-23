import { parallel, sequence } from "../src";

function fakeFetch(url) {
  const id = url.match(/\d+$/)[0];
  return Promise.resolve({
    json: () => Promise.resolve({ data: +id })
  });
}
const fetchJson = url => sequence([() => fakeFetch(url), r => r.json()]);

describe("parallel", () => {
  it("should run async fns in parallel", () => {
    const url = id => `http://example.com/api/${id}`;

    return expect(
      parallel([() => fetchJson(url(1)), () => fetchJson(url(5))])
    ).resolves.toEqual([{ data: 1 }, { data: 5 }]);
  });
});
