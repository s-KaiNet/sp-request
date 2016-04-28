import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';

import {IAuthResolver} from './IAuthResolver';
import {IAuthOptions} from './IAuthOptions';

export class OAuthResolver implements IAuthResolver {

  constructor(private authOptions: IAuthOptions) { }

  public ApplyAuthHeaders(): Promise<OptionsWithUrl> {
    return null;
  }
}
