'use strict'

const argKey = x => x.toString() + ':' + typeof x;
const generateKey = args => args.map(argKey).join('|');

const memoize = (fn, maxSize) => {
  const cache = Object.create(null);
  const dictTypes = {
    number: () => 8,
    boolean: () => 4,
    string: (str) => str.length * 2,
    object: (ob) => getSize(ob),
  };
  const getSize = obj => {
    let size = 0;
    const values = Object.values(obj);
    for (const value of values) {
      const valueSize = dictTypes[typeof value]();
      size += valueSize;
    }
    return size;
  }
  return (...args) => {
    const cacheKeys = Object.keys(cache);
    const key = generateKey(args);
    const val = cache[key];
    if (val) return val;
    const res = fn(...args);
    cache[key] = res;
    let size = getSize(cache);
    while (size >= maxSize) {
      const firstKey = cacheKeys.shift();
      delete cache[firstKey];
      size = getSize(cache);
    }
    return res;
  };
};
