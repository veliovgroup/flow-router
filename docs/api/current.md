### current method

```js
FlowRouter.current();
```
 - Returns {*Object*}

Get the current state of the router. **This API is not reactive**.
If you need to watch the changes in the path simply use `FlowRouter.watchPathChange()`.

#### Example
```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

const current = FlowRouter.current();
console.log(current);

// prints following object
// {
//     path: "/apps/this-is-my-app?show=yes&color=red",
//     params: {appId: "this-is-my-app"},
//     queryParams: {show: "yes", color: "red"}
//     route: {pathDef: "/apps/:appId", name: "name-of-the-route"}
// }
```

#### Further reading
 - [`.watchPathChange()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/watchPathChange.md)
