### waitOn hook

`waitOn(params, queryParams, ready)`

- `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
- `queryParams` {*Object*} - Query params object, `/route/?key=val => { key: 'val' }`
- `ready` {*Function*} - Call when computation is ready using *Tracker*
- Return: {*Promise*|[*Promise*]|*Subscription*|[*Subscription*]|*Tracker*|[*Tracker*]}

`.waitOn()` hook is triggered before `.action()` hook, allowing to load necessary data before rendering a template.

#### `maxWaitFor` (route and router)

- **Per route:** `FlowRouter.route(path, { maxWaitFor, waitOn, action, … })` — max time in **milliseconds** for:
  - resolving **`waitOn` promises** (including `async waitOn` and arrays of promises), and
  - waiting until every returned subscription-like handle’s **`ready()`** is true (polled every 24ms).
- **Router default:** `FlowRouter.maxWaitFor` defaults to **`120000`** (same as package export **`MAX_WAIT_FOR_MS`**). Set via **`FlowRouter.initialize({ maxWaitFor })`** or assign **`FlowRouter.maxWaitFor = …`** on the singleton. Routes **without** an explicit **`maxWaitFor`** use **`FlowRouter.maxWaitFor`** at the time **`waitOn`** runs (so a later **`initialize`** / assignment still applies).
- If **`maxWaitFor`** elapses while promises or subscriptions are still pending, **`waitOn` ends** and the route still runs **`triggersEnter`** / **`action`** (timeout is logged). **Navigation away** aborts `waitOn` and skips **`action`** for the route being left.

#### Subscriptions

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id), Meteor.subscribe('suggestedPosts', params._id)];
  }
});
```

#### *Tracker*

Use reactive data sources inside `waitOn` hook. To make `waitOn` rerun on reactive data changes, wrap it to `Tracker.autorun` and return Tracker Computation object or an *Array* of Tracker Computation objects. Note: the third argument of `waitOn` is `ready` callback.

```js
FlowRouter.route('/posts', {
  name: 'post',
  waitOn(params, queryParams, ready) {
    return Tracker.autorun(() => {
      ready(() => {
        return Meteor.subscribe('posts', search.get(), page.get());
      });
    });
  }
});
```

#### Array of *Trackers*

```js
FlowRouter.route('/posts', {
  name: 'post',
  waitOn(params, queryParams, ready) {
    const tracks = [];
    tracks.push(Tracker.autorun(() => {
      ready(() => {
        return Meteor.subscribe('posts', search.get(), page.get());
      });
    }));

    tracks.push(Tracker.autorun(() => {
      ready(() => {
        return Meteor.subscribe('comments', postId.get());
      });
    }));
    return tracks;
  }
});
```

#### *Promises*

```js
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return new Promise((resolve, reject) => {
      loadPosts((err) => {
        (err) ? reject() : resolve();
      });
    });
  }
});
```

#### Array of *Promises*

```js
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return [new Promise({/*..*/}), new Promise({/*..*/}), new Promise({/*..*/})];
  }
});
```

#### Meteor method via *Promise*

*Deprecated, since v3.12.0 `Meteor.callAsync` can get called inside `async data()` hook to retrieve data from a method*

```js
FlowRouter.route('/posts', {
  name: 'posts',
  conf: {
    posts: false
  },
  action(params, queryParams, data) {
    this.render('layout', 'posts', data);
  },
  waitOn() {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.get', (error, posts) => {
        if (error) {
          reject();
        } else {
          // Use `conf` as shared object to
          // pass it from `data()` hook to
          // `action()` hook`
          this.conf.posts = posts;
          resolve();
        }
      });
    });
  },
  data() {
    return this.conf.posts;
  }
});
```

#### Dynamic `import`

```js
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return import('/imports/client/posts.js');
  }
});
```

#### Array of dynamic `import`(s)

```js
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return [
      import('/imports/client/posts.js'),
      import('/imports/client/sidebar.js'),
      import('/imports/client/footer.js')
    ];
  }
});
```

#### Dynamic `import` and Subscription

```js
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return [import('/imports/client/posts.js'), Meteor.subscribe('Posts')];
  }
});
```

#### *async* support

```js
FlowRouter.route('/posts', {
  name: 'posts',
  async waitOn() {
    await import('/imports/client/posts.js');
    return Meteor.subscribe('Posts');
  }
});
```

#### Further reading

- [`.waitOnResources()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOnResources.md)
