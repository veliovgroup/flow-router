### url method

```js
FlowRouter.url(path, params, qs);
```

- `path` {*String*} - Path or Route's name
- `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
- `qs` {*Object*} - Serialized query string, `{ key: 'val' }`
- Returns {*String*} - Absolute URL using `Meteor.absoluteUrl`

#### Further reading

- [`.path()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/path.md)
