### setParams method

```js
FlowRouter.setParams(params);
```
 - `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
 - Returns {*true*}

Change the current Route's `params` with the new values and re-route to the new path.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

FlowRouter.setParams({appId: 'new-id'});
// Then the user will be redirected to the following path
//      /apps/new-id?show=yes&color=red
```

#### Further reading
 - [`.setQueryParams()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/setQueryParams.md)
 - [`.getQueryParam()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getQueryParam.md)
 - [`.getParam()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getParam.md)
