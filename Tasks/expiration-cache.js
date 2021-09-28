'use strict';

const argKey = x => x.toString() + ':' + typeof x;
const generateKey = args => args.map(argKey).join('|');

const memoize = (fn, exp) => {
  const cache = Object.create(null);
  return (...args) => {
    const key = generateKey(args);
    const val = cache[key];
    if (val) return val;
    const res = fn(...args);
    cache[key] = res;
    setTimeout(() => delete cache[key], exp)
    return res;
  };
};

