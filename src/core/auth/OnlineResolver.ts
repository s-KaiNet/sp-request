import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';
import * as consts from 'constants';

let sp: any = require('node-spoauth');

import {IAuthResolver} from './IAuthResolver';
import {IAuthOptions} from './IAuthOptions';

export class OnlineResolver implements IAuthResolver {

  constructor(private authOptions: IAuthOptions) { }

  public ApplyAuthHeaders(): Promise<OptionsWithUrl> {
    let deferred: Promise.Resolver<OptionsWithUrl> = Promise.defer<OptionsWithUrl>();

    let service: any = new sp.RestService(this.authOptions.options.url);

    let signin: (username: string, password: string) => Promise<any> =
      Promise.promisify<any, string, string>(service.signin, { context: service });

    signin(this.authOptions.credentials.username, this.authOptions.credentials.password)
      .then((auth) => {
        this.authOptions.options.headers = this.authOptions.options.headers || {};
        this.authOptions.options.headers['Cookie'] = `FedAuth=${auth.FedAuth}; rtFa=${auth.rtFa}`;
        this.authOptions.options['secureOptions'] = consts.SSL_OP_NO_TLSv1_2;

        deferred.resolve(this.authOptions.options);
      })
      .catch((err) => {
        deferred.reject(err);
      });

    return deferred.promise;
  }
}
