# sp-request - simplified SharePoint HTTP client
[![npm version](https://badge.fury.io/js/sp-request.svg)](https://badge.fury.io/js/sp-request)

### Need help on SharePoint with Node.JS? Join our gitter chat and ask question! [![Gitter chat](https://badges.gitter.im/gitterHQ/gitter.png)](https://gitter.im/sharepoint-node/Lobby)

> If you are looking for a way to perform some REST queries against SharePoint, consider also [PnPjs](https://github.com/pnp/pnpjs) with [node.js integration](https://github.com/SharePoint-NodeJS/pnp-auth)
---
> **IMPORTANT:** This module doesn't work in browser. The only supported environment is nodejs. If you have a need to use it in browser, probably you're looking for [sp-rest-proxy](https://github.com/koltyakov/sp-rest-proxy) - a nodejs proxy, which redirects calls to real SharePoint.
---
 `sp-request` is based on [got](https://github.com/sindresorhus/got/) (human-friendly and powerful HTTP request library for Node.js) and [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth) modules. `node-sp-auth` implements different authentication options for unattended SharePoint authentication from nodejs. You can send REST queries to SharePoint (works with both on-prem and online) using `got` syntax with the same params that `got` supports, and `sp-request` (with help of `node-sp-auth`) takes care about authenticating you inside SharePoint.

 Versions supported:
 * SharePoint 2013 and onwards
 * SharePoint Online

---

## Upgrade from 2.x to 3.x

If you're upgrading to 3.x version, please read [Upgrade guide](/UpgradeTo3x.md)

---

### How to use:

#### Install:

```bash
npm install sp-request --save-dev
```

#### Create sprequest function:

```javascript
import * as sprequest from 'sp-request';
let spr = sprequest.create(credentialOptions);
```

##### Get list by title:

```javascript
spr.get('http://sp2013dev/sites/dev/_api/web/lists/GetByTitle(\'TestList\')')
  .then(response => {
    console.log('List Id: ' + response.body.d.Id);
  })
  .catch(err =>{
    console.log('Ohhh, something went wrong...');
  });
```

##### Update list title:

```javascript
spr.requestDigest('http://sp2013dev/sites/dev')
  .then(digest => {
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
  .then(response => {
    if (response.statusCode === 204) {
      console.log('List title updated!');
    }
  }, err => {
    if (err.statusCode === 404) {
      console.log('List not found!');
    } else {
      console.log(err);
    }
  });
```

... as simple as that! A bit more samples you can find under [integration tests](https://github.com/s-KaiNet/sp-request/blob/master/test/integration/integration.spec.ts)

## API:

### [main sp-request export].create(credentialOptions):

- **_credentialOptions_:** optional, object containing credentials.
  Since version 2.x `sp-request` relies on `node-sp-auth` module for authentication. You can find description for `credentialOptions` under [node-sp-auth](https://github.com/s-KaiNet/node-sp-auth#params).

Call to `sprequest.create(credentialOption)` returns sprequest function with predefined authentication. You can use this function later to send REST queries (like in samples above) without specifying credentials again.
### sprequest(options):

 - **_options_**: required, settings object for `got` module. For all available values refer to the original [got docs](https://github.com/sindresorhus/got)

By default `sp-request` sets following params for `got`:

```
{
    responseType: 'json',
    resolveBodyOnly: false,
    rejectUnauthorized: false,
    throwHttpErrors: true,
    retry: 0,
    headers: {
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose'
    }
}
```

as a result you can access `body.d` property as an object. You can provide your own headers and override defaults if it's required.

### sprequest.requestDigest(url):

 - _url_ - required, string site url

Returns request digest as string via promise.

## Convenience methods:

### sprequest(url, options):

 - _url_ - required, string
 - _options_ - optional, `got` options object

The same as `sprequest(options)` but `options.url` will be equal to the first param.

### sprequest.get(url, options)

 - _url_ - required, string
 - _options_ - optional, `got` options object

The same as `sprequest(options)` but `options.url` will be equal to the first param and `options.method: 'GET'`.

### sprequest.post(url, options)

 - _url_ - required, string
 - _options_ - optional, `got` options object

The same as `sprequest(options)` but `options.url` will be equal to the first param and `options.method: 'POST'`.

## Supplying additional headers via environment variables

Sometimes you need to push additional headers for `sp-request` without direct access to `sp-request` object. For example from third party module, which uses `sp-request` internally. For that purpose you can use environmental variables. Provide it in a below way:

```javascript
process.env['_sp_request_headers'] = JSON.stringify({
	'X-FORMS_BASED_AUTH_ACCEPTED': 'f'
});
```

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
