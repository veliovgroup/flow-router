### Quick Start

Learn how to create routes and pull data from Method or Subscription

#### Install

```shell
# Remove original FlowRouter
meteor remove kadira:flow-router

# Install FR-Extra
meteor add ostrio:flow-router-extra
```

> [!NOTE]
> This package is meant to replace original FlowRouter package `kadira:flow-router`, it should be removed to avoid interference and unexpected behavior

#### ES6 Import

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
```

#### Create your first route

Create the first route and `*` catch all route to serve "404" page

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

#### Pull data from a Subscription

Create a route with parameters and pull data from Subscription

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Going to: /article/article_id/article-slug
FlowRouter.route('/article/:_id/:slug', {
  name: 'article',
  action(params, qs, articleObject) {
    // Pass fetched article data to template
    this.render('article', articleObject);
  },
  waitOn(params) {
    // All passed parameters is available as Object:
    // { _id: 'article_id', slug: 'article-slug' }
    console.log(params);

    return Meteor.subscribe('article', params._id);
  },
  async data(params) {
    // All passed parameters is available as Object:
    // { _id: 'article_id', slug: 'article-slug' }
    console.log(params);

    return await ArticleCollection.findOneAsync(params._id)
  }
});
```

#### Pull data from a Method

Create a route with parameters and pull data from Method

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Going to: /article/article_id/article-slug
FlowRouter.route('/article/:_id/:slug', {
  name: 'article',
  action(params, qs, articleObject) {
    // Pass fetched article data to template
    this.render('article', articleObject);
  },
  async data(params) {
    // All passed parameters is available as Object:
    // { _id: 'article_id', slug: 'article-slug' }
    console.log(params);

    return await Meteor.callAsync('article.get', params._id);
  }
});
```

#### Create a route with GET-query string

Use GET-parameters for conditional logic

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
    this.render('article', { ...params, ...qs });
  }
});
```

> [!TIP]
> if you're using any package which require original FlowRouter namespace and throwing an error, you can solve it with the next code

```js
// in /lib/ directory
Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
```

#### Further reading

- [Templating](https://github.com/veliovgroup/flow-router/blob/master/docs/templating.md)
- [Templating with Data](https://github.com/veliovgroup/flow-router/blob/master/docs/templating-with-data.md)
- [`.waitOn()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOn.md)
- [`.data()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md)
- [`.action()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/action.md)
- [`.render()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/render.md)
