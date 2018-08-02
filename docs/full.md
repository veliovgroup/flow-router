# Docs as single file

## Quick Start

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


-------


## API
### current method

```js
FlowRouter.current();
```
 - Returns {*Object*}

Get the current state of the router. **This API is not reactive**.
If you need to watch the changes in the path simply use `FlowRouter.watchPathChange()`.

#### Example
```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

const current = FlowRouter.current();
console.log(current);

// prints following object
// {
//     path: "/apps/this-is-my-app?show=yes&color=red",
//     params: {appId: "this-is-my-app"},
//     queryParams: {show: "yes", color: "red"}
//     route: {pathDef: "/apps/:appId", name: "name-of-the-route"}
// }
```

-------

### getParam method

```js
FlowRouter.getParam(paramName);
```
 - `paramName` {*String*}
 - Returns {*String*}

Reactive function which you can use to get a parameter from the URL.

#### Example
```js
// route def: /apps/:appId
// url: /apps/this-is-my-app

const appId = FlowRouter.getParam('appId');
console.log(appId); // prints "this-is-my-app"
```

-------

### getQueryParam method

```js
FlowRouter.getQueryParam(queryKey);
```
 - `queryKey` {*String*}
 - Returns {*String*}

Reactive function which you can use to get a value from the query string.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

const color = FlowRouter.getQueryParam('color');
console.log(color); // prints "red"
```

-------

### getRouteName method

```js
FlowRouter.getRouteName();
```
 - Returns {*String*}

Use to get the name of the route reactively.

#### Example
```js
Tracker.autorun(function () {
  const routeName = FlowRouter.getRouteName();
  console.log('Current route name is: ', routeName);
});
```

-------

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

-------

### group method

Use group routes for better route organization.

`.group(options)`
 - `options` {*Object*} - [Optional]
 - `options.name` {*String*} - [Optional] Route's name
 - `options.prefix` {*String*} - [Optional] Route prefix
 - `options[prop-name]` {*Any*} - [Optional] Any property which will be available inside route call
 - `options[hook-name]` {*Function*} - [Optional] See [all available hooks](https://github.com/VeliovGroup/flow-router/tree/master/docs#hooks-in-execution-order)
 - Returns {*Group*}

```js
const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [(context, redirect) => {
    console.log('running group triggers');
  }]
});

// handling /admin/ route
adminRoutes.route('/', {
  name: 'adminIndex',
  action() { /* ... */ }
});

// handling /admin/posts
adminRoutes.route('/posts', {
  name: 'adminPosts',
  action() { /* ... */ }
});
```

#### Nested Group
```js
const adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

const superAdminRoutes = adminRoutes.group({
    prefix: '/super',
    name: 'superadmin'
});

// handling /admin/super/post
superAdminRoutes.route('/post', {
    action() { /* ... */ }
});
```

#### Get group name
```js
FlowRouter.current().route.group.name
```

This can be useful for determining if the current route is in a specific group (e.g. *admin*, *public*, *loggedIn*) without needing to use prefixes if you don't want to. If it's a nested group, you can get the parent group's name with:
```js
FlowRouter.current().route.group.parent.name
```

-------

### initialize method

```js
FlowRouter.initialize();
```
 - Returns {*void*}

By default, FlowRouter initializes the routing process in a `Meteor.startup()` callback. This works for most of the applications. But, some applications have custom initializations and FlowRouter needs to initialize after that.

So, that's where `FlowRouter.wait()` comes to save you. You need to call it directly inside your JavaScript file. After that, whenever your app is ready call `FlowRouter.initialize()`.

#### Example
```js
FlowRouter.wait();
WhenEverYourAppIsReady(() => {
  FlowRouter.initialize();
});
```

-------

### onRouteRegister method

```js
FlowRouter.onRouteRegister(callback);
```
 - `callback` {*Function*}
 - Returns {*void*}

This API is specially designed for add-on developers. They can listen for any registered route and add custom functionality to FlowRouter. This works on both server and client alike.

```js
FlowRouter.onRouteRegister((route) => {
  // do anything with the route object
  console.log(route);
});
```

-------

### path method

```js
FlowRouter.path(path, params, qs);
```
 - `path` {*String*} - Path or Route's name
 - `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `{ key: 'val' }`
 - Returns {*String*} - URI

```js
const pathDef = '/blog/:cat/:id';
const params = { cat: 'met eor', id: 'abc' };
const queryParams = {show: 'y+e=s', color: 'black'};

const path = FlowRouter.path(pathDef, params, queryParams);
console.log(path); // --> "/blog/met%20eor/abc?show=y%2Be%3Ds&color=black"
```

If there are no `params` or `qs`, it will simply return the path as it is.

-------

### pathRegExp option

```js
// Use dashes as separators so `/:id-:slug/` isn't translated to `id-:slug` but to `:id`-`:slug`
FlowRouter.pathRegExp = /(:[\w\(\)\\\+\*\.\?\[\]]+)+/g;
```
 - `pathRegExp` {*RegExp*}
 - Default - `/(:[\w\(\)\\\+\*\.\?\[\]\-]+)+/g`

Use to change the URI RegEx parser used for `params`, for more info see [#25](https://github.com/VeliovGroup/flow-router/issues/25).

-------

### refresh method

```js
FlowRouter.refresh('layout', 'template');
```
 - `layout` {*String*} - [required] Name of the layout template
 - `template` {*String*} - [required] Name of the intermediate template, simple `<template>Loading...</template>` might be a good option


`FlowRouter.refresh()` will force all route's rules and hooks to re-run, including subscriptions, waitOn(s) and template render.
Useful in cases where template logic depends from route's hooks, example:
```handlebars
{{#if currentUser}}
  {{> yield}}
{{else}}
  {{> loginForm}}
{{/if}}
```
in example above "yielded" template may loose data context after user login action, although user login will cause `yield` template to render - `data` and `waitOn` hooks will not fetch new data.

#### Login example
```js
Meteor.loginWithPassword({
  username: 'some@email.com'
}, 'password', error => {
  if (error) {
    /* show error */
  } else {
    /* If login form has its own `/login` route, redirect to root: */
    if (FlowRouter._current.route.name === 'login') {
      FlowRouter.go('/');
    } else {
      FlowRouter.refresh('_layout', '_loading');
    }
  }
});
```

#### Logout example
```js
Meteor.logout((error) => {
  if (error) {
    console.error(error);
  } else {
    FlowRouter.refresh('_layout', '_loading');
  }
});
```

-------

### reload method

```js
FlowRouter.reload();
```
 - Returns {*void*}

FlowRouter routes are idempotent. That means, even if you call `FlowRouter.go()` to the same URL multiple times, it only activates in the first run. This is also true for directly clicking on paths.

So, if you really need to reload the route, this is the method you want.

-------

### render method

`this.render()` method is available only [inside hooks](https://github.com/VeliovGroup/flow-router/tree/master/docs#hooks-in-execution-order).

 - __Note__: `this.render()` method is available only if application has `templating` and `blaze`, or `blaze-html-templates` packages installed.

#### With Layout
`this.render(layout, template [, data, callback])`
 - `layout` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of layout template (*which has* `yield`)
 - `template` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of template (*which will be rendered into yield*)
 - `data` {*Object*} - [Optional] Object of data context to use in template. Will be passed to both `layout` and `template`
 - `callback` {*Function*} - [Optional] Callback triggered after template is rendered and placed into DOM. This callback has no context

#### Without Layout
`this.render(template [, data, callback])`
 - `template` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of template (*which will be rendered into* `body` *element, or element defined in* `FlowRouter.Renderer.rootElement`)
 - `data` {*Object*} - [Optional] Object of data context to use in template
 - `callback` {*Function*} - [Optional] Callback triggered after template is rendered and placed into DOM. This callback has no context

#### Features:
 - Made with animation performance in mind, all DOM interactions are wrapped into `requestAnimationFrame`
 - In-memory rendering (*a.k.a. off-screen rendering, virtual DOM*), disabled by default, can be activated with `FlowRouter.Renderer.inMemoryRendering = true;`

#### Settings (*Experimental!*):
 - Settings below is experimental, targeted to reduce on-screen DOM layout reflow, speed up rendering on slower devices and Phones in first place, by moving DOM computation to off-screen (*a.k.a. In-Memory DOM, Virtual DOM*)
 - `FlowRouter.Renderer.rootElement` {*Function*} - Function which returns root DOM element where layout will be rendered, default: `document.body`
 - `FlowRouter.Renderer.inMemoryRendering` {*Boolean*} - Enable/Disable in-memory rendering, default: `false`
 - `FlowRouter.Renderer.getMemoryElement` {*Function*} - Function which returns default in-memory element, default: `document.createElement('div')`. Use `document.createDocumentFragment()` to avoid extra parent elements
     * The default `document.createElement('div')` will cause extra wrapping `div` element
     * `document.createDocumentFragment()` won't cause extra wrapping `div` element but may lead to exceptions in Blaze engine, depends from your app implementation

-------

### route method

`.route(path, options)`
 - `path` {*String*} - Path with placeholders
 - `options` {*Object*}
 - `options.name` {*String*} - Route's name
 - `options[prop-name]` {*Any*} - [Optional] Any property which will be available inside route call
 - `options[hook-name]` {*Function*} - [Optional] See [all available hooks](https://github.com/VeliovGroup/flow-router/tree/master/docs#hooks-in-execution-order)
 - Returns {*Route*}

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/blog/:cat/:id', {
  name: 'blogPostRoute'
})

const params = {cat: "meteor", id: "abc"};
const queryParams = {show: "yes", color: "black"};

const path = FlowRouter.path("blogPostRoute", params, queryParams);
console.log(path); // prints "/blog/meteor/abc?show=yes&color=black"
```

#### Catch-all route
```js
// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page
  }
});
```

-------

### setParams method

```js
FlowRouter.setParams(params);
```
 - `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
 - Returns {*true*}

Change the current Route's `params` with the new values and re-route to the new path.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

FlowRouter.setParams({appId: 'new-id'});
// Then the user will be redirected to the following path
//      /apps/new-id?show=yes&color=red
```

-------

### setQueryParams method

```js
FlowRouter.setQueryParams(qs);
```
 - `qs` {*String*} - Serialized query string, `{ key: 'val' }`
 - Returns {*true*}


#### Unset parameter
To remove a query param set it to `null`:
```js
FlowRouter.setQueryParams({ paramToRemove: null });
```

-------

### Global Triggers

```js
FlowRouter.triggers.enter([cb1, cb2]);
FlowRouter.triggers.exit([cb1, cb2]);

// filtering
FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});
```

To filter routes use `only` or `except` keywords.
You can't use both `only` and `except` at once.

-------

### url method

```js
FlowRouter.url(path, params, qs);
```
 - `path` {*String*} - Path or Route's name
 - `params` {*Object*} - Serialized route parameters, `{ _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `{ key: 'val' }`
 - Returns {*String*} - Absolute URL using `Meteor.absoluteUrl`

-------

### wait method

```js
FlowRouter.wait();
```
 - Returns {*void*}

By default, FlowRouter initializes the routing process in a `Meteor.startup()` callback. This works for most of the applications. But, some applications have custom initializations and FlowRouter needs to initialize after that.

So, that's where `FlowRouter.wait()` comes to save you. You need to call it directly inside your JavaScript file. After that, whenever your app is ready call `FlowRouter.initialize()`.

#### Example
```js
FlowRouter.wait();
WhenEverYourAppIsReady(() => {
  FlowRouter.initialize();
});
```

-------

### watchPathChange method

```js
FlowRouter.watchPathChange();
```
 - Returns {*void*}

Reactively watch the changes in the path. If you need to simply get the `params` or `qs` use methods like `FlowRouter.getQueryParam()`.

```js
Tracker.autorun(() => {
  FlowRouter.watchPathChange();
  const currentContext = FlowRouter.current();
  // do something with the current context
});
```

-------

### withReplaceState method

```js
FlowRouter.withReplaceState(callback);
```
 - `callback` {*Function*}
 - Returns {*void*}

Normally, all the route changes made via APIs like `FlowRouter.go` and `FlowRouter.setParams()` add a URL item to the browser history. For example, run the following code:

```js
FlowRouter.setParams({id: 'the-id-1'});
FlowRouter.setParams({id: 'the-id-2'});
FlowRouter.setParams({id: 'the-id-3'});
```

Now you can hit the back button of your browser two times. This is normal behavior since users may click the back button and expect to see the previous state of the app.

But sometimes, this is not something you want. You don't need to pollute the browser history. Then, you can use the following syntax.

```js
FlowRouter.withReplaceState(() => {
  FlowRouter.setParams({id: 'the-id-1'});
  FlowRouter.setParams({id: 'the-id-2'});
  FlowRouter.setParams({id: 'the-id-3'});
});
```


-----------


## Hooks

### action hook

`action(params, qs, data)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - `data` {*Mix*} - Value returned from `.data()` hook
 - Return: {*void*}

`.action()` hook is triggered right after page is navigated to route, or after (*exact order, if any of those is defined*):
 - [`.whileWaiting()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/whileWaiting.md)
 - [`.waitOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOn.md)
 - [`.waitOnResources()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOnResources.md)
 - [`.triggersEnter()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
 - [`.data()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/data.md)

-------

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

-------

### endWaiting hook

`endWaiting()` - Called with no arguments
 - Return: {*void*}

`.endWaiting()` hook is triggered right after all resources in `.waitOn()` and `.waitOnResources()` hooks are ready.

-------

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

-------

### triggersEnter

`triggersEnter` is option (*not actually a hook*), it accepts array of *Function*s, each function will be called with next arguments:
 - `context` {*Route*} - Output of `FlowRouter.current()`
 - `redirect` {*Function*} - Use to redirect to another route, same as [`FlowRouter.go()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/go.md)
 - `stop` {*Function*} - Use to abort current route execution
 - `data` {*Mix*} - Value returned from `.data()` hook
 - Return: {*void*}

#### Scroll to top:
```js
const scrollToTop = () => {
  (window.scroll || window.scrollTo || function (){})(0, 0);
};

FlowRouter.route('/', {
  name: 'index',
  triggersEnter: [scrollToTop]
});

// Apply to every route:
FlowRouter.triggers.enter([scrollToTop]);
```

#### Logging:
```js
FlowRouter.route('/', {
  name: 'index',
  triggersEnter: [() => {
    console.log('triggersEnter');
  }]
});
```

#### Redirect:
```js
FlowRouter.route('/', {
  name: 'index',
  triggersEnter: [(context, redirect) => {
    redirect('/other/route');
  }]
});
```

#### Global
```js
FlowRouter.triggers.enter([cb1, cb2]);
```

-------

### triggersExit hooks

`triggersExit` is option (*not actually a hook*), it accepts array of *Function*s, each function will be called with one argument:
 - `context` {*Route*} - Output of `FlowRouter.current()`
 - Return: {*void*}

```js
const trackRouteEntry = (context) => {
  // context is the output of `FlowRouter.current()`
  console.log("visit-to-home", context.queryParams);
};

const trackRouteClose = (context) => {
  console.log("move-from-home", context.queryParams);
};

FlowRouter.route('/home', {
  // calls just before the action
  triggersEnter: [trackRouteEntry],
  action() {
    // do something you like
  },
  // calls when when we decide to move to another route
  // but calls before the next route started
  triggersExit: [trackRouteClose]
});
```

#### Global
```js
FlowRouter.triggers.exit([cb1, cb2]);
```

-------

### waitOn hook

`waitOn(params, qs, data)`
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

-------

### waitOnResources hook

`waitOnResources(params, qs)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - Return: {*Object*} `{ images: ['url'], other: ['url'] }`

`.waitOnResources()` hook is triggered before `.action()` hook, allowing to load necessary files, images, fonts before rendering a template.

#### Preload images
```js
FlowRouter.route('/images', {
  name: 'images',
  waitOnResources() {
    return {
      images:[
        '/imgs/1.png',
        '/imgs/2.png',
        '/imgs/3.png'
      ]
    };
  },
});
```

#### Global
Useful to preload background images and other globally used resources
```js
FlowRouter.globals.push({
  waitOnResources() {
    return {
      images: [
        '/imgs/background/jpg',
        '/imgs/icon-sprite.png',
        '/img/logo.png'
      ]
    };
  }
});
```

#### Preload Resources
This method will work only for __cacheble__ resources, if URLs returns non-cacheble resources (*dynamic resources*) it will be useless.

*Why Images and Other resources is separated? What the difference?* - Images can be prefetched via `Image()` constructor, all other resources will use `XMLHttpRequest` to cache resources. Thats why important to make sure requested URLs returns cacheble response.


```js
FlowRouter.route('/', {
  name: 'index',
  waitOnResources() {
    return {
      other:[
        '/fonts/OpenSans-Regular.eot',
        '/fonts/OpenSans-Regular.svg',
        '/fonts/OpenSans-Regular.ttf',
        '/fonts/OpenSans-Regular.woff',
        '/fonts/OpenSans-Regular.woff2'
      ]
    };
  }
});
```

#### Global
Useful to prefetch Fonts and other globally used resources
```js
FlowRouter.globals.push({
  waitOnResources() {
    return {
      other:[
        '/fonts/OpenSans-Regular.eot',
        '/fonts/OpenSans-Regular.svg',
        '/fonts/OpenSans-Regular.ttf',
        '/fonts/OpenSans-Regular.woff',
        '/fonts/OpenSans-Regular.woff2'
      ]
    };
  }
});
```

-------

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


-----------


## Template Helpers

 - __Note__: Template Helpers are available only if application has `templating` and `blaze`, or `blaze-html-templates` packages installed.

### `currentRouteName` Template Helper

Returns the name of the current route

```handlebars
<div class={{currentRouteName}}>
  ...
</div>
```

-------

### `currentRouteOption` Template Helper

This adds support to get options from flow router

```javascript
FlowRouter.route('name', {
  name: 'routeName',
  action() {
    this.render('layoutTemplate', 'main');
  },
  coolOption: "coolOptionValue"
});
```

```handlebars
<div class={{currentRouteOption 'coolOption'}}>
  ...
</div>
```

-------

### `isActivePath` Template Helper

Template helper to check if the supplied path matches the currently active route's path.

Returns either a configurable `String`, which defaults to `'active'`, or `false`.

```handlebars
<li class="{{isActivePath '/home'}}">...</li>
<li class="{{isActivePath path='/home'}}">...</li>
<li class="{{isActivePath regex='home|dashboard'}}">...</li>
{{#if isActivePath '/home'}}
  <span>Show only if '/home' is the current route's path</span>
{{/if}}
{{#if isActivePath regex='^\\/products'}}
  <span>Show only if current route's path begins with '/products'</span>
{{/if}}

<li class="{{isActivePath class='is-selected' path='/home'}}">...</li>
<li class="{{isActivePath '/home' class='is-selected'}}">...</li>
```

-------

### `isActiveRoute` Template Helper

Template helper to check if the supplied route name matches the currently active route's name.

Returns either a configurable `String`, which defaults to `'active'`, or `false`.

```handlebars
<li class="{{isActiveRoute 'home'}}">...</li>
<li class="{{isActiveRoute name='home'}}">...</li>
<li class="{{isActiveRoute regex='home|dashboard'}}">...</li>
{{#if isActiveRoute 'home'}}
  <span>Show only if 'home' is the current route's name</span>
{{/if}}
{{#if isActiveRoute regex='^products'}}
  <span>Show only if the current route's name begins with 'products'</span>
{{/if}}

<li class="{{isActiveRoute class='is-selected' name='home'}}">...</li>
<li class="{{isActiveRoute 'home' class='is-selected'}}">...</li>
```

-------

### `isNotActivePath` Template Helper

Template helper to check if the supplied path doesn't match the currently active route's path.

Returns either a configurable `String`, which defaults to `'disabled'`, or `false`.

```handlebars
<li class="{{isNotActivePath '/home'}}">...</li>
<li class="{{isNotActivePath path='/home'}}">...</li>
<li class="{{isNotActivePath regex='home|dashboard'}}">...</li>
{{#if isNotActivePath '/home'}}
  <span>Show only if '/home' isn't the current route's path</span>
{{/if}}
{{#if isNotActivePath regex='^\\/products'}}
  <span>Show only if current route's path doesn't begin with '/products'</span>
{{/if}}

<li class="{{isNotActivePath class='is-disabled' path='/home'}}">...</li>
<li class="{{isNotActivePath '/home' class='is-disabled'}}">...</li>
```

-------

### `isNotActiveRoute` Template Helper

Template helper to check if the supplied route name doesn't match the currently active route's name.

Returns either a configurable `String`, which defaults to `'disabled'`, or `false`.

```handlebars
<li class="{{isNotActiveRoute 'home'}}">...</li>
<li class="{{isNotActiveRoute name='home'}}">...</li>
<li class="{{isNotActiveRoute regex='home|dashboard'}}">...</li>
{{#if isNotActiveRoute 'home'}}
  <span>Show only if 'home' isn't the current route's name</span>
{{/if}}
{{#if isNotActiveRoute regex='^products'}}
  <span>
    Show only if the current route's name doesn't begin with 'products'
  </span>
{{/if}}

<li class="{{isNotActiveRoute class='is-disabled' name='home'}}">...</li>
<li class="{{isNotActiveRoute 'home' class='is-disabled'}}">...</li>
```

#### Arguments
The following can be used by as arguments in `isNotActivePath`, `isNotActiveRoute`, `isActivePath` and `isActiveRoute` helpers.

 - Data context, Optional. `String` or `Object` with `name`, `path` or `regex`
 - `name` {*String*} - Only available for `isActiveRoute` and `isNotActiveRoute`
 - `path` {*String*} - Only available for `isActivePath` and `isNotActivePath`
 - `regex` {*String|RegExp*}

-------

### `param` Template Helper

Returns the value for a URL parameter

```handlebars
<div>ID of this post is <em>{{param 'id'}}</em></div>
```

-------

### `pathFor` Template Helper

Used to build a path to your route. First parameter can be either the path definition or name you assigned to the route. After that you can pass the params needed to construct the path. Query parameters can be passed with the `query` parameter. Hash is supported via `hash` parameter.

```handlebars
<a href="{{pathFor '/post/:id' id=_id}}">Link to post</a>
<a href="{{pathFor 'postRouteName' id=_id}}">Link to post</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id cid=comment._id}}">Link to comment in post</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id hash=comment._id}}">Jump to comment</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id cid=comment._id query='back=yes&more=true'}}">Link to comment in post with query params</a>
```

-------

### `queryParam` Template Helper

Returns the value for a query parameter

```handlebars
<input placeholder="Search" value="{{queryParam 'query'}}">
```

-------

### `urlFor` Template Helper

Used to build an absolute URL to your route. First parameter can be either the path definition or name you assigned to the route. After that you can pass the params needed to construct the URL. Query parameters can be passed with the `query` parameter. Hash is supported via `hash` parameter.

```handlebars
<a href="{{urlFor '/post/:id' id=_id}}">Link to post</a>
<a href="{{urlFor 'postRouteName' id=_id}}">Link to post</a>
<a href="{{urlFor '/post/:id/comments/:cid' id=_id cid=comment._id}}">Link to comment in post</a>
<a href="{{urlFor '/post/:id/comments/:cid' id=_id hash=comment._id}}">Jump to comment</a>
<a href="{{urlFor '/post/:id/comments/:cid' id=_id cid=comment._id query='back=yes&more=true'}}">Link to comment in post with query params</a>
```