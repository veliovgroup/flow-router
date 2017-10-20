### Quick Start

#### Install
```shell
# Remove original FlowRouter
meteor remove kadira:flow-router

# Install FR-Extra
meteor add ostrio:flow-router-extra
```

__Note:__ *This package is meant to replace original FlowRouter,* `kadira:flow-router` *should be removed to avoid interference and unexpected behavior.*

#### ES6 Import
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
```

#### Create your first route
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Create index route
FlowRouter.route('/', {
  name: 'index',
  action() {
    // Do something here
    // After route is followed
    this.render('templateName');
  }
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page
    this.render('notFound');
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

    // Pass params to Template's context
    this.render('article', params);
  },
  waitOn(params) {
    return Meteor.subscribe('article', params._id);
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

    // Pass params and query string to Template's context
    this.render('article', _.extend(params, qs));
  }
});
```

__Note:__ *if you're using any package which requires original FR namespace, throws an error, you can solve it with next code:*
```js
// in /lib/ directory
Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
```

#### Further reading
 - [Templating](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating.md)
 - [Templating with Data](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-data.md)
 - [`.waitOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOn.md)
 - [`.data()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/data.md)
 - [`.action()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/action.md)
 - [`.render()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/render.md)
