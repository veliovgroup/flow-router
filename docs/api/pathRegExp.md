### pathRegExp option

```js
// Use dashes as separators so `/:id-:slug/` isn't translated to `id-:slug` but to `:id`-`:slug`
FlowRouter.pathRegExp = /(:[\w\(\)\\\+\*\.\?\[\]]+)+/g;
```

- `pathRegExp` {*RegExp*}
- Default - `/(:[\w\(\)\\\+\*\.\?\[\]\-]+)+/g`

Use to change the URI RegEx parser used for `params`, for more info see [#25](https://github.com/veliovgroup/flow-router/issues/25).

#### Further reading

- [`.route()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/route.md)
- [`.group()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/group.md)
