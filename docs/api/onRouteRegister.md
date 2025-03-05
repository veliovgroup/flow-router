### onRouteRegister method

```js
FlowRouter.onRouteRegister(callback);
```

- `callback` {*Function*}
- Returns {*void*}

This API is specially designed for add-on developers. They can listen for any registered route and add custom functionality to FlowRouter. This works on both server and client alike.

```js
FlowRouter.onRouteRegister((route) => {
  // do anything with the route object
  console.log(route);
});
```
