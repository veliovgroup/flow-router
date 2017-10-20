### Quick Start

#### Install
```shell
# Remove original FlowRouter
meteor remove kadira:flow-router

# Install FR-Extra
meteor add ostrio:flow-router-extra
```

#### ES6 Import
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
```

#### Create your fist route
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Create index route
FlowRouter.route('/', {
  name: 'index',
  action() {
    // Do something here
    // After route is followed
  }
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page
  }
});
```

#### Create a route with parameters
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Going to: /article/article_id/article-slug
FlowRouter.route('/article/:_id/:slug', {
  name: 'article',
  action(params) {
    // All passed parameters is available as Object:
    console.log(params);
    // { _id: 'article_id', slug: 'article-slug' }
  }
});
```

#### Create a route with query string
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Going to: /article/article_id?comment=123
FlowRouter.route('/article/:_id', {
  name: 'article',
  action(params, qs) {
    // All passed parameters and query string
    // are available as Objects:
    console.log(params);
    // { _id: 'article_id' }
    console.log(qs);
    // { comment: '123' }
  }
});
```

#### Further reading
 - [Templating](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating.md)
 - [`.action()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/action.md)
