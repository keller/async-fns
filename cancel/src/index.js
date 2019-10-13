export default {
  source() {
    let cancel = () => {};
    const _promise = new Promise((resolve, reject) => {
      cancel = error => reject(error);
    });
    return {
      token: {
        _promise
      },
      cancel
    };
  },
  wrap(fn, token) {
    return function() {
      return Promise.race([fn(), token._promise]);
    };
  }
};
