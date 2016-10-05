import { OptionsWithUrl, CoreOptions } from 'request';
import { RequestPromiseOptions } from 'request-promise';
import { IncomingMessage } from 'http';
import * as request from 'request-promise';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as util from 'util';
import * as spauth from 'node-sp-auth';
import * as crypto from 'crypto';

import { ISPRequest } from './ISPRequest';
import { Cache } from './utils/Cache';

export var requestDigestCache: Cache = new Cache();

export function create(credentials: spauth.IAuthOptions, environment?: any): ISPRequest {

  /* backward compatibility with 1.1.5 */
  if (environment) {
    _.assign(credentials, environment);
  }
  /* backward compatibility */

  let coreRequest: any = (options: OptionsWithUrl): Promise<IncomingMessage> => {
    return new Promise<IncomingMessage>((resolve, reject) => {
      (<RequestPromiseOptions>options).resolveWithFullResponse = true;
      (<RequestPromiseOptions>options).simple = true;

      options.headers = options.headers || {};

      _.defaults(options.headers, {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
      });

      _.defaults(options, {
        json: true,
        strictSSL: false
      });

      spauth.getAuth(options.url, credentials)
        .then(data => {
          _.assign(options.headers, data.headers);
          _.assign(options, data.options);

          return options;
        })
        .then(request)
        .then((response: IncomingMessage) => {
          resolve(response);
        })
        .catch(reject);
    });
  };

  let spRequestFunc: any = (options: OptionsWithUrl | string, coreOptions?: CoreOptions): Promise<IncomingMessage> => {

    if (typeof options === 'string') {

      let url: string = options;
      let newOptions: OptionsWithUrl;

      if (coreOptions) {
        newOptions = <OptionsWithUrl>coreOptions;
        newOptions.url = url;
      } else {
        newOptions = <OptionsWithUrl>{
          url: url
        };
      }

      if (!newOptions.method) {
        newOptions.method = 'GET';
      }

      return coreRequest(newOptions);
    } else {
      if (!options.method) {
        options.method = 'GET';
      }
      return coreRequest(options);
    }
  };

  spRequestFunc.requestDigest = (siteUrl: string) => {
    return new Promise<string>((resolve, reject) => {
      let url: string = siteUrl.replace(/\/$/, '');
      let cacheKey: string = crypto.createHash('md5').update(util.format('%s@%s', url, JSON.stringify(credentials))).digest('hex');
      let cachedDigest: string = requestDigestCache.get<string>(cacheKey);

      if (cachedDigest) {
        resolve(cachedDigest);
        return;
      }

      spRequestFunc.post(`${url}/_api/contextinfo`)
        .then((response: IncomingMessage) => {
          let digest: string = response.body.d.GetContextWebInformation.FormDigestValue;
          let timeout: number = parseInt(response.body.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
          requestDigestCache.set(cacheKey, digest, timeout - 30);
          resolve(digest);

          return null;
        })
        .catch(reject);
    });
  };

  ['get', 'post'].forEach((method: string) => {
    spRequestFunc[method] = (options: OptionsWithUrl | string, coreOptions?: CoreOptions): Promise<IncomingMessage> => {

      if (typeof options === 'string') {

        if (coreOptions) {
          coreOptions.method = method.toUpperCase();
        } else {
          coreOptions = <CoreOptions>{
            method: method.toUpperCase()
          };
        }

        return spRequestFunc(options, coreOptions);
      }

      if (typeof options !== 'string') {
        options.method = method.toUpperCase();
      }

      return spRequestFunc(options);
    };
  });

  return spRequestFunc;
}
