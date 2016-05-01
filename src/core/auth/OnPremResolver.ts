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
import {IEnvironment} from './../interfaces/IEnvironment';

export class OnPremResolver implements IAuthResolver {

  constructor(private authOptions: IAuthOptions) { }

  public ApplyAuthHeaders(): Promise<OptionsWithUrl> {
    let deferred: Promise.Resolver<OptionsWithUrl> = Promise.defer<OptionsWithUrl>();

    let environmentOptions: IEnvironment = _.defaults(this.authOptions.env, <IEnvironment>{ domain: '', workstation: '' });
    let ntlmOptions: any = _.assign(this.authOptions.credentials, environmentOptions);
    ntlmOptions.url = this.authOptions.options.url;

    let isHttps: boolean = url.parse(this.authOptions.options.url).protocol === 'https:';

    let keepaliveAgent: any = isHttps ? new agent.HttpsAgent() : new agent();

    let type1msg: any = ntlm.createType1Message(ntlmOptions);

    rp({
      url: this.authOptions.options.url,
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

        this.authOptions.options.headers['Connection'] = 'Close';
        this.authOptions.options.headers['Authorization'] = type3msg;
        this.authOptions.options.agent = keepaliveAgent;

        deferred.resolve(this.authOptions.options);
      }, (err: any) => {
        deferred.reject(err);
      });

    return deferred.promise;
  }
}
