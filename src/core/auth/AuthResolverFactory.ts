import * as url from 'url';

import {IAuthResolver} from './IAuthResolver';
import {OnPremResolver} from './OnPremResolver';
import {OnlineResolver} from './OnlineResolver';

export class AuthResolverFactory {
  public resolve(siteUrl: string): IAuthResolver {
    let isOnPrem: boolean = (url.parse(siteUrl)).host.indexOf('.sharepoint.com') === -1;

    if (isOnPrem) {
      return new OnPremResolver();
    }

    return new OnlineResolver();
  }
}
