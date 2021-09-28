'use strict'

const argKey = x => x.toString() + ':' + typeof x;
const generateKey = args => args.map(argKey).join('|');

const memoize = (fn, maxCount) => {
    const cache = Object.create(null);
    return (...args) => {
        const keys = Object.keys(cache);
        const leastOccured = values.sort((a, b) => a[1] - b[1])[0];
        const key = generateKey(args);
        const val = cache[key];
        if (val) {
            val[1]++;
            return val[0];
        }
        if (keys.length === maxCount) {
            for (const key of keys) if (cache[key] === leastOccured) delete cache[key];
        }
        const res = fn(...args);
        cache[key] = [res, 1];
        return res;
    };
};


