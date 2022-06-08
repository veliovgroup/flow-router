### go method

`.go(path, params, qs)`
 - `path` {*String*} - Path or Route's name
 - `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `{ key: 'val' }`
 - Returns {*true*}

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/blog', { name: 'blog' /* ... */ });
FlowRouter.route('/blog/:_id', { name: 'blogPost' /* ... */ });

FlowRouter.go('/blog'); // <-- by path - /blog/
FlowRouter.go('blog'); // <-- by Route's name - /blog/
FlowRouter.go('blogPost', { _id: 'post_id' }); // /blog/post_id
FlowRouter.go('blogPost', { _id: 'post_id' }, { commentId: '123' }); // /blog/post_id?commentId=123
```

#### Further reading
 - [`.route()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/route.md)
 - [`.getRouteName()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/getRouteName.md)
