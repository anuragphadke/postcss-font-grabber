/// <reference types="node" />
import url from 'url';
import { FileSystem, HttpGet, FileInfo, Downloader as DownloaderContract } from './contract';
export declare class Downloader implements DownloaderContract {
    protected fsLibrary: FileSystem;
    protected httpGet: HttpGet;
    protected httpsGet: HttpGet;
    constructor(fsLibrary?: FileSystem, httpGet?: HttpGet, httpsGet?: HttpGet);
    download(urlObject: url.UrlWithStringQuery, filePath: string, referer: string, timeout?: number): Promise<FileInfo>;
}
