"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontGrabber = void 0;
const events_1 = __importDefault(require("events"));
const util_1 = require("util");
const url_1 = __importDefault(require("url"));
const fs_1 = __importDefault(require("fs"));
const functions_1 = require("./functions");
const helpers_1 = require("../helpers");
const debug = util_1.debuglog('PostcssFontGrabber - FontGrabber');
class FontGrabber {
    constructor(settings) {
        this.doneEmitter = new events_1.default();
        this.settings = settings;
        this.downloadJobs = [];
    }
    done(jobResults) {
        const meta = {
            jobResults: jobResults,
        };
        this.doneEmitter.emit('done', meta);
    }
    getOptionFromPostcssResult(result, key) {
        if (result === undefined) {
            return undefined;
        }
        if (result.opts === undefined) {
            return undefined;
        }
        return helpers_1.getOrDefault(result.opts, key, undefined);
    }
    makeTransformer() {
        return (root, result) => {
            debug(`CSS file: [${root.source.input.file}]`);
            const postcssOptionsTo = this.getOptionFromPostcssResult(result, 'to');
            const cssOutputToDirectory = functions_1.calculateCssOutputDirectoryPath(root.source.input.file, this.settings.cssSourceDirectoryPath, this.settings.cssDestinationDirectoryPath, postcssOptionsTo);
            const fontOutputToDirectory = helpers_1.defaultValue(this.settings.fontDirectoryPath, cssOutputToDirectory);
            if (cssOutputToDirectory === undefined || fontOutputToDirectory === undefined) {
                throw new Error(`Can not determine output file path`);
            }
            debug(`css output to: [${cssOutputToDirectory}]`);
            debug(`font output to: [${fontOutputToDirectory}]`);
            const jobs = [];
            const declarationProcessor = node => {
                if (functions_1.isRemoteFontFaceDeclaration(node)) {
                    jobs.push(...functions_1.processDeclaration(node, root.source.input.file, cssOutputToDirectory, fontOutputToDirectory));
                }
            };
            root.walkAtRules(/font-face/, rule => rule.each(declarationProcessor));
            var fontJobs = [];
            const uniqueJobs = helpers_1.unique(jobs, job => helpers_1.md5(url_1.default.format(job.remoteFont.urlObject) + job.css.sourcePath));
            for (let uniqueJob of uniqueJobs) {
                if (!fs_1.default.existsSync(uniqueJob.font.path) || (fs_1.default.existsSync(uniqueJob.font.path) && fs_1.default.statSync(uniqueJob.font.path).size == 0)) {
                    fontJobs.push(uniqueJob);
                }
            }
            return this.createDirectoryIfWantTo(fontOutputToDirectory)
                .then(() => Promise.all(fontJobs.map(job => functions_1.downloadFont(job))))
                .then(jobResults => this.done(jobResults));
        };
    }
    onDone(callback) {
        this.doneEmitter.on('done', callback);
    }
    createDirectoryIfWantTo(directoryPath) {
        return this.settings.autoCreateDirectory === true ?
            helpers_1.makeDirectoryRecursively(directoryPath) :
            Promise.resolve();
    }
}
exports.FontGrabber = FontGrabber;
//# sourceMappingURL=index.js.map