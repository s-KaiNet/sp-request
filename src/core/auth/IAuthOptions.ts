import {OptionsWithUrl} from 'request';

import {IUserCredentials} from './../interfaces/IUserCredentials';
import {IEnvironment} from './../interfaces/IEnvironment';

export interface IAuthOptions {
  options: OptionsWithUrl;
  credentials: IUserCredentials;
  env: IEnvironment;
}

