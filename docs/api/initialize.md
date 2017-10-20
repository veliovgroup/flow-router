### initialize method

```js
FlowRouter.initialize();
```
 - Returns {*void*}

By default, FlowRouter initializes the routing process in a `Meteor.startup()` callback. This works for most of the applications. But, some applications have custom initializations and FlowRouter needs to initialize after that.

So, that's where `FlowRouter.wait()` comes to save you. You need to call it directly inside your JavaScript file. After that, whenever your app is ready call `FlowRouter.initialize()`.

#### Example
```js
FlowRouter.wait();
WhenEverYourAppIsReady(() => {
  FlowRouter.initialize();
});
```

#### Further reading
 - [`.wait()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/wait.md)
