import fs from 'fs';
import http from 'http';
import https from 'https';
import url from 'url';
const path = require('path');


import { FileSystem, HttpGet, FileInfo, Downloader as DownloaderContract } from './contract';
import { pick } from '../../helpers';

export class Downloader implements DownloaderContract {
    constructor(
        protected fsLibrary: FileSystem = fs,
        protected httpGet: HttpGet = http.get,
        protected httpsGet: HttpGet = https.get
    ) {
        //
    }

    /**
     * 
     * @param urlObject 
     * @param filePath
     * @param timeout 
     */
    async download(
        urlObject: url.UrlWithStringQuery,
        filePath: string,
        referer: string,
        timeout: number = 2000, //10seconds
    ): Promise<FileInfo> {
        const downloadedFile = this.fsLibrary.createWriteStream(filePath);
        const get = urlObject.protocol === 'http:' ? this.httpGet : this.httpsGet;
        urlObject['path'] = path.normalize(urlObject['path'])
        const requestOptions = Object.assign(
            pick(urlObject, [
                'protocol',
                'host',
                'port',
                'path',
            ]),
            {
                timeout:timeout,
            },
            {
                'headers': {
                    'Referer': referer
                }
            }
        );
        
        
        return new Promise<FileInfo>((resolve, reject) => {
            //using request response to capture errors when URL is not found.
            //debug: https://www.seekcapital.com/blog/category/starting-your-business/page/5/
            // @font-face {
            //     font-family: "Font Awesome 5 Pro";
            //     font-style: normal;
            //     font-weight: 300;
            //     font-display: block;
            //     src: url(https://kit-pro.fontawesome.com/releases/latest/css/../webfonts/pro-fa-light-300-5.7.1.eot);
            //     src: url(https://kit-pro.fontawesome.com/releases/latest/css/../webfonts/pro-fa-light-300-5.7.1.eot?#iefix) format("embedded-opentype"), url(https://kit-pro.fontawesome.com/releases/latest/css/../webfonts/pro-fa-light-300-5.7.1.woff2) format("woff2"), url(https://kit-pro.fontawesome.com/releases/latest/css/../webfonts/pro-fa-light-300-5.7.1.woff) format("woff"), url(https://kit-pro.fontawesome.com/releases/latest/css/../webfonts/pro-fa-light-300-5.7.1.ttf) format("truetype"), url(https://kit-pro.fontawesome.com/releases/latest/css/../webfonts/pro-fa-light-300-5.7.1.svg#fontawesome) format("svg");
            //     unicode-range: U+f7f1;
            //   }            
            let rr = get(requestOptions, response => {
                let fileSize = 0;

                response.on('data', (chunk: Buffer) => {
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
    }
}