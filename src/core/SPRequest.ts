import {OptionsWithUrl, CoreOptions} from 'request';
import {RequestPromiseOptions} from 'request-promise';
import {IncomingMessage} from 'http';
import * as requestp from 'request-promise';
import * as Promise from 'bluebird';

import {IUserCredentials} from './auth/IUserCredentials';
import {IEnvironment} from './auth/IEnvironment';
import {IAuthOptions} from './auth/IAuthOptions';
import {AuthResolverFactory} from './auth/AuthResolverFactory';
import {ISPRequest} from './ISPrequest';
import {Cache} from './utils/Cache';

export function create(credentials: IUserCredentials, environment?: IEnvironment): ISPRequest {

  let requestDigestCache: Cache = new Cache();
  let resolversFactory: AuthResolverFactory = new AuthResolverFactory();

  let coreRequest: any = (options: OptionsWithUrl): Promise<IncomingMessage> => {
    let requestDeferred: Promise.Resolver<IncomingMessage> = Promise.defer<IncomingMessage>();

    (<RequestPromiseOptions>options).resolveWithFullResponse = true;
    (<RequestPromiseOptions>options).simple = true;

    options.headers = options.headers || {};
    if (!options.headers['Accept']) {
      options.headers['Accept'] = 'application/json;odata=verbose';
    }
    let authOptions: IAuthOptions = {
      options: options,
      credentials: credentials,
      env: environment
    };

    resolversFactory
      .Resolve(authOptions.options.url)
      .ApplyAuthHeaders(authOptions)
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
    let cachedDigest: string = requestDigestCache.get<string>(url);

    requestDigestCache.set('mykey', 'myval');

    if (cachedDigest) {
      requestDeferred.resolve(cachedDigest);
      return requestDeferred.promise;
    }

    spRequestFunc.post(`${url}/_api/contextinfo`, {
      headers: {
        'content-length': '0'
      }
    })
      .then((response: IncomingMessage) => {
        let data: any = JSON.parse(response.body);
        let digest: string = data.d.GetContextWebInformation.FormDigestValue;
        let timeout: number = parseInt(data.d.GetContextWebInformation.FormDigestTimeoutSeconds, 10);
        requestDigestCache.set(url, digest, timeout - 30);
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
