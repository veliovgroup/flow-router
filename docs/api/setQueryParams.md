### setQueryParams method

```js
FlowRouter.setQueryParams(qs);
```
 - `qs` {*String*} - Serialized query string, `{ key: 'val' }`
 - Returns {*true*}


#### Unset parameter
To remove a query param set it to `null`:
```js
FlowRouter.setQueryParams({ paramToRemove: null });
```

#### Further reading
 - [`.getQueryParam()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/getQueryParam.md)
 - [`.setParams()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/setParams.md)
 - [`.getParam()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/getParam.md)
