import { expect } from 'chai';
import * as url from 'url';

import * as sprequest from './../../src/core/SPRequest';
import { ISPRequest } from '../../src/core/types';
import { trimSlashes, removeTrailingSlash } from './utils';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config: any = require('./config');

const listTitle = 'SPRequestTesting';

const tests: any[] = [
  {
    name: 'adfs user credentials',
    creds: config.adfsCredentials,
    url: config.onpremAdfsEnabledUrl
  },
  {
    name: 'on-premise user credentials',
    creds: config.onpremCreds,
    url: config.onpremNtlmEnabledUrl
  },
  {
    name: 'on-premise user UPN credentials',
    creds: config.onpremUpnCreds,
    url: config.onpremNtlmEnabledUrl
  },
  {
    name: 'on-premise user+domain credentials',
    creds: config.onpremUserWithDomainCreds,
    url: config.onpremNtlmEnabledUrl
  },
  {
    name: 'online user credentials',
    creds: config.onlineCreds,
    url: config.onlineUrl
  },
  {
    name: 'on-premise addin only',
    creds: config.onpremAddinOnly,
    url: config.onpremAdfsEnabledUrl
  },
  {
    name: 'online addin only',
    creds: config.onlineAddinOnly,
    url: config.onlineUrl
  },
  {
    name: 'ondemand - online',
    creds: {
      ondemand: true
    },
    url: config.onlineUrl
  },
  {
    name: 'ondemand - on-premise with ADFS',
    creds: {
      ondemand: true
    },
    url: config.onpremAdfsEnabledUrl
  },
  {
    name: 'file creds - online',
    creds: null,
    url: config.onlineUrl
  },
  {
    name: 'file creds - on-premise - NTLM',
    creds: null,
    url: config.onpremNtlmEnabledUrl
  },
  {
    name: 'file creds - on-premise - ADFS',
    creds: null,
    url: config.onpremAdfsEnabledUrl
  }
];

tests.forEach(test => {
  test.url = removeTrailingSlash(test.url);

  describe(`sp-request: integration - ${test.name}`, () => {
    let request: ISPRequest;

    before('Creating test list', function (done: any): void {
      this.timeout(30 * 1000);

      request = sprequest.create(test.creds);

      request.requestDigest(test.url)
        .then((digest) => {
          return request.post(`${test.url}/_api/web/lists`, {
            body: {
              '__metadata': { 'type': 'SP.List' },
              'AllowContentTypes': true,
              'BaseTemplate': 100,
              'ContentTypesEnabled': false,
              'Description': 'Test list',
              'Title': listTitle
            },
            headers: {
              'X-RequestDigest': digest
            }
          });
        })
        .then(() => {
          done();
        }, err => {
          if (err.message.indexOf('-2130575342') === -1) {
            done(err);
            return;
          }
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    after('Deleting test list', function (done: MochaDone): void {
      this.timeout(30 * 1000);

      Promise.all([request.requestDigest(test.url), request.get(`${test.url}/_api/web/lists/GetByTitle('${listTitle}')`)])
        .then(data => {
          const digest = data[0];
          const listId: string = data[1].body.d.Id;

          return request.post(`${test.url}/_api/web/lists('${listId}')`, {
            headers: {
              'X-RequestDigest': digest,
              'X-HTTP-Method': 'DELETE',
              'IF-MATCH': '*'
            }
          });
        })
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should get list title', function (done: MochaDone): void {
      this.timeout(30 * 1000);

      request.get(`${test.url}/_api/web/lists/GetByTitle('${listTitle}')`)
        .then(data => {
          expect(data.body.d.Title).to.equal(listTitle);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should create list item', function (done: MochaDone): void {
      this.timeout(30 * 1000);

      request.requestDigest(test.url)
        .then(digest => {
          return request.post(`${test.url}/_api/web/lists/GetByTitle('${listTitle}')/items`, {
            headers: {
              'X-RequestDigest': digest
            },
            body: {
              '__metadata': { 'type': `SP.Data.${listTitle}ListItem` },
              'Title': 'Test'
            }
          });
        })
        .then((data) => {
          expect(data.statusCode).to.equal(201);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should get list item by id', function (done: MochaDone): void {
      this.timeout(30 * 1000);

      request.get(`${test.url}/_api/web/lists/GetByTitle('${listTitle}')/items(1)`)
        .then(data => {
          expect(data.body.d.Title).to.equal('Test');
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should throw 500 or 404', function (done: MochaDone): void {
      this.timeout(30 * 1000);
      const path = trimSlashes(url.parse(test.url).path);
      request.get(`${test.url}/_api/web/GetFileByServerRelativeUrl(@FileUrl)?@FileUrl='/${path}/SiteAssets/${encodeURIComponent('undefined.txt')}'`)
        .then(() => {
          done(new Error('Should throw'));
        })
        .catch((err) => {
          if (err.message.indexOf('500') !== -1 || err.message.indexOf('404') !== -1) {
            done()
          } else {
            done(err);
          }
        });
    });
  });
});
