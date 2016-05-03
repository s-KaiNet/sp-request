import * as url from 'url';

import {IAuthResolver} from './IAuthResolver';
import {OnPremResolver} from './OnPremResolver';
import {OnlineResolver} from './OnlineResolver';
import {IAuthOptions} from './IAuthOptions';

export class AuthResolverFactory {
  public static Resolve(authOptions: IAuthOptions): IAuthResolver {
    let isOnPrem: boolean = (url.parse(authOptions.options.url)).host.indexOf('.sharepoint.com') === -1;

    if (isOnPrem) {
      return new OnPremResolver(authOptions);
    }

    return new OnlineResolver(authOptions);
  }
}
