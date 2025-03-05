### decodeQueryParamsOnce option

The current behavior of `FlowRouter.getQueryParam("...")` and `FlowRouter.current().queryParams` is to double-decode query params, but this can cause issues when, for example, you want to pass a URL with its own query parameters as a URI component, such as in an OAuth flow or a redirect after login.

To solve this, you can set this option to `true` to tell FlowRouter to only decode query params once.

```js
// Allows us to pass things like encoded URLs as query params (default = false)
FlowRouter.decodeQueryParamsOnce = true;
```

#### Example

Given the URL in the address bar:

```plain
http://localhost:3000/signin?after=%2Foauth%2Fauthorize%3Fclient_id%3D123%26redirect_uri%3Dhttps%253A%252F%252Fothersite.com%252F
```

If `decodeQueryParamsOnce` is not set or set to `false` ❌ ...

```js
FlowRouter.getQueryParam("after");
// returns: "/oauth/authorize?client_id=123"

FlowRouter.current().queryParams;
// returns: { after: "/oauth/authorize?client_id=123", redirect_uri: "https://othersite.com/" }
```

If `decodeQueryParamsOnce` is set to `true` ✔️ ...

```js
FlowRouter.getQueryParam("after");
// returns: "/oauth/authorize?client_id=123&redirect_uri=https%3A%2F%2Fothersite.com%2F"

FlowRouter.current().queryParams;
// returns: { after: "/oauth/authorize?client_id=123&redirect_uri=https%3A%2F%2Fothersite.com%2F" }
```

The former is no longer recommended, but to maintain compatibility with legacy apps, `false` is the default value for this flag. Enabling this flag manually with `true` is recommended for all new apps. For more info, see [#78](https://github.com/veliovgroup/flow-router/issues/78).

#### Further reading

- [`.getQueryParam()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/getQueryParam.md)
- [`.current()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/current.md)
