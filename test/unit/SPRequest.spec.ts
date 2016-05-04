import {expect} from 'chai';
import * as sinon from 'sinon';
import {SinonStub, SinonSpyCall} from 'sinon';
import * as mockery from 'mockery';
import {OptionsWithUrl} from 'request';

import {ISPRequest} from './../../src/core/ISPRequest';
import {IAuthOptions} from './../../src/core/auth/IAuthOptions';
import {FakeAuthResolver} from './fakes/FakeAuthResolver';
import {IUserCredentials} from './../../src/core/auth/IUserCredentials';
import {IEnvironment} from './../../src/core/auth/IEnvironment';

let spUrl: string = 'https://your_sp_api_endpoint';

let creds: IUserCredentials = {
  username: 'user',
  password: 'pass'
};

let env: IEnvironment = {
  domain: 'sp'
};

let defaultAcceptHeader: string = 'application/json;odata=verbose';

describe('sp-request: direct call tests - sprequest(...)', () => {

  let authResolveStub: SinonStub;
  let requestPromiseStub: SinonStub;
  let sprequest: any;
  let authFactory: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: Promise.Resolver<any> = Promise.defer();
    requestDeferred.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    authFactory = require('./../../src/core/auth/AuthResolverFactory');
    sprequest = require('./../../src/core/SPRequest');

    authResolveStub = sinon.stub(authFactory.AuthResolverFactory.prototype, 'Resolve', (authOptions: IAuthOptions) => {
      return new FakeAuthResolver();
    });
  });

  afterEach(() => {
    authResolveStub.restore();
    mockery.disable();
  });

  it('should call request-promise', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request(spUrl)
      .then((data) => {
        expect(requestPromiseStub.called).is.true;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with "GET" method when provided directly', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request(spUrl, {
      method: 'GET'
    })
      .then((data) => {

        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with "POST" method when provided directly', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request(spUrl, {
      method: 'POST'
    })
      .then((data) => {

        expect(requestPromiseStub.called).is.true;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });


  it('should set default accept header', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request(spUrl)
      .then((data) => {

        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.headers['Accept']).to.equal(defaultAcceptHeader);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with string param', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request(spUrl)
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with options object', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request({
      url: spUrl
    })
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with string as first param and object as second', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request(spUrl, {})
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('sp-request: helper call tests - sprequest.get(...)', () => {

  let authResolveStub: SinonStub;
  let requestPromiseStub: SinonStub;
  let sprequest: any;
  let authFactory: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: Promise.Resolver<any> = Promise.defer();
    requestDeferred.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    authFactory = require('./../../src/core/auth/AuthResolverFactory');
    sprequest = require('./../../src/core/SPRequest');

    authResolveStub = sinon.stub(authFactory.AuthResolverFactory.prototype, 'Resolve', (authOptions: IAuthOptions) => {
      return new FakeAuthResolver();
    });
  });

  afterEach(() => {
    authResolveStub.restore();
    mockery.disable();
  });

  it('should call request-promise with method "GET" when called with string param', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.get(spUrl)
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with options object', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.get({
      url: spUrl
    })
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with string as first param and object as second', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.get(spUrl, {})
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

describe('sp-request: helper call tests - sprequest.post(...)', () => {

  let authResolveStub: SinonStub;
  let requestPromiseStub: SinonStub;
  let sprequest: any;
  let authFactory: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: Promise.Resolver<any> = Promise.defer();
    requestDeferred.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    authFactory = require('./../../src/core/auth/AuthResolverFactory');
    sprequest = require('./../../src/core/SPRequest');

    authResolveStub = sinon.stub(authFactory.AuthResolverFactory.prototype, 'Resolve', (authOptions: IAuthOptions) => {
      return new FakeAuthResolver();
    });
  });

  afterEach(() => {
    authResolveStub.restore();
    mockery.disable();
  });

  it('should call request-promise with method "GET" when called with string param', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.post(spUrl)
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('POST');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with options object', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.post({
      url: spUrl
    })
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('POST');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call request-promise with method "GET" when called with string as first param and object as second', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.post(spUrl, {})
      .then((data) => {
        let call: SinonSpyCall = requestPromiseStub.getCall(0);
        let options: OptionsWithUrl = call.args[0];

        expect(options.method.toUpperCase()).to.equal('POST');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

});

describe('sp-request: throws an error', () => {

  let authResolveStub: SinonStub;
  let requestPromiseStub: SinonStub;
  let sprequest: any;
  let authFactory: any;
  let error: any = {
    message: 'Uknown error occurred',
    code: 1
  };

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: Promise.Resolver<any> = Promise.defer();
    requestDeferred.reject(error);

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    authFactory = require('./../../src/core/auth/AuthResolverFactory');
    sprequest = require('./../../src/core/SPRequest');

    authResolveStub = sinon.stub(authFactory.AuthResolverFactory.prototype, 'Resolve', (authOptions: IAuthOptions) => {
      return new FakeAuthResolver();
    });
  });

  afterEach(() => {
    authResolveStub.restore();
    mockery.disable();
  });

  it('should throw an error', (done) => {

    let request: ISPRequest = sprequest.create(creds, env);

    request.get(spUrl, {})
      .then((data) => {
        //
      }, (err) => {
        expect(err.code).to.equal(error.code);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});

describe('sp-request: get request digest', () => {

  let sprequest: any;

  beforeEach(() => {
    sprequest = require('./../../src/core/SPRequest');
  });


  it('should retrun request digest', (done) => {
    let requestDeferred: Promise.Resolver<any> = Promise.defer();

    let request: ISPRequest = sprequest.create(creds, env);
    let digest: string = 'digest value';
    let digestUrl: string = `${spUrl}/_api/contextinfo`;
    let responseString: string = `
    {
      "d": {
        "GetContextWebInformation": {
          "FormDigestValue": "${digest}",
          "FormDigestTimeoutSeconds": "0"
        }
      }
    }`;

    requestDeferred.resolve({
      body: responseString
    });

    let postStup: SinonStub = sinon.stub(request, 'post').returns(requestDeferred.promise);
    request.requestDigest(spUrl)
      .then((digestValue) => {
        let call: SinonSpyCall = postStup.getCall(0);
        let url: string = call.args[0];

        expect(url).to.equal(digestUrl);
        expect(postStup.called).is.true;
        expect(digestValue).to.equal(digest);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should throw an error', (done) => {
    let request: ISPRequest = sprequest.create(creds, env);
    let requestDeferred: Promise.Resolver<any> = Promise.defer();
    let error: string = 'unexpected error';
    requestDeferred.reject(error);

    sinon.stub(request, 'post').returns(requestDeferred.promise);
    request.requestDigest(spUrl)
      .then((digestValue) => {
        //
      })
      .catch((err) => {
        expect(err).to.equal(error);
        done();
      });
  });

  it('should retrun request digest from cache on subsequence calls', (done) => {
    let requestDeferred: Promise.Resolver<any> = Promise.defer();

    let request: ISPRequest = sprequest.create(creds, env);
    let digest: string = 'digest value';
    let responseString: string = `
    {
      "d": {
        "GetContextWebInformation": {
          "FormDigestValue": "${digest}",
          "FormDigestTimeoutSeconds": "100"
        }
      }
    }`;

    requestDeferred.resolve({
      body: responseString
    });

    let postStup: SinonStub = sinon.stub(request, 'post').returns(requestDeferred.promise);

    request.requestDigest(spUrl)
      .then((digest1) => {
        postStup.restore();
        sinon.stub(request, 'post').throws();
        return request.requestDigest(spUrl);
      })
      .then((digestValue) => {
        expect(digestValue).to.equal(digest);
        done();
      })
      .catch((err) => {
        done(err);
      });
  });
});
