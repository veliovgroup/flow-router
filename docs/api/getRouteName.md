### getRouteName method

```js
FlowRouter.getRouteName();
```
 - Returns {*String*}

Use to get the name of the route reactively.

#### Example
```js
Tracker.autorun(function () {
  const routeName = FlowRouter.getRouteName();
  console.log('Current route name is: ', routeName);
});
```

#### Further reading
 - [`.current()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/current.md)
