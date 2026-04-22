### url method

```js
FlowRouter.url(path, params, queryParams);
```

- `path` {*String*} - Path or Route's name
- `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
- `queryParams` {*Object*} - Query params object, `{ key: 'val' }`
- Returns {*String*} - Absolute URL using `Meteor.absoluteUrl`

#### Further reading

- [`.path()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/path.md)
