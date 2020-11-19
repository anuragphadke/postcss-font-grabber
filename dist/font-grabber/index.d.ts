/// <reference types="node" />
import EventEmitter from 'events';
import { Transformer as PostcssTransformer } from 'postcss';
import postcss from 'postcss';
import { PluginSettings, JobResult, DoneCallback } from '../contracts';
export declare class FontGrabber {
    protected doneEmitter: EventEmitter;
    protected downloadJobs: void[];
    protected settings: PluginSettings;
    constructor(settings: PluginSettings);
    protected done(jobResults: JobResult[]): void;
    protected getOptionFromPostcssResult(result: postcss.Result | undefined, key: string): string | undefined;
    makeTransformer(): PostcssTransformer;
    onDone(callback: DoneCallback): void;
    protected createDirectoryIfWantTo(directoryPath: string): Promise<void>;
}
