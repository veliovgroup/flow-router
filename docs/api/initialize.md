### initialize method

```js
FlowRouter.initialize(options);
```
 - `options` {*Object*}
 - Returns {*void*}

By default, FlowRouter initializes the routing process in a `Meteor.startup()` callback. This works for most of the applications. But, some applications have custom initializations and FlowRouter needs to initialize after that.

So, that's where `FlowRouter.wait()` comes to save you. You need to call it directly inside your JavaScript file. After that, whenever your app is ready call `FlowRouter.initialize()`.

#### Options

You can pass these options to initialize:

- `hashbang` (defaults to `false`): Enable hashbang urls like `mydomain.com/#!/mypath`.
- `page`: Options for [page.js](https://github.com/visionmedia/page.js)

##### Useful page.js options

- `link` (defaults to `true`): When false, `<a href>` tags in your app won't automatically call flow router and will do the browser's default page load instead. This is identical to how `react-router` behaves. You can create a `<Link />` component that calls `FlowRouter.go` in its `onClick` handler. This way, you have more control over your links.


#### Example
```js
FlowRouter.wait();
WhenEverYourAppIsReady(() => {
  FlowRouter.initialize();
});
```



#### Further reading
 - [`.wait()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/wait.md)
