### onNoData hook

`onNoData(params, qs)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - Return: {*void*}


`.onNoData()` hook is triggered instead of `.action()` in case when `.data()` hook returns "falsy" value. Run any JavaScript code inside `.onNoData()` hook, for example render *404* template or redirect user somewhere else.

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  data(params) {
    return PostsCollection.findOne({_id: params._id});
  },
  onNoData(params, qs){
    this.render('_layout', '_404');
  }
});
```

#### Further reading
 - [`.data()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md)
