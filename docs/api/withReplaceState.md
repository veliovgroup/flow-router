### withReplaceState method

```js
FlowRouter.withReplaceState(callback);
```
 - `callback` {*Function*}
 - Returns {*void*}

Normally, all the route changes made via APIs like `FlowRouter.go` and `FlowRouter.setParams()` add a URL item to the browser history. For example, run the following code:

```js
FlowRouter.setParams({id: 'the-id-1'});
FlowRouter.setParams({id: 'the-id-2'});
FlowRouter.setParams({id: 'the-id-3'});
```

Now you can hit the back button of your browser two times. This is normal behavior since users may click the back button and expect to see the previous state of the app.

But sometimes, this is not something you want. You don't need to pollute the browser history. Then, you can use the following syntax.

```js
FlowRouter.withReplaceState(() => {
  FlowRouter.setParams({id: 'the-id-1'});
  FlowRouter.setParams({id: 'the-id-2'});
  FlowRouter.setParams({id: 'the-id-3'});
});
```

#### Further reading
 - [`.go()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/go.md)
 - [`.setParams()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/setParams.md)

