### reload method

```js
FlowRouter.reload();
```
 - Returns {*void*}

FlowRouter routes are idempotent. That means, even if you call `FlowRouter.go()` to the same URL multiple times, it only activates in the first run. This is also true for directly clicking on paths.

So, if you really need to reload the route, this is the method you want.

#### Further reading
 - [`.refresh()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/refresh.md)
