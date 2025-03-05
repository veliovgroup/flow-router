### wait method

```js
FlowRouter.wait();
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

- [`.initialize()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/initialize.md)
