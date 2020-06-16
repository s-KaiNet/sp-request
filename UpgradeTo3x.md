# Migration from `sp-request` 2.x to 3.x

`sp-request` 3.x uses [got](https://github.com/sindresorhus/got/) instead of [request-promise](https://github.com/request/request-promise/) (deprecated).

In most cases it has exactly the same API. However, some configuration options are different.

Please refer to the table below to see what have changed:

| old options property (request-promise) | new property (got) |
|--------------|--------------|
| `simple: true` | `throwHttpErrors: true` |
| `strictSSL: false` | `rejectUnauthorized: false`|
| `json: true` | `responseType: 'json'` |
|`json: false`| `responseType: 'text'` or `responseType: 'buffer'` |
|`resolveWithFullResponse: true`|`resolveBodyOnly: false`|
|`encoding: null` (to get file content)|`responseType: 'buffer'`|

If you use any of the properties in the left column, you should use right equivalent instead in your code.
In some situations, you might receive different error object, if you depend on error handling\checking in your code. To make sure everything works without problems, you should check error branch logic as well.

For example, your old 2.x code for `sp-request` might look like:

```javascript
spr.post("https://sharepoint.url", {
  json: true,
  body: {
    "Title": "hello world"
  },
  resolveWithFullResponse: false,
  simple: false
});
```

To have it in 3.x version, you should change as below:

```javascript
spr.post("https://sharepoint.url", {
  responseType: 'json'
  body: {
    "Title": "hello world"
  },
  resolveBodyOnly: true,
  throwHttpErrors: false
});
```
