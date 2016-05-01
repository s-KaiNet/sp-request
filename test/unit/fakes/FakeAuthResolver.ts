import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';

import {IAuthResolver} from './../../../src/core/auth/IAuthResolver';
import {IAuthOptions} from './../../../src/core/auth/IAuthOptions';

export class FakeAuthResolver implements IAuthResolver {
  constructor(private authOptions: IAuthOptions) { }

  public ApplyAuthHeaders(): Promise<OptionsWithUrl> {
    let deferred: Promise.Resolver<OptionsWithUrl> = Promise.defer<OptionsWithUrl>();
    deferred.resolve(this.authOptions.options);

    return deferred.promise;
  }
}