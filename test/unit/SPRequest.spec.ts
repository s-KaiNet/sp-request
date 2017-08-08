import {expect} from 'chai';
import * as sinon from 'sinon';
import {SinonStub, SinonSpyCall} from 'sinon';
import * as mockery from 'mockery';
import {OptionsWithUrl} from 'request';
import * as spauth from 'node-sp-auth';

import {ISPRequest} from './../../src/core/ISPRequest';
import {defer, IDeferred} from './Defer';

let spUrl: string = 'https://your_sp_api_endpoint';

let creds: spauth.IOnpremiseUserCredentials = {
  username: 'user',
  password: 'pass',
  domain: 'sp'
};

let defaultAcceptHeader: string = 'application/json;odata=verbose';

describe('sp-request: direct call tests - sprequest(...)', () => {

  let requestPromiseStub: SinonStub;
  let sprequest: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: IDeferred<any> = defer();
    requestDeferred.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);
    mockery.registerMock('node-sp-auth', {
      getAuth: (data: any) => {
        return Promise.resolve({});
      }
    });

    sprequest = require('./../../src/core/SPRequest');
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call request-promise', (done) => {

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

  let requestPromiseStub: SinonStub;
  let sprequest: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: IDeferred<any> = defer();
    requestDeferred.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    sprequest = require('./../../src/core/SPRequest');

    mockery.registerMock('node-sp-auth', {
      getAuth: (data: any) => {
        return Promise.resolve({});
      }
    });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call request-promise with method "GET" when called with string param', (done) => {

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

  let requestPromiseStub: SinonStub;
  let sprequest: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: IDeferred<any> = defer();
    requestDeferred.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    sprequest = require('./../../src/core/SPRequest');

    mockery.registerMock('node-sp-auth', {
      getAuth: (data: any) => {
        return Promise.resolve({});
      }
    });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call request-promise with method "GET" when called with string param', (done) => {

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

    let request: ISPRequest = sprequest.create(creds);

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

  let requestPromiseStub: SinonStub;
  let sprequest: any;

  let error: Error = new Error('Uknown error occurred');


  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    let requestDeferred: IDeferred<any> = defer();
    requestDeferred.reject(error);

    requestPromiseStub = sinon.stub().returns(requestDeferred.promise);

    mockery.registerMock('request-promise', requestPromiseStub);

    sprequest = require('./../../src/core/SPRequest');

    mockery.registerMock('node-sp-auth', {
      getAuth: (data: any) => {
        return Promise.resolve({});
      }
    });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should throw an error', (done) => {

    let request: ISPRequest = sprequest.create(creds);

    request.get(spUrl, {})
      .then((data) => {
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

describe('sp-request: get request digest', () => {

  let sprequest: any;

  beforeEach(() => {
    sprequest = require('./../../src/core/SPRequest');
  });


  it('should retrun request digest', (done) => {
    let requestDeferred: IDeferred<any> = defer();

    let request: ISPRequest = sprequest.create(creds);
    let digest: string = 'digest value';
    let digestUrl: string = `${spUrl}/_api/contextinfo`;
    let response: any = {
      d: {
        GetContextWebInformation: {
          FormDigestValue: digest,
          FormDigestTimeoutSeconds: 0
        }
      }
    };

    requestDeferred.resolve({
      body: response
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
    let request: ISPRequest = sprequest.create(creds);
    let requestDeferred: IDeferred<any> = defer();
    let error: Error = new Error('unexpected error');
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
    let requestDeferred: IDeferred<any> = defer();

    let request: ISPRequest = sprequest.create(creds);
    let digest: string = 'digest value';
    let response: any = {
      d: {
        GetContextWebInformation: {
          FormDigestValue: digest,
          FormDigestTimeoutSeconds: 100
        }
      }
    };

    requestDeferred.resolve({
      body: response
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
