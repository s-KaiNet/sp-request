import {expect} from 'chai';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import * as consts from 'constants';

import {IAuthOptions} from './../../src/core/auth/IAuthOptions';
import {IUserCredentials} from './../../src/core/auth/IUserCredentials';
import {OnlineResolver} from './../../src/core/auth/OnlineResolver';

let creds: IUserCredentials = {
  username: 'user',
  password: 'pass'
};

let onlineOptions: IAuthOptions = {
  credentials: creds,
  options: {
    url: 'https://sp2013dev.sharepoint.com/sites/dev/_api'
  },
  env: undefined
};

let authResponse: any = {
  FedAuth: 'fedauth',
  rtFa: 'rtfa'
};

let cookieString: string = `FedAuth=${authResponse.FedAuth}; rtFa=${authResponse.rtFa}`;

describe('sp-request: OnlineResolver', () => {
  let resolver: OnlineResolver;
  let siginStup: SinonStub;

  beforeEach(() => {
    let resolverModule: any = require('./../../src/core/auth/OnlineResolver');
    resolver = new resolverModule.OnlineResolver(onlineOptions);
    let sp: any = require('node-spoauth');
    siginStup = sinon.stub(sp.RestService.prototype, 'signin');
  });

  afterEach(() => {
    siginStup.restore();
  });

  it('should set cookie header', (done) => {
    siginStup.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    resolver.ApplyAuthHeaders()
      .then((options) => {
        expect(options.headers['Cookie']).to.equal(cookieString);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should set secureOptions', (done) => {
    siginStup.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    resolver.ApplyAuthHeaders()
      .then((options) => {
        expect(options['secureOptions']).to.equal(consts.SSL_OP_NO_TLSv1_2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should throws en error', (done) => {
    let error: string = 'error';
    siginStup.throws(error);

    resolver.ApplyAuthHeaders()
      .then((options) => {
        //
      })
      .catch((err) => {
        expect(err.name).to.equal(error);
        done();
      });
  });
});
