### go method

`.go(path, params, queryParams)`

- `path` {*String*} - Path or Route's name
- `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
- `queryParams` {*Object*} - Query params object, `{ key: 'val' }`
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

If only the hash changes for the current path and query, FlowRouter leaves route logic alone and lets the browser handle it like normal anchor navigation. The route action does not re-run. Use the browser `hashchange` event for tab switches, scrolling, or other fragment-specific behavior.

```js
window.addEventListener('hashchange', () => {
  const tab = window.location.hash.slice(1);
  if (tab) {
    document.getElementById(tab)?.scrollIntoView();
  }
});

FlowRouter.go('/profile#security'); // same /profile route, browser hash behavior
```

#### Further reading

- [`.route()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/route.md)
- [`.getRouteName()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/getRouteName.md)
