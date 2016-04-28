import {OptionsWithUrl, CoreOptions} from 'request';
import {RequestPromiseOptions} from 'request-promise';
import {IncomingMessage} from 'http';
import * as rp from 'request-promise';
import * as Promise from 'bluebird';

import {IUserCredentials} from './interfaces/IUserCredentials';
import {IOAuthCredentials} from './interfaces/IOAuthCredentials';
import {IEnvironment} from './interfaces/IEnvironment';
import {AuthResolverFactory} from './auth/AuthResolverFactory';
import {IAuthOptions} from './auth/IAuthOptions';
import {ISPrequest} from './interfaces/ISPrequest';

export function create(credentials: IUserCredentials | IOAuthCredentials, environment?: IEnvironment): ISPrequest {

  let coreRequest: any = (options: OptionsWithUrl): Promise<IncomingMessage> => {
    let requestDeferred: Promise.Resolver<IncomingMessage> = Promise.defer<IncomingMessage>();

    let requestPromiseOptions: RequestPromiseOptions = <RequestPromiseOptions>options;
    requestPromiseOptions.resolveWithFullResponse = true;

    AuthResolverFactory
      .Resolve(options, credentials, environment)
      .ApplyAuthHeaders(<IAuthOptions>{
        options: options,
        credentials: credentials,
        env: environment
      })
      .then((opts) => {

        rp(opts.url, requestPromiseOptions)
          .then((response: IncomingMessage) => {
            requestDeferred.resolve(response);
          }, (err) => {
            requestDeferred.reject(err);
          });

      }, (err) => {
        requestDeferred.reject(err);
      });

    return requestDeferred.promise;
  };

  let spRequestFunc: any = (options: OptionsWithUrl | string, coreOptions?: CoreOptions): Promise<IncomingMessage> => {

    if (typeof options === 'string') {

      let url: string = options;
      let newOptions: OptionsWithUrl;

      if (coreOptions !== null) {
        newOptions = <OptionsWithUrl>coreOptions;
        newOptions.url = url;
      } else {
        newOptions = <OptionsWithUrl>{
          url: url
        };
      }
      coreRequest(newOptions);
    } else {
      return coreRequest(options);
    }
  };

  ['get', 'post'].forEach((method: string) => {
    spRequestFunc[method] = (opts: rp.RequestPromiseOptions): rp.RequestPromise => {
      opts.method = method;
      return spRequestFunc(opts);
    };
  });

  return spRequestFunc;
}
