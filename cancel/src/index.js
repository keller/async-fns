export default {
  source() {
    let cancel = () => {};
    const promise = new Promise((resolve, reject) => {
      cancel = error => reject(error);
    });
    return {
      token: {
        promise
      },
      cancel
    };
  },
  wrap(fn, token) {
    return function() {
      return Promise.race([fn(), token.promise]);
    };
  }
};
