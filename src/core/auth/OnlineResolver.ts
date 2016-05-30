import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';
import * as consts from 'constants';
import * as url from 'url';
import * as util from 'util';

let sp: any = require('node-spoauth');

import {IAuthResolver} from './IAuthResolver';
import {IAuthOptions} from './IAuthOptions';
import {Cache} from './../utils/Cache';

export class OnlineResolver implements IAuthResolver {

  private static _cookieCache: Cache = new Cache();

  public applyAuthHeaders(authOptions: IAuthOptions): Promise<OptionsWithUrl> {
    return new Promise<OptionsWithUrl>((resolve, reject) => {
      let host: string = url.parse(authOptions.options.url).host;
      let cacheKey: string = util.format('%s@%s', host, authOptions.credentials.username);
      let cachedCookie: string = OnlineResolver._cookieCache.get<string>(cacheKey);

      if (cachedCookie) {
        this.setHeaders(authOptions.options, cachedCookie);

        resolve(authOptions.options);
        return;
      }

      let service: any = new sp.RestService(authOptions.options.url);

      let signin: (username: string, password: string) => Promise<any> =
        Promise.promisify<any, string, string>(service.signin, { context: service });

      signin(authOptions.credentials.username, authOptions.credentials.password)
        .then((auth) => {
          let cookie: string = `FedAuth=${auth.FedAuth}; rtFa=${auth.rtFa}`;
          OnlineResolver._cookieCache.set(cacheKey, cookie, 30 * 60);
          this.setHeaders(authOptions.options, cookie);

          resolve(authOptions.options);
        })
        .catch(reject);
    });
  }

  private setHeaders(options: OptionsWithUrl, cookie: string): void {
    options.headers = options.headers || {};
    options.headers['Cookie'] = cookie;
    options['secureOptions'] = consts.SSL_OP_NO_TLSv1_2;
  }
}
