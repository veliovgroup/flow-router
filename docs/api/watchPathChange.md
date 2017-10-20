### watchPathChange method

```js
FlowRouter.watchPathChange();
```
 - Returns {*void*}

Reactively watch the changes in the path. If you need to simply get the `params` or `qs` use methods like `FlowRouter.getQueryParam()`.

```js
Tracker.autorun(() => {
  FlowRouter.watchPathChange();
  const currentContext = FlowRouter.current();
  // do something with the current context
});
```

#### Further reading
 - [`.current()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/current.md)
 - [`.getQueryParam()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getQueryParam.md)
 - [`.getParam()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getParam.md)
 - [`.getRouteName()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getRouteName.md)
