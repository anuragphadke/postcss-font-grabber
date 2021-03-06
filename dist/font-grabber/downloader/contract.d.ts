/// <reference types="node" />
import fs from 'fs';
import http from 'http';
import url from 'url';
export interface FileSystem {
    createWriteStream: typeof fs.createWriteStream;
}
export declare type HttpGet = typeof http.get;
export interface FileInfo {
    size: number;
}
export interface Downloader {
    download(urlObject: url.UrlWithStringQuery, filePath: string, referer: string, timeout?: number): Promise<FileInfo>;
}
