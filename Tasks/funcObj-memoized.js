'use strict'

const argKey = x => x.toString() + ':' + typeof x;
const generateKey = args => args.map(argKey).join('|');

const memoize = fn => {
  const cache = Object.create(null);
  const events = [];
  const emit = (event, key, value) => {
    for (const fn of events[event]) {
      fn(key, value);
    }
  }
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
      const valueSize = dictTypes[typeof value[0]]();
      size += valueSize;
    }

    return size;
  }
  const deleteLeastOccured = cache => {
    const keys = Object.keys(cache);
    const values = Object.values(cache);
    const leastOccured = values.sort((a, b) => a[1] - b[1]).shift();
    for (const key of keys) if (cache[key] === leastOccured) {
      emit('del', key, cache[key]);
      delete cache[key];
    }
  }
  const memoized = (...args) => {
    const length = Object.keys(cache).length;
    const key = generateKey(args);
    const val = cache[key];
    if (val) {
      val[1]++;
      return val[0];
    };
    const res = fn(...args);
    if (length === memoized.maxCount) {
      deleteLeastOccured(cache);
    }
    cache[key] = [res, 1];
    let size = getSize(cache);
    while (size >= memoized.maxSize && memoized.maxSize) {
      delete cache[key];
      deleteLeastOccured(cache);
      cache[key] = [res, 1];
      size = getSize(cache);
    }
    if (memoized.timeout) {
      setTimeout(() => {
        if (cache[key]) {
          emit('del', key, cache[key]);
          delete cache[key];
        }

      }, memoized.timeout)
    }
    emit('add', key, res);
    return res;
  };
  memoized.add = (key, value) => {
    if (cache[key]) return;
    cache[key] = [value, 0];
    emit('add', key, value);
  }
  memoized.clear = () => {
    emit('clear');
    cache = null;
  }
  memoized.delete = (key) => {
    emit('del', key, cache[key]);
    delete cache[key];
  }
  memoized.get = key => cache[key];
  memoized.timeout = null;
  memoized.maxSize = null;
  memoized.maxCount = null;
  memoized.on = (event, fn) => {
    if (!events[event]) events[event] = [];
    events[event].push(fn);
  }
  return memoized;
};

  const calcSum = (a, b) => a + b;
  const memoized = memoize(calcSum);

  memoized.on('add', (key, value) => {
   console.log(`added value ${value} with the key of ${key}`);
  });
  memoized.on('del', (key, value) => {
    console.log(`deleted value ${value} with the key of ${key}`);
   });