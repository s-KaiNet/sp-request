# sp-request - simplified SharePoint HTTP client
[![NPM](https://nodei.co/npm/sp-request.png?mini=true)](https://nodei.co/npm/sp-request/)

[![Circle CI](https://circleci.com/gh/s-KaiNet/sp-request/tree/master.svg?style=shield&circle-token=c550cd1b34315e710c5e751dd4cffe5cb8e694fe)](https://circleci.com/gh/s-KaiNet/sp-request/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/s-KaiNet/sp-request/badge.svg?branch=master)](https://coveralls.io/github/s-KaiNet/sp-request?branch=master)
[![npm version](https://badge.fury.io/js/sp-request.svg)](https://badge.fury.io/js/sp-request)

 `sp-request` based on [request](https://github.com/request/request) module and its promise implementation [request-promise](https://github.com/request/request-promise). You can send REST queries to SharePoint (works with both on-prem and online) using well-known `request` syntax with the same params that `request` supports, and `sp-request` takes care about authenticating you inside SharePoint. With help of `request-promise` and `bluebird`, responses implemented using modern promise-style approach.

---

### How to use:
#### Install:
```bash
npm install sp-request --save-dev
```
#### Optionally install definitions if you are developing with TypeScript:
```bash
typings install npm:sp-request --save
```
#### Create sprequest function:
```javascript
var spr = require('sp-request').create({username: 'user', password: 'pass'});
```
###### Get list by title:
```javascript
spr.get('http://sp2013dev/sites/dev/_api/web/lists/GetByTitle(\'TestList\')')
  .then(function (response) {
    console.log('List Id: ' + response.body.d.Id);
  })
  .catch(function(err){
    console.log('Ohhh, something went wrong...');
  });
```
###### Update list title:
```javascript
spr.requestDigest('http://sp2013dev/sites/dev')
  .then(function (digest) {
    return spr.post('http://sp2013dev/sites/dev/_api/web/lists/GetByTitle(\'TestList\')', {
      body: {
        '__metadata': { 'type': 'SP.List' },
        'Title': 'TestList'
      },
      headers: {
        'X-RequestDigest': digest,
        'X-HTTP-Method': 'MERGE',
        'IF-MATCH': '*'
      }
    });
  })
  .then(function (response) {
    if (response.statusCode === 204) {
      console.log('List title updated!');
    }
  }, function (err) {
    if (err.statusCode === 404) {
      console.log('List not found!');
    } else {
      console.log(err);
    }
  });
```
... as simple as that! A bit more samples you can find under [integration tests](https://github.com/s-KaiNet/sp-request/blob/master/test/integration/integration.spec.ts)

## API:
##### [main sp-request export].create(credentials, environment):
 - **_credentials_:** required, object containing user credentials:
   - _username_ - required string
   - _password_ - required string
 - **_environment_**: optional, used when you want to send requests to on-premise SharePoint (when using `environment` option either `domain` or `workstation` option should be provided, when nothing is provided as `environment` for on-premise, local user will be used (not domain), it's better to always provide `environment` option explicitly):
   - _domain_ - optional string
   - _workstation_ - optional string

Call to `require('sp-request').create({username: 'user', password: 'pass'})` returns sprequest function with predefined username and password. You can use this function later to send REST queries (like in samples above) without specifying credentials again.
##### sprequest(options):
 - **_options_**: required, settings object for `request` module. For all available values refer to the original [request docs](https://github.com/request/request#requestoptions-callback)

By default `sp-request` sets following params for `request`:
```
{
    json: true,
    headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
    }
}
```
as a result you can access `body.d` property as an object. You can provide your own headers and override defaults if it's required.
The only difference from original `request`, that `sp-request` returns Bluebird's `Promise` (ES2015 promise implementation), instead of relying on callbacks. So you can combine multiple requests in a convenient and readable way.
##### sprequest.requestDigest(url):
 - _url_ - required, string site url

Returns request digest as string via promise.
## Convenience methods:
##### sprequest(url, options):
 - _url_ - required, string
 - _options_ - required, `request` options object

The same as `sprequest(options)` but `options.url` will be equal to the first param.
##### sprequest.get(url, options)
 - _url_ - required, string
 - _options_ - optional, `request` options object

The same as `sprequest(options)` but `options.url` will be equal to the first param and `options.method: 'GET'`.
##### sprequest.post(url, options)
 - _url_ - required, string
 - _options_ - optional, `request` options object

The same as `sprequest(options)` but `options.url` will be equal to the first param and `options.method: 'POST'`.

## Development:
I recommend using VS Code for development. Repository already contains some settings for VS Code editor.

Before creating Pull Request you need to create an appropriate issue and reference it from PR.

1. `git clone https://github.com/s-KaiNet/sp-request.git`
2. `npm run build` - restores dependencies and runs typescript compilation
3. `gulp live-dev` - setup watchers and automatically runs typescript compilation, tslint and tests when you save files

## Tests:
1. `npm test`. As a result `/reports` folder will be created with test results in junit format and code coverage. Additionally test reports will be available in a console window.

## Integration testing:
1. Rename file `/test/integration/config.sample.ts` to `config.ts`.
2. Update information in `config.ts` with appropriate values (urls, credentials, environment).
3. Run `gulp test-int`.