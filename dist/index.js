"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postcssFontGrabber = exports.makeInstance = void 0;
const postcss_1 = __importDefault(require("postcss"));
const font_grabber_1 = require("./font-grabber");
const functions_1 = require("./font-grabber/functions");
function makeInstance(options) {
    if (options === undefined) {
        throw new Error(`You must specify plugin options.`);
    }
    return new font_grabber_1.FontGrabber(functions_1.parseOptions(options));
}
exports.makeInstance = makeInstance;
const plugin = postcss_1.default.plugin('postcss-font-grabber', options => {
    return makeInstance(options).makeTransformer();
});
exports.postcssFontGrabber = plugin;
exports.default = plugin;
//# sourceMappingURL=index.js.map