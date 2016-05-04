import * as url from 'url';

import {IAuthResolver} from './IAuthResolver';
import {OnPremResolver} from './OnPremResolver';
import {OnlineResolver} from './OnlineResolver';
import {Cache} from './../utils/Cache';

export class AuthResolverFactory {
  private _resolversCache: Cache = new Cache();
  private _onpremKey: string = 'AuthResolverFactory_onprem';
  private _onlineKey: string = 'AuthResolverFactory_online';

  public resolve(siteUrl: string): IAuthResolver {
    let isOnPrem: boolean = (url.parse(siteUrl)).host.indexOf('.sharepoint.com') === -1;

    if (isOnPrem) {
      let onpremResolver: OnPremResolver = this._resolversCache.get<OnPremResolver>(this._onpremKey);
      if (!onpremResolver) {
        this._resolversCache.set(this._onpremKey, new OnPremResolver());
      }
      return this._resolversCache.get<OnPremResolver>(this._onpremKey);
    }

    let onlineResolver: OnlineResolver = this._resolversCache.get<OnlineResolver>(this._onlineKey);
    if (!onlineResolver) {
      this._resolversCache.set(this._onlineKey, new OnlineResolver());
    }

    return this._resolversCache.get<OnlineResolver>(this._onlineKey);
  }
}
