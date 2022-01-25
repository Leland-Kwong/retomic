"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetomicRoot = void 0;
var react_1 = __importDefault(require("react"));
var db_1 = require("./db");
var root_context_1 = require("./root-context");
var utils_1 = require("./utils");
function RetomicRoot(_a) {
    var children = _a.children;
    var currentDb = (0, utils_1.useDb)();
    var isNestedRetomicRoot = currentDb !== root_context_1.defaultContext;
    if (isNestedRetomicRoot) {
        throw new Error((0, utils_1.errorMsg)('Application tree may only be wrapped in a single `RetomicRoot` component'));
    }
    var db = (0, db_1.makeDb)({});
    return (react_1.default.createElement(root_context_1.RootContext.Provider, { value: db }, children));
}
exports.RetomicRoot = RetomicRoot;