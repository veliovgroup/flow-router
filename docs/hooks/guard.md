### guard

`guard` accepts a function or an array of functions. Guards run sequentially before `waitOn` and may be asynchronous.

Each guard receives:

- `context` {*Route*} - Output of `FlowRouter.current()` for the navigation target
- `redirect` {*Function*} - Redirect to another route, with the same arguments as [`FlowRouter.go()`](https://github.com/veliovgroup/flow-router/blob/master/docs/api/go.md)
- Return: {*void|Promise<void>*}

Calling `redirect()` stops the remaining guards and skips the guarded route's hooks and action. If another navigation starts while an asynchronous guard is pending, the stale guard cannot resume or redirect the abandoned navigation.

#### Route guard

```js
FlowRouter.route('/account', {
  async guard(context, redirect) {
    const allowed = await canViewAccount();
    if (!allowed) {
      redirect('/sign-in');
    }
  },
  action() {
    // Runs only after the guard resolves without redirecting.
  }
});
```

#### Group guards

Group guards are inherited by nested groups and routes. They run from parent to child, followed by the route guard.

```js
const authenticated = FlowRouter.group({
  guard(context, redirect) {
    if (!Meteor.userId()) {
      redirect('/sign-in');
    }
  }
});

authenticated.route('/settings', {
  action() {}
});
```
