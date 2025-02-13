### whileWaiting hook

`whileWaiting(params, qs)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - Return: {*void*}

`.whileWaiting()` hook is triggered before `.waitOn()` hook, allowing to display/render text or animation saying `Loading...`.

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  whileWaiting() {
    this.render('loading');
  },
  waitOn(params) {
    return Meteor.subscribe('post', params._id);
  }
});
```

#### Further reading
 - [`.waitOn()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOn.md)
 - [Templating with Data](https://github.com/veliovgroup/flow-router/blob/master/docs/templating-with-data.md)
