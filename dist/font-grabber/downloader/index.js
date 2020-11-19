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
exports.Downloader = void 0;
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const path = require('path');
const helpers_1 = require("../../helpers");
class Downloader {
    constructor(fsLibrary = fs_1.default, httpGet = http_1.default.get, httpsGet = https_1.default.get) {
        this.fsLibrary = fsLibrary;
        this.httpGet = httpGet;
        this.httpsGet = httpsGet;
    }
    download(urlObject, filePath, referer, timeout = 2000) {
        return __awaiter(this, void 0, void 0, function* () {
            const downloadedFile = this.fsLibrary.createWriteStream(filePath);
            const get = urlObject.protocol === 'http:' ? this.httpGet : this.httpsGet;
            urlObject['path'] = path.normalize(urlObject['path']);
            const requestOptions = Object.assign(helpers_1.pick(urlObject, [
                'protocol',
                'host',
                'port',
                'path',
            ]), {
                timeout: timeout,
            }, {
                'headers': {
                    'Referer': referer
                }
            });
            return new Promise((resolve, reject) => {
                let rr = get(requestOptions, response => {
                    let fileSize = 0;
                    response.on('data', (chunk) => {
                        fileSize += chunk.length;
                    });
                    response.pipe(downloadedFile, { end: true });
                    response.on('end', () => resolve({
                        size: fileSize,
                    }));
                });
                rr.on("error", () => resolve({
                    size: 0
                }));
            });
        });
    }
}
exports.Downloader = Downloader;
//# sourceMappingURL=index.js.map