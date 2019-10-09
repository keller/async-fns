export const valid = obj => Object.assign(obj, { "@@ASYNC_FNS": true });
export const validate = obj => obj["@@ASYNC_FNS"] === true;
