import { call, sequence } from "../src";

function fakeFetch() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        json: () => Promise.resolve({ data: 10 })
      });
    }, 100);
  });
}

describe("call", () => {
  it("should call the async fn", () =>
    expect(
      sequence([call(fakeFetch, `http://example.com/api/1`), r => r.json()])
    ).resolves.toEqual({ data: 10 }));
});
