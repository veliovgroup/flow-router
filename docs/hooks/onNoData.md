### onNoData hook

`onNoData(params, qs)`

- `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
- `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
- Return: {*void*}

`.onNoData()` hook is triggered instead of `.action()` in case when `.data()` hook returns "falsy" value. Run any JavaScript code inside `.onNoData()` hook, for example render *404* template or redirect user somewhere else. __This hook can be async__

```js
FlowRouter.route('/post/:_id', {
  name: 'post',
  async data(params) {
    return await PostsCollection.findOneAsync({ _id: params._id });
  },
  async onNoData(params, qs){
    await import('/imports/client/page-404.js');
    this.render('_layout', '_404');
  }
});
```

#### Further reading

- [`.data()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md)
