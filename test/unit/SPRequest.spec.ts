import { expect } from 'chai';
import * as sinon from 'sinon';
import { SinonStub, SinonSpyCall } from 'sinon';
import * as mockery from 'mockery';
import * as spauth from 'node-sp-auth';

import { ISPRequest, ISPRequestOptions } from '../../src/core/types';

const spUrl = 'https://your_sp_api_endpoint';

const creds: spauth.IOnpremiseUserCredentials = {
  username: 'user',
  password: 'pass',
  domain: 'sp'
};

const defaultAcceptHeader = 'application/json;odata=verbose';

describe('sp-request: direct call tests - sprequest(...)', () => {

  let requestPromiseStub: SinonStub;
  let sprequest: any;

  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    const requestDeferred = Promise.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred);

    mockery.registerMock('got', { default: requestPromiseStub });
    mockery.registerMock('node-sp-auth', {
      getAuth: () => {
        return Promise.resolve({});
      }
    });

    sprequest = require('./../../src/core/SPRequest');
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call got', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request(spUrl)
      .then(() => {
        expect(requestPromiseStub.called).is.true;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with "GET" method when provided directly', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request(spUrl, {
      method: 'GET'
    })
      .then(() => {

        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with "POST" method when provided directly', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request(spUrl, {
      method: 'POST'
    })
      .then(() => {

        expect(requestPromiseStub.called).is.true;

        done();
      })
      .catch((err) => {
        done(err);
      });
  });


  it('should set default accept header', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request(spUrl)
      .then(() => {

        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.headers['Accept']).to.equal(defaultAcceptHeader);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "GET" when called with string param', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request(spUrl)
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "GET" when called with options object', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request({
      url: spUrl
    })
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "GET" when called with string as first param and object as second', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request(spUrl, {})
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

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

    const requestDeferred = Promise.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred);

    mockery.registerMock('got', { default: requestPromiseStub });

    sprequest = require('./../../src/core/SPRequest');

    mockery.registerMock('node-sp-auth', {
      getAuth: () => {
        return Promise.resolve({});
      }
    });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call got with method "GET" when called with string param', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.get(spUrl)
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "GET" when called with options object', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.get({
      url: spUrl
    })
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('GET');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "GET" when called with string as first param and object as second', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.get(spUrl, {})
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

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

    const requestDeferred = Promise.resolve({ statusCode: 200 });

    requestPromiseStub = sinon.stub().returns(requestDeferred);

    mockery.registerMock('got', { default: requestPromiseStub });

    sprequest = require('./../../src/core/SPRequest');

    mockery.registerMock('node-sp-auth', {
      getAuth: () => {
        return Promise.resolve({});
      }
    });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should call got with method "POST" when called with string param', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.post(spUrl)
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('POST');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "POST" when called with options object', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.post({
      url: spUrl
    })
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

        expect(options.method.toUpperCase()).to.equal('POST');
        expect(options.url).to.equal(spUrl);

        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should call got with method "GET" when called with string as first param and object as second', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.post(spUrl, {})
      .then(() => {
        const call: SinonSpyCall = requestPromiseStub.getCall(0);
        const options: ISPRequestOptions = call.args[0];

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

  const error: Error = new Error('Uknown error occurred');


  beforeEach(() => {

    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    const requestDeferred = Promise.reject(error);

    requestPromiseStub = sinon.stub().returns(requestDeferred);

    mockery.registerMock('got', { default: requestPromiseStub });

    sprequest = require('./../../src/core/SPRequest');

    mockery.registerMock('node-sp-auth', {
      getAuth: () => {
        return Promise.resolve({});
      }
    });
  });

  afterEach(() => {
    mockery.disable();
  });

  it('should throw an error', (done) => {

    const request: ISPRequest = sprequest.create(creds);

    request.get(spUrl, {})
      .then(() => {
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
    const request: ISPRequest = sprequest.create(creds);
    const digest = 'digest value';
    const digestUrl = `${spUrl}/_api/contextinfo`;
    const response: any = {
      d: {
        GetContextWebInformation: {
          FormDigestValue: digest,
          FormDigestTimeoutSeconds: 0
        }
      }
    };

    const requestDeferred = Promise.resolve({
      body: response
    });

    const postStup: SinonStub = sinon.stub(request, 'post').returns(requestDeferred as any);
    request.requestDigest(spUrl)
      .then((digestValue) => {
        const call: SinonSpyCall = postStup.getCall(0);
        const url: string = call.args[0];

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
    const request: ISPRequest = sprequest.create(creds);
    const error: Error = new Error('unexpected error');
    const requestDeferred = Promise.reject(error);

    sinon.stub(request, 'post').returns(requestDeferred as any);
    request.requestDigest(spUrl)
      .then(() => {
        //
      })
      .catch((err) => {
        expect(err).to.equal(error);
        done();
      });
  });

  it('should retrun request digest from cache on subsequence calls', (done) => {
    const request: ISPRequest = sprequest.create(creds);
    const digest = 'digest value';
    const response: any = {
      d: {
        GetContextWebInformation: {
          FormDigestValue: digest,
          FormDigestTimeoutSeconds: 100
        }
      }
    };

    const requestDeferred = Promise.resolve({
      body: response
    });

    const postStup: SinonStub = sinon.stub(request, 'post').returns(requestDeferred as any);

    request.requestDigest(spUrl)
      .then(() => {
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
