"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIsNew = void 0;
var react_1 = require("react");
function shallowCompare(cache, value) {
    var maybeNewValue = value !== cache;
    if (maybeNewValue) {
        var shouldShallowCompare = typeof cache === 'object';
        if (shouldShallowCompare) {
            for (var _i = 0, _a = Object.keys(value); _i < _a.length; _i++) {
                var key = _a[_i];
                var prev = cache[key];
                var next = value[key];
                var isNewValue = prev !== next;
                if (isNewValue) {
                    return true;
                }
            }
            return false;
        }
    }
    return cache !== value;
}
/**
 * Returns a new function that compares the old return value
 * and new return value. If they are the same, then it will
 * return what was previously returned. This is useful for
 * determining if two different objects are equal to prevent
 * unecessary rerenders.
 */
function useIsNew(fn, isNewValue) {
    if (isNewValue === void 0) { isNewValue = shallowCompare; }
    var cache = (0, react_1.useRef)(null);
    return function (x) {
        var next = fn(x);
        var shouldUpdateCache = cache.current === null ||
            isNewValue(cache.current, next);
        if (shouldUpdateCache) {
            cache.current = next;
        }
        return cache.current;
    };
}
exports.useIsNew = useIsNew;