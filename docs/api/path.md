### path method

```js
FlowRouter.path(path, params, qs);
```

- `path` {*String*} - Path or Route's name
- `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
- `qs` {*Object*} - Serialized query string, `{ key: 'val' }`
- Returns {*String*} - URI

```js
const pathDef = '/blog/:cat/:id';
const params = { cat: 'met eor', id: 'abc' };
const queryParams = {show: 'y+e=s', color: 'black'};

const path = FlowRouter.path(pathDef, params, queryParams);
console.log(path); // --> "/blog/met%20eor/abc?show=y%2Be%3Ds&color=black"
```

If there are no `params` or `qs`, it will simply return the path as it is.

#### Further reading

- [`.url()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/url.md)
