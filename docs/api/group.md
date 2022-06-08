### group method

Use group routes for better route organization.

`.group(options)`
 - `options` {*Object*} - [Optional]
 - `options.name` {*String*} - [Optional] Route's name
 - `options.prefix` {*String*} - [Optional] Route prefix
 - `options[prop-name]` {*Any*} - [Optional] Any property which will be available inside route call
 - `options[hook-name]` {*Function*} - [Optional] See [all available hooks](https://github.com/veliovgroup/flow-router/tree/master/docs#hooks-in-execution-order)
 - Returns {*Group*}

```js
const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [(context, redirect) => {
    console.log('running group triggers');
  }]
});

// handling /admin/ route
adminRoutes.route('/', {
  name: 'adminIndex',
  action() { /* ... */ }
});

// handling /admin/posts
adminRoutes.route('/posts', {
  name: 'adminPosts',
  action() { /* ... */ }
});
```

#### Nested Group
```js
const adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

const superAdminRoutes = adminRoutes.group({
    prefix: '/super',
    name: 'superadmin'
});

// handling /admin/super/post
superAdminRoutes.route('/post', {
    action() { /* ... */ }
});
```

#### Get group name
```js
FlowRouter.current().route.group.name
```

This can be useful for determining if the current route is in a specific group (e.g. *admin*, *public*, *loggedIn*) without needing to use prefixes if you don't want to. If it's a nested group, you can get the parent group's name with:
```js
FlowRouter.current().route.group.parent.name
```

#### Further reading
 - [`.triggersEnter()` hooks](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
 - [`.action()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/action.md)
 - [`.route()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/route.md)
 - [`.current()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/current.md)
