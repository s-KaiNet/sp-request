import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';

import {IAuthOptions} from './IAuthOptions';

export interface IAuthResolver {
  ApplyAuthHeaders: (authOptions: IAuthOptions) => Promise<OptionsWithUrl>;
}
