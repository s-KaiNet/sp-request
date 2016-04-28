import {OptionsWithUrl} from 'request';

import {IUserCredentials} from './../interfaces/IUserCredentials';
import {IOAuthCredentials} from './../interfaces/IOAuthCredentials';
import {IEnvironment} from './../interfaces/IEnvironment';

export interface IAuthOptions {
  options: OptionsWithUrl;
  credentials: IUserCredentials | IOAuthCredentials;
  env: IEnvironment;
}

