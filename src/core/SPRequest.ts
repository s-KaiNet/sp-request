import * as util from 'util';
import * as spauth from 'node-sp-auth';
import * as crypto from 'crypto';
import * as https from 'https';
import request, { Options, CancelableRequest, Response } from 'got';

declare type OptionsOfTextResponseBody = Merge<MyOpts, {
  isStream?: false;
  resolveBodyOnly?: false;
  responseType: 'text';
}>;
declare type OptionsOfJSONResponseBody = Merge<MyOpts, {
  isStream?: false;
  resolveBodyOnly?: false;
  responseType: 'json';
}>;
declare type OptionsOfBufferResponseBody = Merge<MyOpts, {
  isStream?: false;
  resolveBodyOnly?: false;
  responseType: 'buffer';
}>;
declare type ResponseBodyOnly = {
  resolveBodyOnly: true;
};

export interface GotRequestMethod {
  <T>(url: string | OptionsOfJSONResponseBody, options?: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>;
  <T = string>(url: string | OptionsOfDefaultResponseBody, options?: OptionsOfDefaultResponseBody): CancelableRequest<Response<T>>;
  (url: string | OptionsOfTextResponseBody, options?: OptionsOfTextResponseBody): CancelableRequest<Response<string>>;
  (url: string | OptionsOfBufferResponseBody, options?: OptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>;
  <T>(url: string | Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>): CancelableRequest<T>;
  <T = string>(url: string | Merge<OptionsOfDefaultResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfDefaultResponseBody, ResponseBodyOnly>): CancelableRequest<T>;
  (url: string | Merge<OptionsOfTextResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfTextResponseBody, ResponseBodyOnly>): CancelableRequest<string>;
  (url: string | Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>): CancelableRequest<Buffer>;
  <T>(url: string | Merge<Options, {
    isStream: true;
  }>, options?: Merge<Options, {
    isStream: true;
  }>): ProxyStream<T>;
}

export interface ISPRequest extends Record<HTTPAlias, GotRequestMethod>, GotRequestMethod {
  requestDigest: (url: string) => Promise<string>;
}

export interface MyOpts extends Omit<Options, 'body'> {
  body?: string | Buffer | NodeJS.ReadableStream | { [key: string]: any; };
}

import { Cache } from './utils/Cache';
import { HTTPAlias, OptionsOfDefaultResponseBody } from 'got/dist/source/create';
import { Merge } from 'type-fest';
import { ProxyStream } from 'got/dist/source/as-stream';

export let requestDigestCache: Cache = new Cache();

const isUrlHttps: any = (url: string): boolean => {
  return url.split('://')[0].toLowerCase() === 'https';
};

export function create(credentials?: spauth.IAuthOptions): ISPRequest {

  let agent: https.Agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    keepAliveMsecs: 10000
  });

  let coreRequest = async (options: MyOpts) => {
    options.throwHttpErrors = true;
    options.resolveBodyOnly = false;
    options.headers = options.headers || {};

    options.headers = Object.assign({
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose'
    }, options.headers);

    let additionalHeadersStr: string = process.env['_sp_request_headers'];
    if (additionalHeadersStr) {
      let additionalHeaders: any = JSON.parse(additionalHeadersStr);
      Object.assign(options.headers, additionalHeaders);
    }

    options = Object.assign<MyOpts, MyOpts>({
      responseType: 'json',
      resolveBodyOnly: false,
      rejectUnauthorized: false,
      agent: isUrlHttps(options.url) ? agent : undefined
    }, options);

    const data = await spauth.getAuth(options.url.toString(), credentials);
    Object.assign(options.headers, data.headers);
    Object.assign(options, data.options);

    if (options.responseType === 'json') {
      options.json = options.body as any;
      options.body = undefined;
    }

    return await request(options as any);
  };

  let spRequestFunc: GotRequestMethod = ((url: string | MyOpts, options?: MyOpts) => {
    if (typeof url === 'object') {
      options = {
        ...url as MyOpts,
        ...options
      };
    }

    return coreRequest(options);
  }) as GotRequestMethod;

  (spRequestFunc as ISPRequest).requestDigest = async (siteUrl: string) => {
    let url: string = siteUrl.replace(/\/$/, '');
    let cacheKey: string = crypto.createHash('md5').update(util.format('%s@%s', url, JSON.stringify(credentials))).digest('hex');
    let cachedDigest: string = requestDigestCache.get<string>(cacheKey);

    if (cachedDigest) {
      return cachedDigest;
    }

    const response = await (spRequestFunc as ISPRequest).post<any>(`${url}/_api/contextinfo`, { responseType: 'json' });
    let digest: string = response.body.d.GetContextWebInformation.FormDigestValue;
    let timeout: number = parseInt(response.body.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
    requestDigestCache.set(cacheKey, digest, timeout - 30);
    return digest;
  };

  ['get', 'post', 'put', 'patch', 'head', 'delete'].forEach((method: string) => {
    spRequestFunc[method] = (url: string | MyOpts, options?: MyOpts) => spRequestFunc(url as any, { ...options, method } as any);
  });

  return spRequestFunc as ISPRequest;
}
