/// <reference types="node" />
import postcss from 'postcss';
import url from 'url';
import { PluginOptions, PluginSettings, RemoteFont, Job, JobResult } from '../contracts';
import { Downloader as DownloaderContract } from './downloader/contract';
export declare function parseOptions(options: PluginOptions): PluginSettings;
export declare function isRemoteFontFaceDeclaration(node: postcss.ChildNode): boolean;
export declare function isFontFaceSrcContainsRemoteFontUri(cssValue: string): boolean;
export declare function getFontFilename(fontUriObject: url.UrlWithStringQuery): string;
export declare function getFontFormatFromUrlObject(urlObject: url.UrlWithStringQuery): undefined | string;
export declare function getFontInfoFromSrc(src: string): undefined | RemoteFont;
export declare function reduceSrcsToFontInfos(fontInfos: RemoteFont[], src: string): RemoteFont[];
export declare function processDeclaration(declaration: postcss.Declaration, cssSourceFilePath: string, cssDestinationDirectoryPath: string, downloadDirectoryPath: string): Job[];
export declare function downloadFont(job: Job, downloader?: DownloaderContract): Promise<JobResult>;
export declare function calculateCssOutputDirectoryPath(cssSourceFilePath: string, cssSourceDirectoryPathFromSetting: string | undefined, cssDestinationDirectoryPathFromSetting: string | undefined, postcssOptionsTo: string | undefined): string | undefined;
