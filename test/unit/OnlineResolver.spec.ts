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
  let signinStub: SinonStub;
  let sp: any;

  beforeEach(() => {
    let resolverModule: any = require('./../../src/core/auth/OnlineResolver');
    resolver = new resolverModule.OnlineResolver();
    sp = require('node-spoauth');
    signinStub = sinon.stub(sp.RestService.prototype, 'signin');
  });

  afterEach(() => {
    signinStub.restore();
  });

  it('should set cookie header', (done) => {
    signinStub.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        expect(options.headers['Cookie']).to.equal(cookieString);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should replace ampersand symbol', (done) => {
    signinStub.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    onlineOptions.credentials.password = 'p&ss&';
    onlineOptions.credentials.username = 'new_user1';

    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        expect(onlineOptions.credentials.password).to.equal('p&amp;ss&amp;');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should not replace ampersand html code', (done) => {
    signinStub.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    onlineOptions.credentials.password = 'p&amp;ss';
    onlineOptions.credentials.username = 'new_user2';

    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        expect(onlineOptions.credentials.password).to.equal('p&amp;ss');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should not replace ampersand html code but replace ampersand symbol', (done) => {
    signinStub.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    onlineOptions.credentials.password = 'p&amp;ss&';
    onlineOptions.credentials.username = 'new_user3';

    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        expect(onlineOptions.credentials.password).to.equal('p&amp;ss&amp;');
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should set secureOptions', (done) => {
    signinStub.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        expect(options['secureOptions']).to.equal(consts.SSL_OP_NO_TLSv1_2);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should get value from cache', (done) => {
    let error: string = 'error';
    signinStub.callsArgWith(2, null, {
      FedAuth: 'fedauth',
      rtFa: 'rtfa'
    });

    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        signinStub.restore();
        sinon.stub(sp.RestService.prototype, 'signin').throws(error);
        return resolver.applyAuthHeaders(onlineOptions);
      })
      .then((options) => {
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should throws en error', (done) => {
    let error: string = 'error';
    signinStub.throws(error);
    onlineOptions.options.url = 'https://host1.com';
    resolver.applyAuthHeaders(onlineOptions)
      .then((options) => {
        done(new Error('should not call success handler'));
      })
      .catch((err) => {
        expect(err.name).to.equal(error);
        done();
      });
  });
});
