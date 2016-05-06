# sp-request - simplified SharePoint HTTP client 
[![Circle CI](https://circleci.com/gh/s-KaiNet/sp-request/tree/master.svg?style=shield&circle-token=c550cd1b34315e710c5e751dd4cffe5cb8e694fe)](https://circleci.com/gh/s-KaiNet/sp-request/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/s-KaiNet/sp-request/badge.svg?branch=master)](https://coveralls.io/github/s-KaiNet/sp-request?branch=master)  
`sp-request` based on [request](https://github.com/request/request) module and it's promise implementation [request-promise](https://github.com/request/request-promise). You can issue REST queries to SharePoint (works with both on-prem and online) using well-known `request` syntax with the same params that `request` supports, and `sp-request` takes care about authenticating you inside SharePoint. With help of `request-promise` and `bluebird` modules responses implemented using modern promise-style approach.
----------
## How to use:
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
## More info and npm package coming soon...