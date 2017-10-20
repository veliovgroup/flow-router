### triggersExit hooks

`triggersExit` is option (*not actually a hook*), it accepts array of *Function*s, each function will be called with one argument:
 - `context` {*Route*} - Output of `FlowRouter.current()`
 - Return: {*void*}

```js
const trackRouteEntry = (context) => {
  // context is the output of `FlowRouter.current()`
  console.log("visit-to-home", context.queryParams);
};

const trackRouteClose = (context) => {
  console.log("move-from-home", context.queryParams);
};

FlowRouter.route('/home', {
  // calls just before the action
  triggersEnter: [trackRouteEntry],
  action() {
    // do something you like
  },
  // calls when when we decide to move to another route
  // but calls before the next route started
  triggersExit: [trackRouteClose]
});
```

#### Global
```js
FlowRouter.triggers.exit([cb1, cb2]);
```

#### Further reading
 - [`.current()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/current.md)
 - [Global `.triggers`](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/triggers.md)
 - [`.action()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/action.md)
 - [`.triggersEnter()` hooks](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
