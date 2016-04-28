import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';

export interface IAuthResolver {
  ApplyAuthHeaders: () => Promise<OptionsWithUrl>;
}
