import {OptionsWithUrl} from 'request';
import * as Promise from 'bluebird';
import * as url from 'url';
import * as _ from 'lodash';
import * as rp from 'request-promise';
import {IncomingMessage} from 'http';

let agent: any = require('agentkeepalive');
let ntlm: any = require('httpntlm').ntlm;

import {IAuthResolver} from './IAuthResolver';
import {IAuthOptions} from './IAuthOptions';
import {IEnvironment} from './IEnvironment';

export class OnPremResolver implements IAuthResolver {
  public applyAuthHeaders(authOptions: IAuthOptions): Promise<OptionsWithUrl> {
    let deferred: Promise.Resolver<OptionsWithUrl> = Promise.defer<OptionsWithUrl>();

    let environmentOptions: IEnvironment = _.defaults(authOptions.env, <IEnvironment>{ domain: '', workstation: '' });
    let ntlmOptions: any = _.assign(authOptions.credentials, environmentOptions);
    ntlmOptions.url = authOptions.options.url;

    let isHttps: boolean = url.parse(authOptions.options.url).protocol === 'https:';

    let keepaliveAgent: any = isHttps ? new agent.HttpsAgent() : new agent();

    let type1msg: any = ntlm.createType1Message(ntlmOptions);

    /* workaround for on premise self signed or not trusted certificates */
    if (isHttps) {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    }

    rp({
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
        authOptions.options.agent = keepaliveAgent;

        deferred.resolve(authOptions.options);
      })
      .catch((err) => {
        deferred.reject(err);
      });

    return deferred.promise;
  }
}
