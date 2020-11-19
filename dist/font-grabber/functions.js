"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateCssOutputDirectoryPath = exports.downloadFont = exports.processDeclaration = exports.reduceSrcsToFontInfos = exports.getFontInfoFromSrc = exports.getFontFormatFromUrlObject = exports.getFontFilename = exports.isFontFaceSrcContainsRemoteFontUri = exports.isRemoteFontFaceDeclaration = exports.parseOptions = void 0;
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const helpers_1 = require("../helpers");
const downloader_1 = require("./downloader");
const fontExtensionToFormatMap = {
    '.eot': 'embedded-opentype',
    '.woff': 'woff',
    '.woff2': 'woff2',
    '.ttf': 'truetype',
    '.svg': 'svg',
};
let font_referer;
function parseOptions(options) {
    font_referer = options.referer;
    return {
        cssSourceDirectoryPath: options.cssSrc !== undefined ? path_1.default.resolve(options.cssSrc) : undefined,
        cssDestinationDirectoryPath: options.cssDest !== undefined ? path_1.default.resolve(options.cssDest) : undefined,
        fontDirectoryPath: options.fontDir !== undefined ? path_1.default.resolve(options.fontDir) : undefined,
        autoCreateDirectory: helpers_1.defaultValue(options.mkdir, true),
        referer: helpers_1.defaultValue(options.referer, "")
    };
}
exports.parseOptions = parseOptions;
function isRemoteFontFaceDeclaration(node) {
    if (node.type !== 'decl') {
        return false;
    }
    if (node.prop !== 'src') {
        return false;
    }
    if (isFontFaceSrcContainsRemoteFontUri(node.value) === false) {
        return false;
    }
    return true;
}
exports.isRemoteFontFaceDeclaration = isRemoteFontFaceDeclaration;
function isFontFaceSrcContainsRemoteFontUri(cssValue) {
    return /(\s*|,|^)url\s*\(\s*[\'\"]?https?:/.test(cssValue);
}
exports.isFontFaceSrcContainsRemoteFontUri = isFontFaceSrcContainsRemoteFontUri;
function getFontFilename(fontUriObject) {
    if (!fontUriObject.pathname) {
        return helpers_1.md5(url_1.default.format(fontUriObject));
    }
    return path_1.default.basename(fontUriObject.pathname);
}
exports.getFontFilename = getFontFilename;
function getFontFormatFromUrlObject(urlObject) {
    if (!urlObject.pathname) {
        return;
    }
    const extension = path_1.default.extname(urlObject.pathname);
    return fontExtensionToFormatMap[extension] !== undefined ?
        fontExtensionToFormatMap[extension] :
        undefined;
}
exports.getFontFormatFromUrlObject = getFontFormatFromUrlObject;
function getFontInfoFromSrc(src) {
    const result = /^url\s*\(\s*[\'\"]?(https?:[^\)]*?)[\'\"]?\s*\)(\s+format\([\'\"]?([a-zA-Z0-9]+)[\'\"]?\))?/.exec(src);
    if (result === null) {
        return undefined;
    }
    const urlObject = url_1.default.parse(result[1]);
    const format = result[3] !== undefined ? result[3] : getFontFormatFromUrlObject(urlObject);
    if (format === undefined) {
        throw new Error(`can't get the font format from @font-face src: [${src}]`);
    }
    return {
        urlObject,
        format,
    };
}
exports.getFontInfoFromSrc = getFontInfoFromSrc;
function reduceSrcsToFontInfos(fontInfos, src) {
    const fontInfo = getFontInfoFromSrc(src);
    return fontInfo === undefined ?
        fontInfos :
        [...fontInfos, fontInfo];
}
exports.reduceSrcsToFontInfos = reduceSrcsToFontInfos;
function processDeclaration(declaration, cssSourceFilePath, cssDestinationDirectoryPath, downloadDirectoryPath) {
    const relativePath = path_1.default.relative(cssDestinationDirectoryPath, downloadDirectoryPath);
    const fontFaceSrcs = declaration.value.split(',').map(helpers_1.trim);
    const fontInfos = fontFaceSrcs.reduce(reduceSrcsToFontInfos, []);
    return fontInfos.map(fontInfo => {
        const filename = getFontFilename(fontInfo.urlObject);
        const filePath = path_1.default.resolve(path_1.default.join(downloadDirectoryPath, filename));
        const job = {
            remoteFont: fontInfo,
            css: {
                sourcePath: cssSourceFilePath,
                destinationDirectoryPath: cssDestinationDirectoryPath,
            },
            font: {
                path: filePath,
                filename: filename,
            },
        };
        const originalUri = url_1.default.format(fontInfo.urlObject);
        const replaceTo = path_1.default.join(relativePath, job.font.filename)
            .replace(/\\/g, '/');
        declaration.value = declaration.value.replace(originalUri, replaceTo);
        return job;
    });
}
exports.processDeclaration = processDeclaration;
function downloadFont(job, downloader = new downloader_1.Downloader()) {
    return downloader.download(job.remoteFont.urlObject, job.font.path, font_referer)
        .then(fileInfo => {
        return {
            job,
            download: {
                size: fileInfo.size,
            },
        };
    });
}
exports.downloadFont = downloadFont;
function calculateCssOutputDirectoryPath(cssSourceFilePath, cssSourceDirectoryPathFromSetting, cssDestinationDirectoryPathFromSetting, postcssOptionsTo) {
    const cssDirectoryPath = path_1.default.dirname(cssSourceFilePath);
    const finalPostcssOptionsTo = helpers_1.defaultValue(postcssOptionsTo, undefined);
    const cssSourceDirectoryPath = helpers_1.defaultValue(cssSourceDirectoryPathFromSetting, cssDirectoryPath);
    const cssDestinationDirectoryPath = helpers_1.defaultValue(cssDestinationDirectoryPathFromSetting, (finalPostcssOptionsTo !== undefined ? path_1.default.dirname(finalPostcssOptionsTo) : undefined));
    if (cssDestinationDirectoryPath === undefined) {
        return undefined;
    }
    const cssToSourceDirectoryRelation = path_1.default.relative(cssSourceDirectoryPath, cssDirectoryPath);
    return path_1.default.join(cssDestinationDirectoryPath, cssToSourceDirectoryRelation);
}
exports.calculateCssOutputDirectoryPath = calculateCssOutputDirectoryPath;
//# sourceMappingURL=functions.js.map