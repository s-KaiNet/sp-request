import {OptionsWithUrl} from 'request';
import * as url from 'url';

import {IAuthResolver} from './IAuthResolver';
import {IUserCredentials} from './../interfaces/IUserCredentials';
import {IOAuthCredentials} from './../interfaces/IOAuthCredentials';
import {IEnvironment} from './../interfaces/IEnvironment';
import {OnPremResolver} from './OnPremResolver';
import {OAuthResolver} from './OAuthResolver';
import {OnlineResolver} from './OnlineResolver';

export class AuthResolverFactory {
  public static Resolve(
    options: OptionsWithUrl, credentials: IUserCredentials | IOAuthCredentials, environment?: IEnvironment): IAuthResolver {
    let isOnPrem: boolean = (url.parse(options.url)).host.indexOf('.sharepoint.com') === -1;

    if (isOnPrem) {
      return new OnPremResolver();
    }

    if ((<any>credentials).clientId) {
      return new OAuthResolver();
    }

    return new OnlineResolver();
  }
}
