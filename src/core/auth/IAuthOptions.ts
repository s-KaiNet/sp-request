import {OptionsWithUrl} from 'request';

import {IUserCredentials} from './IUserCredentials';
import {IEnvironment} from './IEnvironment';

export interface IAuthOptions {
  options: OptionsWithUrl;
  credentials: IUserCredentials;
  env: IEnvironment;
}

