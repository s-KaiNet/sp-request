import * as url from 'url';

import {IAuthResolver} from './IAuthResolver';
import {OnPremResolver} from './OnPremResolver';
import {OnlineResolver} from './OnlineResolver';

export class AuthResolverFactory {
  public resolve(siteUrl: string): IAuthResolver {
    let host: string = (url.parse(siteUrl)).host;
    let isOnPrem: boolean = host.indexOf('.sharepoint.com') === -1 && host.indexOf('.sharepoint.cn') === -1;

    if (isOnPrem) {
      return new OnPremResolver();
    }

    return new OnlineResolver();
  }
}
