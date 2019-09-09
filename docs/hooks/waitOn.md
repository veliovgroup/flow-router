### waitOn hook

`waitOn(params, qs, ready)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - `ready` {*Function*} - Call when computation is ready using *Tracker*
 - Return: {*Promise*|[*Promise*]|*Subscription*|[*Subscription*]|*Tracker*|[*Tracker*]}

`.waitOn()` hook is triggered before `.action()` hook, allowing to load necessary data before rendering a template.

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
  waitOn(params, qs, ready) {
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
  waitOn(params, qs, ready) {
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
      })
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

#### Further reading
 - [`.waitOnResources()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOnResources.md)
