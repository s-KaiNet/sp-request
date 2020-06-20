import * as util from 'util';
import * as spauth from 'node-sp-auth';
import * as crypto from 'crypto';
import * as https from 'https';
import request from 'got';

import { Cache } from './utils/Cache';
import { ISPRequest, ISPRequestOptions, GotRequestMethod } from './types';

export const requestDigestCache: Cache = new Cache();

const isUrlHttps: any = (url: string): boolean => {
  return url.split('://')[0].toLowerCase() === 'https';
};

export function create(credentials?: spauth.IAuthOptions): ISPRequest {

  const agent: https.Agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
    keepAliveMsecs: 10000
  });

  const coreRequest = async (options: ISPRequestOptions): Promise<any> => {
    options.throwHttpErrors = true;
    options.headers = options.headers || {};

    options.headers = Object.assign({
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose'
    }, options.headers);

    const additionalHeadersStr: string = process.env['_sp_request_headers'];
    if (additionalHeadersStr) {
      Object.assign(options.headers, JSON.parse(additionalHeadersStr));
    }

    options = Object.assign<ISPRequestOptions, ISPRequestOptions>({
      responseType: 'json',
      resolveBodyOnly: false,
      rejectUnauthorized: false,
      retry: 0,
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

  const spRequestFunc: GotRequestMethod = ((url: string | ISPRequestOptions, options?: ISPRequestOptions) => {
    if (typeof url === 'string') {
      options = {
        url,
        ...options
      };
    } else {
      options = {
        ...url,
        ...options
      };
    }

    if (!options.method) {
      options.method = 'get';
    }

    return coreRequest(options);
  }) as GotRequestMethod;

  (spRequestFunc as ISPRequest).requestDigest = async (siteUrl: string): Promise<string> => {
    const url: string = siteUrl.replace(/\/$/, '');
    const cacheKey: string = crypto.createHash('md5').update(util.format('%s@%s', url, JSON.stringify(credentials))).digest('hex');
    const cachedDigest: string = requestDigestCache.get<string>(cacheKey);

    if (cachedDigest) {
      return cachedDigest;
    }

    const response = await (spRequestFunc as ISPRequest).post<any>(`${url}/_api/contextinfo`, { responseType: 'json' });
    const digest: string = response.body.d.GetContextWebInformation.FormDigestValue;
    const timeout: number = parseInt(response.body.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
    requestDigestCache.set(cacheKey, digest, timeout - 30);
    return digest;
  };

  ['get', 'post', 'put', 'patch', 'head', 'delete'].forEach((method: string) => {
    spRequestFunc[method] = (url: string | ISPRequestOptions, options?: ISPRequestOptions): ReturnType<typeof spRequestFunc> => spRequestFunc(url as any, { ...options, method } as any);
  });

  return spRequestFunc as ISPRequest;
}
