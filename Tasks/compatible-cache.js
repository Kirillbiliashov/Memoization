'use strict'

const argKey = x => x.toString() + ':' + typeof x;
const generateKey = args => args.map(argKey).join('|');

const memoize = fn => {
    const cache = Object.create(null);
    return (...args) => {
        if (typeof args[args.length - 1] === 'function') {
            const cb = args.pop();
            const key = generateKey(args);
            const val = cache[key];
            if (val) {
                cb(val.err, val.data);
                return
            }
            fn(...args, (err, data) => {
                cache[key] = { err, data };
                cb(err, data)
            });
        } else {
            const key = generateKey(args);
            const val = cache[key];
            if (val) return val;
            const data = fn(...args);
            if (data) cache[key] = { err: null, data };
            return data;
        }

    };
};
