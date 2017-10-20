### data hook

`data(params, qs)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - Return: {*Mongo.Cursor*|*Object*|[*Object*]|*false*|*null*|*void*}


`.data()` is triggered right after all resources in `.waitOn()` and `.waitOnResources()` hooks are ready.

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return Meteor.subscribe('post', params._id);
  },
  data(params, qs) {
    return PostsCollection.findOne({_id: params._id});
  }
});
```

#### Passing data into a *Template*
```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  action(params, qs, post) {
    this.render('_layout', 'post', { post });
  },
  waitOn(params) {
    return Meteor.subscribe('post', params._id);
  },
  data(params, qs) {
    return PostsCollection.findOne({_id: params._id});
  }
});
```

```html
<!-- in a template -->
<template name="post">
  <h1>{{post.title}}</h1>
  <p>{{post.text}}</p>
</template>
```

#### Data in other hooks
Returned value from `data` hook, will be passed into all other hooks as third argument and to `triggersEnter` hooks as fourth argument
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  data(params) {
    return PostsCollection.findOne({_id: params._id});
  },
  triggersEnter: [(context, redirect, stop, data) => {
    console.log(data);
  }]
});
```

#### Further reading
 - [`.triggersEnter()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
 - [`.onNoData()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/onNoData.md)
 - [`.waitOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOn.md)
 - [`.render()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/render.md)
 - [Templating with Data](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-data.md)
