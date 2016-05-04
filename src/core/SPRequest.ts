import {OptionsWithUrl, CoreOptions} from 'request';
import {RequestPromiseOptions} from 'request-promise';
import {IncomingMessage} from 'http';
import * as requestp from 'request-promise';
import * as Promise from 'bluebird';

import {IUserCredentials} from './interfaces/IUserCredentials';
import {IEnvironment} from './interfaces/IEnvironment';
import {AuthResolverFactory} from './auth/AuthResolverFactory';
import {ISPRequest} from './interfaces/ISPrequest';

export function create(credentials: IUserCredentials, environment?: IEnvironment): ISPRequest {

  let coreRequest: any = (options: OptionsWithUrl): Promise<IncomingMessage> => {
    let requestDeferred: Promise.Resolver<IncomingMessage> = Promise.defer<IncomingMessage>();

    (<RequestPromiseOptions>options).resolveWithFullResponse = true;
    (<RequestPromiseOptions>options).simple = true;

    options.headers = options.headers || {};
    if (!options.headers['Accept']) {
      options.headers['Accept'] = 'application/json;odata=verbose';
    }

    AuthResolverFactory
      .Resolve({
        options: options,
        credentials: credentials,
        env: environment
      })
      .ApplyAuthHeaders()
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
