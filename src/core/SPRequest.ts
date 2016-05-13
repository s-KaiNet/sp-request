import {OptionsWithUrl, CoreOptions} from 'request';
import {RequestPromiseOptions} from 'request-promise';
import {IncomingMessage} from 'http';
import './IncomingMessageWithBody';
import * as requestp from 'request-promise';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as util from 'util';

import {IUserCredentials} from './auth/IUserCredentials';
import {IEnvironment} from './auth/IEnvironment';
import {IAuthOptions} from './auth/IAuthOptions';
import {AuthResolverFactory} from './auth/AuthResolverFactory';
import {ISPRequest} from './ISPRequest';
import {Cache} from './utils/Cache';

let requestDigestCache: Cache = new Cache();

export function create(credentials: IUserCredentials, environment?: IEnvironment): ISPRequest {

  let resolversFactory: AuthResolverFactory = new AuthResolverFactory();

  let coreRequest: any = (options: OptionsWithUrl): Promise<IncomingMessage> => {
    let requestDeferred: Promise.Resolver<IncomingMessage> = Promise.defer<IncomingMessage>();

    (<RequestPromiseOptions>options).resolveWithFullResponse = true;
    (<RequestPromiseOptions>options).simple = true;

    options.headers = options.headers || {};

    _.defaults(options.headers, {
      'Accept': 'application/json;odata=verbose',
      'Content-Type': 'application/json;odata=verbose'
    });

    _.defaults(options, { json: true });

    let authOptions: IAuthOptions = {
      options: options,
      credentials: credentials,
      env: environment
    };

    resolversFactory
      .resolve(authOptions.options.url)
      .applyAuthHeaders(authOptions)
      .then(requestp)
      .then((response: IncomingMessage) => {
        requestDeferred.resolve(response);
      })
      .catch((err) => {
        requestDeferred.reject(err);
      });

    return requestDeferred.promise;
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
    let url: string = siteUrl.replace(/\/$/, '');
    let requestDeferred: Promise.Resolver<string> = Promise.defer<string>();
    let cacheKey: string = util.format('%s@%s', url, credentials.username);
    let cachedDigest: string = requestDigestCache.get<string>(cacheKey);

    if (cachedDigest) {
      requestDeferred.resolve(cachedDigest);
      return requestDeferred.promise;
    }

    spRequestFunc.post(`${url}/_api/contextinfo`)
      .then((response: IncomingMessage) => {
        let digest: string = response.body.d.GetContextWebInformation.FormDigestValue;
        let timeout: number = parseInt(response.body.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
        requestDigestCache.set(cacheKey, digest, timeout - 30);
        requestDeferred.resolve(digest);
      })
      .catch((err) => {
        requestDeferred.reject(err);
      });

    return requestDeferred.promise;
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
