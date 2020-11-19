"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDirectoryRecursively = exports.unique = exports.md5 = exports.trim = exports.pick = exports.defaultValue = exports.getOrDefault = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const crypto_1 = require("crypto");
function getOrDefault(object, key, defaultValue) {
    if (object[key] === undefined) {
        return defaultValue;
    }
    return object[key];
}
exports.getOrDefault = getOrDefault;
function defaultValue(value, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    }
    return value;
}
exports.defaultValue = defaultValue;
function pick(object, keys) {
    return keys.reduce((result, key) => {
        return Object.assign(result, { [key]: object[key] });
    }, {});
}
exports.pick = pick;
function trim(text) {
    return text.replace(/(^\s+|\s+$)/g, '');
}
exports.trim = trim;
function md5(original) {
    return crypto_1.createHash('md5')
        .update(original)
        .digest()
        .toString('hex');
}
exports.md5 = md5;
function unique(array, identify) {
    if (identify === undefined) {
        return array.filter((value, index) => array.indexOf(value) === index);
    }
    const ids = [];
    return array.reduce((result, value) => {
        const id = identify(value);
        if (ids.indexOf(id) === -1) {
            ids.push(id);
            return [...result, value];
        }
        return result;
    }, []);
}
exports.unique = unique;
function makeDirectoryRecursively(directoryPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const fsStat = util_1.promisify(fs_1.default.stat);
        const fsMkdir = util_1.promisify(fs_1.default.mkdir);
        const pathParts = path_1.default.resolve(directoryPath).split(path_1.default.sep);
        const firstPart = pathParts.shift();
        yield pathParts.reduce((result, current) => __awaiter(this, void 0, void 0, function* () {
            const resultString = yield result;
            const currentPath = `${resultString}${path_1.default.sep}${current}`;
            try {
                yield fsStat(currentPath);
            }
            catch (e) {
                if (e.code === 'ENOENT') {
                    yield fsMkdir(currentPath);
                }
                else {
                    throw e;
                }
            }
            return currentPath;
        }), Promise.resolve(firstPart));
    });
}
exports.makeDirectoryRecursively = makeDirectoryRecursively;
//# sourceMappingURL=index.js.map