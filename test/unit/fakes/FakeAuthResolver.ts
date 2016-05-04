import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';

import {IAuthResolver} from './../../../src/core/auth/IAuthResolver';
import {IAuthOptions} from './../../../src/core/auth/IAuthOptions';

export class FakeAuthResolver implements IAuthResolver {
  public applyAuthHeaders(authOptions: IAuthOptions): Promise<OptionsWithUrl> {
    let deferred: Promise.Resolver<OptionsWithUrl> = Promise.defer<OptionsWithUrl>();
    deferred.resolve(authOptions.options);

    return deferred.promise;
  }
}
