import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';
import * as _ from 'lodash';
import * as url from 'url';
import * as rp from 'request-promise';
import {IncomingMessage} from 'http';

let ntlm: any = require('httpntlm').ntlm;
let agent: any = require('agentkeepalive');

import {IAuthResolver} from './IAuthResolver';
import {IAuthOptions} from './IAuthOptions';
import {IEnvironment} from './IEnvironment';

export class OnPremResolver implements IAuthResolver {
  public applyAuthHeaders(authOptions: IAuthOptions): Promise<OptionsWithUrl> {

    return new Promise<OptionsWithUrl>((resolve, reject) => {
      let environmentOptions: IEnvironment = _.defaults(authOptions.env, <IEnvironment>{ domain: '', workstation: '' });
      let ntlmOptions: any = _.assign(authOptions.credentials, environmentOptions);
      ntlmOptions.url = authOptions.options.url;

      let type1msg: any = ntlm.createType1Message(ntlmOptions);

      let isHttps: boolean = url.parse(authOptions.options.url).protocol === 'https:';

      let keepaliveAgent: any = isHttps ? new agent.HttpsAgent() : new agent();

      rp(<any>{
        url: authOptions.options.url,
        method: 'GET',
        headers: {
          'Connection': 'keep-alive',
          'Authorization': type1msg,
          'Accept': 'application/json;odata=verbose'
        },
        agent: keepaliveAgent,
        resolveWithFullResponse: true,
        simple: false
      })
        .then((response: IncomingMessage) => {
          let type2msg: any = ntlm.parseType2Message(response.headers['www-authenticate']);
          let type3msg: any = ntlm.createType3Message(type2msg, ntlmOptions);

          authOptions.options.headers = authOptions.options.headers || {};
          authOptions.options.headers['Connection'] = 'Close';
          authOptions.options.headers['Authorization'] = type3msg;
          authOptions.options.strictSSL = false;
          (<any>authOptions.options).agent = keepaliveAgent;

          resolve(authOptions.options);

          return null;
        })
        .catch(reject);
    });
  }
}
