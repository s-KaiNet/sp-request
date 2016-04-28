import * as url from 'url';

import {IAuthResolver} from './IAuthResolver';
import {OnPremResolver} from './OnPremResolver';
import {OAuthResolver} from './OAuthResolver';
import {OnlineResolver} from './OnlineResolver';
import {IAuthOptions} from './IAuthOptions';

export class AuthResolverFactory {
  public static Resolve(authOptions: IAuthOptions): IAuthResolver {
    let isOnPrem: boolean = (url.parse(authOptions.options.url)).host.indexOf('.sharepoint.com') === -1;

    if (isOnPrem) {
      return new OnPremResolver(authOptions);
    }

    if ((<any>authOptions.credentials).clientId) {
      return new OAuthResolver(authOptions);
    }

    return new OnlineResolver(authOptions);
  }
}
