import {expect} from 'chai';
import * as sinon from 'sinon';
import {SinonStub, SinonSpyCall} from 'sinon';
import * as mockery from 'mockery';
import {OptionsWithUrl} from 'request';

import {IAuthOptions} from './../../src/core/auth/IAuthOptions';
import {IUserCredentials} from './../../src/core/auth/IUserCredentials';
import {IEnvironment} from './../../src/core/auth/IEnvironment';
import {OnPremResolver} from './../../src/core/auth/OnPremResolver';
import {defer, IDeferred} from './../../src/core/utils/Defer';

let creds: IUserCredentials = {
  username: 'user',
  password: 'pass'
};

let env: IEnvironment = {
  domain: 'sp'
};

let onpremOptions: IAuthOptions = {
  credentials: creds,
  env: env,
  options: {
    url: 'https://sp2013dev/sites/dev/_api'
  }
};

describe('sp-request: OnPremResolver', () => {

  let requestPromiseStub: SinonStub;
  let type1Message: string = 'type1Message';
  let type2Message: string = 'type2Message';
  let type3Message: string = 'type3Message';
  let resolver: OnPremResolver;
  let requestDeferred: IDeferred<any>;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    requestDeferred = defer();

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    let resolverModule: any = require('./../../src/core/auth/OnPremResolver');
    resolver = new resolverModule.OnPremResolver();
    let ntlm: any = require('httpntlm').ntlm;
    sinon.stub(ntlm, 'createType1Message').returns(type1Message);
    sinon.stub(ntlm, 'parseType2Message').returns(type2Message);
    sinon.stub(ntlm, 'createType3Message').returns(type3Message);
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call request-promise with type1message', (done) => {
    requestDeferred.resolve({
      headers: {
        'www-authenticate': ''
      }
    });

    resolver.applyAuthHeaders(onpremOptions)
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(requestPromiseStub.called).is.true;

        expect(options.headers['Authorization']).to.equal(type1Message);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should resolve options with type3message', (done) => {
    requestDeferred.resolve({
      headers: {
        'www-authenticate': ''
      }
    });

    resolver.applyAuthHeaders(onpremOptions)
      .then((options: OptionsWithUrl) => {
        expect(options.headers['Authorization']).to.equal(type3Message);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should throw en error in case of promise rejection', (done) => {
    let error: Error = new Error('err');
    requestDeferred.reject(error);

    resolver.applyAuthHeaders(onpremOptions)
      .then((options: OptionsWithUrl) => {
        //
      }, (err) => {
        expect(err).to.equal(error);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
