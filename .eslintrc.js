module.exports = {
  plugins: ["jest"],
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {}
};
