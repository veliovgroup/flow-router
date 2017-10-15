FlowRouter Extra
======
Carefully extended [flow-router](https://github.com/kadirahq/flow-router) package. *This package is meant to replace original FlowRouter,* `kadira:flow-router` *should be removed to avoid interference and unexpected behavior.*

## TOC
FlowRouter Extra:
 - Great tests coverage
 - Up-to-date dependencies
 - Compatibility with latest Meteor release
 - [ES6 Import](https://github.com/VeliovGroup/flow-router#es6-import) - Support for `.jsx` and `ecmascript` modules/imports
 - [Template Helpers](https://github.com/VeliovGroup/flow-router#template-helpers) - `isActiveRoute`, `isActivePath`, `urlFor`, `pathFor`, `isSubReady`, `currentRouteName`, `param` and many more useful helpers
 - [Preload Images](https://github.com/VeliovGroup/flow-router#preload-images) - "Prefetch" images before displaying Template
 - [Preload Resources](https://github.com/VeliovGroup/flow-router#preload-resources) - "Prefetch" resources, like: CSS, JS, Fonts, etc. before displaying Template
 - [waitOn hook](https://github.com/VeliovGroup/flow-router#waiton-hook) - Wait for all subscriptions is ready
 - [waitOn hook with Promises](https://github.com/VeliovGroup/flow-router#waiton-hook-with-promises) - Wait for Promise(s) to be *fulfilled*
 - [waitOn hook with `dynamic import(...)`](https://github.com/VeliovGroup/flow-router#waiton-hook-with-dynamic-import) - Use dynamic per route [`import()`](https://github.com/tc39/proposal-dynamic-import) as [explained here](https://blog.meteor.com/dynamic-imports-in-meteor-1-5-c6130419c3cd). __Note: Only for [Meteor >= 1.5](https://github.com/meteor/meteor/blob/devel/History.md#v15-2017-05-30)__
 - [waitOn hook with reactive data](https://github.com/VeliovGroup/flow-router#waiton-hook-with-reactive-data) - Wait for all subscriptions with reactive data sources is ready
 - [whileWaiting hook](https://github.com/VeliovGroup/flow-router#whilewaiting-hook) - Do something while waiting for subscriptions
 - [data hook](https://github.com/VeliovGroup/flow-router#data-hook) - Fetch data from collection before render router's template
 - [onNoData hook](https://github.com/VeliovGroup/flow-router#onnodata-hook) - Do something if "*data hook*" returns falsy value
 - [Data in other hooks](https://github.com/VeliovGroup/flow-router#data-in-other-hooks) - Use fetched data in other hooks
 - [Render Template](https://github.com/VeliovGroup/flow-router#render-template) - Render template into layout
 - [Refresh](https://github.com/VeliovGroup/flow-router#refresh-route) - Force template and layout re-rendering, re-subscriptions, and generally route refresh
 - [Templating](https://github.com/VeliovGroup/flow-router#templating) - Construct your layout and templates
 - [Suggested usage](https://github.com/VeliovGroup/flow-router#suggested-usage) - Bootstrap router's configuration
 - [Other packages compatibility](https://github.com/VeliovGroup/flow-router#other-packages-compatibility) - Best packages to be used with flow-router-extra
 - [Support this project](https://github.com/VeliovGroup/flow-router#support-this-project)

Original FlowRouter's documentation:
 - [Meteor Routing Guide](#meteor-routing-guide)
 - [Getting Started](#getting-started)
 - [Routes Definition](#routes-definition)
 - [Group Routes](#group-routes)
 - [Rendering and Layout Management](#rendering-and-layout-management)
 - [Triggers](#triggers)
 - [Not Found Routes](#not-found-routes)
 - [API](#api)
 - [Subscription Management](#subscription-management)
 - [IE9 Support](#ie9-support)
 - [Hashbang URLs](#hashbang-urls)
 - [Prefixed paths](#prefixed-paths)
 - [Add-ons](#add-ons)
 - [Difference with Iron Router](#difference-with-iron-router)
 - [Migrating into 2.0](#migrating-into-20)


## FlowRouter Extra:
### Installation
```shell
# Remove original FlowRouter
meteor remove kadira:flow-router
meteor add ostrio:flow-router-extra
```

### ES6 Import
```jsx
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Full list of available classes:
// import { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer, RouterHelpers } from 'meteor/ostrio:flow-router-extra';
```

### Template Helpers
Original code was taken from [`zimme:active-route`](https://github.com/meteor-activeroute/legacy) and [`arillo:flow-router-helpers`](https://github.com/arillo/meteor-flow-router-helpers).

##### `isActiveRoute`
Template helper to check if the supplied route name matches the currently active
route's name.

Returns either a configurable `String`, which defaults to `'active'`, or
`false`.

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

##### `isActivePath`
Template helper to check if the supplied path matches the currently active
route's path.

Returns either a configurable `String`, which defaults to `'active'`, or
`false`.

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

##### `isNotActiveRoute`
Template helper to check if the supplied route name doesn't match the currently
active route's name.

Returns either a configurable `String`, which defaults to `'disabled'`, or
`false`.

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

##### `isNotActivePath`
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

#### Arguments
The following can be used by as arguments in `isNotActivePath`, `isNotActiveRoute`, `isActivePath` and `isActiveRoute` helpers.

* Data context, Optional. `String` or `Object` with `name`, `path` or `regex`
* `name` {*String*} - Only available for `isActiveRoute` and `isNotActiveRoute`
* `path` {*String*} - Only available for `isActivePath` and `isNotActivePath`
* `regex` {*String|RegExp*}


##### `pathFor`
Used to build a path to your route. First parameter can be either the path definition or name you assigned to the route. After that you can pass the params needed to construct the path. Query parameters can be passed with the `query` parameter. Hash is supported via `hash` parameter.

```handlebars
<a href="{{pathFor '/post/:id' id=_id}}">Link to post</a>
<a href="{{pathFor 'postRouteName' id=_id}}">Link to post</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id cid=comment._id}}">Link to comment in post</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id hash=comment._id}}">Jump to comment</a>
<a href="{{pathFor '/post/:id/comments/:cid' id=_id cid=comment._id query='back=yes&more=true'}}">Link to comment in post with query params</a>
```

##### `urlFor`
Same as pathFor, returns absolute URL.

```handlebars
{{urlFor '/post/:id' id=_id}}
```

##### `linkTo`
Custom content block for creating a link

```handlebars
{{#linkTo '/posts/'}}
  Go to posts
{{/linkTo}}
```

will return ```<a href="/posts/">Go to posts</a>```

##### `param`
Returns the value for a url parameter

```handlebars
<div>ID of this post is <em>{{param 'id'}}</em></div>
```

##### `queryParam`
Returns the value for a query parameter

```handlebars
<input placeholder="Search" value="{{queryParam 'query'}}">
```

##### `currentRouteName`
Returns the name of the current route

```handlebars
<div class={{currentRouteName}}>
  ...
</div>
```

##### `currentRouteOption`
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

#### Javascript Usage
```jsx
import { RouterHelpers } from 'meteor/ostrio:flow-router-extra';

RouterHelpers.name('home');
// Returns true if current route's name is 'home'.
RouterHelpers.name(new RegExp('home|dashboard'));
// Returns true if current route's name contains 'home' or 'dashboard'.
RouterHelpers.name(/^products/);
// Returns true if current route's name starts with 'products'.
RouterHelpers.path('/home');
// Returns true if current route's path is '/home'.
RouterHelpers.path(new RegExp('users'));
// Returns true if current route's path contains 'users'.
RouterHelpers.path(/\/edit$/i);
// Returns true if current route's path ends with '/edit', matching is
// case-insensitive

RouterHelpers.pathFor('/post/:id', {id: '12345'});

RouterHelpers.configure({
  activeClass: 'active',
  caseSensitive: true,
  disabledClass: 'disabled',
  regex: 'false'
});
```

### Preload images
`waitOnResources` hook is *Function* passed as property into router configuration object. It is called with three arguments `params`, `queryParams` and `data`, same as `action`. You must return data in next form: `{images: [/*array of strings with URL to images*/]}`.

Per route usage:
```jsx
FlowRouter.route('/images', {
  name: 'images',
  waitOnResources(params, queryParams, data) {
    return {
      images:[
        '/imgs/1.png',
        '/imgs/2.png',
        '/imgs/3.png'
      ]
    };
  },
  whileWaiting(params, queryParams) { // <- Render template with spinner
    this.render('_layout', '_loading');
  }
});
```

Globally loaded images. Useful to preload background images and other globally used resources:
```jsx
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

### Preload Resources
`waitOnResources` hook is *Function* passed as property into router configuration object. It is called with three arguments `params`, `queryParams` and `data`, same as `action`. You must return data in next form: `{other: [/*array of strings with URL*/]}`. This method will work only for __cacheble__ resources, if URLs returns non-cacheble resources (dynamic resources) it will be useless.

*Why Images and Other resources is separated? What the difference?* - Images can be prefetched via `Image()` constructor, all other resources uses `XMLHttpRequest` to cache resources. Thats also why important to make sure requested URLs returns cacheble responses

Per route usage:
```jsx
FlowRouter.route('/', {
  name: 'index',
  waitOnResources(params, queryParams, data) {
    return {
      other:[
        '/fonts/OpenSans-Regular.eot',
        '/fonts/OpenSans-Regular.svg',
        '/fonts/OpenSans-Regular.ttf',
        '/fonts/OpenSans-Regular.woff',
        '/fonts/OpenSans-Regular.woff2'
      ]
    };
  },
  whileWaiting(params, queryParams) { // <- Render template with spinner
    this.render('_layout', '_loading');
  }
});
```

Globally loaded resources. Useful to prefetch Fonts and other globally used resources:
```jsx
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


### waitOn hook
`waitOn` hook is *Function* passed as property into route configuration object. It is called with two arguments `params` and `queryParams`, same as `action`. Works like a charm with both original Meteor's [`Meteor.subscribe`](http://docs.meteor.com/#/full/meteor_subscribe) and [`subs-manager` package](https://github.com/kadirahq/subs-manager). Function __must__ return subscription handler, *Array* of subscription handlers or Tracker Computation object.
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params, queryParams) {
    return [subsManager.subscribe('post', params._id), Meteor.subscribe('suggestedPosts', params._id)];
  }
});
```

### waitOn hook with reactive data
Use reactive data sources inside `waitOn` hook. To make `waitOn` rerun on reactive data changes, wrap it to `Tracker.autorun` and return Tracker Computation object or an *Array* of Tracker Computation objects. Note: the third argument of `waitOn` is `ready` callback.
```jsx
FlowRouter.route('/posts', {
  name: 'post',
  waitOn(params, queryParams, ready) {
    return Tracker.autorun(() => {
      ready(() => {
        return Meteor.subscribe('posts', search.get(), page.get());
      });
    });
  }
});
```

With multiple Trackers:
```jsx
FlowRouter.route('/posts', {
  name: 'post',
  waitOn(params, queryParams, ready) {
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

### waitOn hook with Promises
Use Promise(s) data sources inside `waitOn` hook.
```jsx
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

// Or with Array of Promises:
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return [new Promise({/*..*/}), new Promise({/*..*/}), new Promise({/*..*/})];
  }
});
```

### waitOn hook with dynamic `import`
Use dynamic per route [`import()`](https://github.com/tc39/proposal-dynamic-import) as [explained here](https://blog.meteor.com/dynamic-imports-in-meteor-1-5-c6130419c3cd). __Note: Only for [Meteor >= 1.5](https://github.com/meteor/meteor/blob/devel/History.md#v15-2017-05-30)__
```jsx
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return import('/imports/client/posts.js');
  }
});

// Or with Array of import(s):
FlowRouter.route('/posts', {
  name: 'posts',
  waitOn() {
    return [import('/imports/client/posts.js'), import('/imports/client/sidebar.js'), import('/imports/client/footer.js')];
  }
});

// Use `whileWaiting` and `endWaiting` to show spinner (a.k.a. loader):
FlowRouter.route('/posts', {
  name: 'posts',
  whileWaiting: startSpinner,
  endWaiting: stopSpinner,
  waitOn() {
    return [import('/imports/client/posts.js'), import('/imports/client/sidebar.js'), import('/imports/client/footer.js')];
  }
});

// Combine with subscription:
FlowRouter.route('/posts', {
  name: 'posts',
  whileWaiting: startSpinner,
  endWaiting: stopSpinner,
  waitOn() {
    return [import('/imports/client/posts.js'), Meteor.subscribe('Posts')];
  }
});
```

### whileWaiting hook
`whileWaiting` hook is capable for time between user hits your page and all subscriptions from `waitOn` hook is ready. It is called with two arguments `params` and `queryParams`, same as `action`. Let's render `_loading` template in it. This hook also follows main `flow-router` ideology - loading hook not depend from layout or anything else. You may run any JavaScript code inside this hook, it is not limited to loading template.
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  whileWaiting(params, queryParams) {
    this.render('_layout', '_loading');
  }
});
```

### data hook
`data` hook is capable for time after `waitOn` hook is ready and `action` is begin run. It is called with two arguments `params` and `queryParams`, same as `action`. This hook must return *Object*, *Mongo.Cursor* (or array of it) or falsy value.
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  whileWaiting() {
    this.render('_layout', '_loading');
  },
  data(params, queryParams) {
    return PostsCollection.findOne({_id: params._id});
  }
});
```


When you having `data` hook in a route, - returned data will be passed to `action` as third argument. So you can pass fetched data into template:
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  action(params, queryParams, post) {
    this.render('_layout', 'post', {post: post});
  },
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data(params, queryParams) {
    return PostsCollection.findOne({_id: params._id});
  }
});
```
```html
<!-- in template -->
<template name="post">
  <h1>{{post.title}}</h1>
  <p>{{post.text}}</p>
</template>
```

### onNoData hook
`onNoData` hook is triggered instead of `action` in case when `data` hook returned falsy value. It is called with two arguments `params` and `queryParams`, same as `action`. Let's render `_404` template in it. You can run any JavaScript code inside it, for example instead of rendering *404* template you can redirect user somewhere.
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data(params) {
    return PostsCollection.findOne({_id: params._id});
  },
  onNoData(params, queryParams){
    this.render('_layout', '_404');
  }
});
```

### Data in other hooks
Returned data from `data` hook, will be also passed into all `triggersEnter` hooks as fourth argument.
```jsx
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data(params) {
    return PostsCollection.findOne({_id: params._id});
  },
  triggersEnter: [(context, redirect, stop, data) => {
    console.log(data);
  }]
});
```

### Render Template
*Instead of BlazeLayout, you can use build-in* `this.render()` *method*. Use it in context of `action`, `onNoData`, `whileWaiting`, `data`, `waitOn` or any other hook.

Features:
 - Made with animation performance in mind, all DOM interactions are wrapped into `requestAnimationFrame`
 - In-memory rendering (*a.k.a. off-screen rendering, virtual DOM*), disabled by default, can be activated with `FlowRouter.Renderer.inMemoryRendering = true;`

Settings (*Experimental!*):
 - Settings below is experimental, targeted to reduce on-screen DOM layout reflow, speed up rendering on slower devices and Phones in first place, by moving DOM computation to off-screen (*a.k.a. In-Memory DOM, Virtual DOM*)
 - `FlowRouter.Renderer.rootElement` {*Function*} - Function which returns root DOM element where layout will be rendered, default: `document.body`
 - `FlowRouter.Renderer.inMemoryRendering` {*Boolean*} - Enable/Disable in-memory rendering, default: `false`
 - `FlowRouter.Renderer.getMemoryElement` {*Function*} - Function which returns default in-memory element, default: `document.createElement('div')`. Use `document.createDocumentFragment()` to avoid extra parent elements
     * The default `document.createElement('div')` will cause extra wrapping `div` element
     * `document.createDocumentFragment()` won't cause extra wrapping `div` element but may lead to exceptions in Blaze engine, depends from your app implementation

`this.render(layout, template [, data, callback])`
 - `layout` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of layout template (*which has* `yield`)
 - `template` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of template (*which will be rendered into yield*)
 - `data` {*Object*} - [Optional] Object of data context to use in template. Will be passed to both `layout` and `template`
 - `callback` {*Function*} - [Optional] Callback triggered after template is rendered and placed into DOM. This callback has no context

`this.render(template [, data, callback])`
 - `template` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of template (*which will be rendered into* `body` *element, or element defined in* `FlowRouter.Renderer.rootElement`)
 - `data` {*Object*} - [Optional] Object of data context to use in template
 - `callback` {*Function*} - [Optional] Callback triggered after template is rendered and placed into DOM. This callback has no context

### Templating
*In order to use build-in* `this.render()` *method, layout template must contain* `yield` *placeholder*
```html
<!-- layout.html: -->
<head>
  <meta charset="UTF-8" />
  <meta name="fragment" content="!" />
  <!-- ... -->
  <title>My Title</title>
</head>

<template name="_layout">
  <header>
    {{> header}}
  </header>

  <section>
    {{> yield}}
  </section>

  <footer>
    {{> footer}}
  </footer>
</template>

<template name="header">
  <h1>My Page</h1>
</template>

<template name="footer">
  <p><!-- ... --></p>
</template>
```

```html
<!-- posts.html: -->
<template name="posts">
  <ul>
    {{#each post in posts}}
      <li>
        <a href="/post/{{post._id}}">{{post.title}}</a>
      </li>
    {{/each}}
  </ul>
</template>
```

```html
<!-- post.html: -->
<template name="post">
  {{#with post}}
    <h3>{{title}}</h3>
    <article>
      {{{text}}}
    </article>
  {{/with}}
</template>
```

```jsx
require('./layout.html');
// routes.js
FlowRouter.route('/posts', {
  name: 'posts',
  action(params, queryParams, posts) {
    require('./posts.html');
    this.render('_layout', 'posts', posts);
    // Or as Blaze.Template instance:
    // this.render(Template._layout, Template.posts, posts);
  },
  waitOn() {
    return [Meteor.subscribe('posts')];
  },
  data() {
    return PostsCollection.find({});
  }
});

FlowRouter.route('/post/:_id', {
  name: 'posts',
  action(params, queryParams, post) {
    require('./post.html');
    this.render('_layout', 'post', post);
    // Or as Blaze.Template instance:
    // this.render(Template._layout, Template.post, posts);
  },
  waitOn(params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data(params) {
    return PostsCollection.findOne({_id: params._id});
  }
});
```

### Refresh Route
```js
FlowRouter.refresh('layout', 'template');
```
 - `layout` {*String*} - [required] Name of the layout template
 - `template` {*String*} - [required] Name of the intermediate template, simple `<template>Loading...</template>` might be a good option

`FlowRouter.refresh()` will force all route's rules and hooks to re-run, including subscriptions, waitOn(s) and template render.
Useful in cases where template logic is depends from route's hooks, example:
```handlebars
{{#if currentUser}}
  {{> yield}}
{{else}}
  {{> loginForm}}
{{/if}}
```
in example above "yielded" template may loose data context after user login action, although user login will cause `yield` template to render - `data` and `waitOn` hooks will not fetch new data.

Login example:
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

Logout example:
```js
Meteor.logout((error) => {
  if (error) {
    console.error(error);
  } else {
    FlowRouter.refresh('_layout', '_loading');
  }
});
```

### Suggested usage
As example we took simple post route:
```jsx
// meteorhacks:subs-manager package
const subsManager = new SubsManager();

FlowRouter.route('/post/:_id', {
  name: 'post',
  action(params, queryParams, data) {
    // Pass data to template's context
    // No need to create helpers
    this.render('_layout', 'post', {post: data});
  },
  waitOn(params) {
    // meteorhacks:subs-manager package
    return [subsManager.subscribe('post', params._id)];
  },
  whileWaiting() {
    this.render('_layout', '_loading');
  },
  data(params) {
    return PostsCollection.findOne({_id: params._id});
  },
  onNoData(){
    this.render('_layout', '_404');
  },
  // ostrio:flow-router-title package
  title(params, queryParams, post) {
    return (post) ? post.title : '404: Page not found';
  }
});

// 404 route
// Since v3.2.0 it's recommended to use `*` route
// instead of deprecated `.notFound` option
FlowRouter.route('*', {
  title: '404: Page not found',
  action() {
    this.render('_layout', '_404');
  }
});

// jazeee:spiderable-longer-timeout package
FlowRouter.triggers.enter([() => {
  Meteor.isReadyForSpiderable = true;
}]);
```

```html
<!-- in template -->
<template name="post">
  <h1>{{post.title}}</h1>
  <p>{{post.text}}</p>
</template>
```

You can change the URI Regex parser used for `params` (default `/(:[\w\(\)\\\+\*\.\?\[\]\-]+)+/g`), for more info see [#25](https://github.com/VeliovGroup/flow-router/issues/25):
```jsx
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// Use dashes as separators so `/:id-:slug/` isn't translated to `id-:slug` but to `:id`-`:slug`
FlowRouter.pathRegExp = /(:[\w\(\)\\\+\*\.\?\[\]]+)+/g;
FlowRouter.route(...);
```

### Other packages compatibility
This package tested and recommended to use with next packages:
 - [meteorhacks:subs-manager](https://github.com/kadirahq/subs-manager) - Manage subscriptions with caching
 - [jazeee:spiderable](https://github.com/jazeee/jazeee-meteor-spiderable) - Making your pages accessible for crawlers
 - [ostrio:flow-router-title](https://github.com/VeliovGroup/Meteor-flow-router-title) - Reactive page title (`document.title`)
 - [ostrio:flow-router-meta](https://github.com/VeliovGroup/Meteor-flow-router-meta) - Reactive `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
 - [appcache](https://github.com/meteor/meteor/wiki/AppCache) - Making your application available offline

__Note:__ *if you're using any package which requires original FR namespace, throws an error, you can solve it with next code:*
```jsx
// in /lib/ directory
Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
```


### Support this project:
This project can't be possible without [ostr.io](https://ostr.io).

By using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one are available for free.

-------


# Original `flow-router` documentation:
## Meteor Routing Guide

[Meteor Routing Guide](https://kadira.io/academy/meteor-routing-guide) is a completed guide into **routing** and related topics in Meteor. It talks about how to use FlowRouter properly and use it with **Blaze and React**. It also shows how to manage **subscriptions** and implement **auth logic** in the view layer.

[![Meteor Routing Guide](https://cldup.com/AxlPfoxXmR.png)](https://kadira.io/academy/meteor-routing-guide)

## Getting Started

Add FlowRouter to your app:

~~~shell
meteor add kadira:flow-router
~~~

Let's write our first route (add this file to `lib/router.js`):

~~~js
FlowRouter.route('/blog/:postId', {
    action: function (params, queryParams) {
        console.log("Yeah! We are on the post:", params.postId);
    }
});
~~~

Then visit `/blog/my-post-id` from the browser or invoke the following command from the browser console:

~~~js
FlowRouter.go('/blog/my-post-id');
~~~

Then you can see some messages printed in the console.

## Routes Definition

FlowRouter routes are very simple and based on the syntax of [path-to-regexp](https://github.com/pillarjs/path-to-regexp) which is used in both [Express](http://expressjs.com/) and `iron:router`.

Here's the syntax for a simple route:

~~~js
FlowRouter.route('/blog/:postId', {
    // do some action for this route
    action: function (params, queryParams) {
        console.log("Params:", params);
        console.log("Query Params:", queryParams);
    },

    name: "<name for the route>" // optional
});
~~~

So, this route will be activated when you visit a url like below:

~~~js
FlowRouter.go('/blog/my-post?comments=on&color=dark');
~~~

After you've visit the route, this will be printed in the console:

~~~
Params: {postId: "my-post"}
Query Params: {comments: "on", color: "dark"}
~~~

For a single interaction, the router only runs once. That means, after you've visit a route, first it will call `triggers`, then `subscriptions` and finally `action`. After that happens, none of those methods will be called again for that route visit.

You can define routes anywhere in the `client` directory. But, we recommend to add them in the `lib` directory. Then `fast-render` can detect subscriptions and send them for you (we'll talk about this is a moment).

### Group Routes

You can group routes for better route organization. Here's an example:

~~~js
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [function (context, redirect) {
    console.log('running group triggers');
  }]
});

// handling /admin route
adminRoutes.route('/', {
  action: function () {
    BlazeLayout.render('componentLayout', {content: 'admin'});
  },
  triggersEnter: [function (context, redirect) {
    console.log('running /admin trigger');
  }]
});

// handling /admin/posts
adminRoutes.route('/posts', {
  action: function () {
    BlazeLayout.render('componentLayout', {content: 'posts'});
  }
});
~~~

**All of the options for the `FlowRouter.group()` are optional.**

You can even have nested group routes as shown below:

~~~js
var adminRoutes = FlowRouter.group({
    prefix: "/admin",
    name: "admin"
});

var superAdminRoutes = adminRoutes.group({
    prefix: "/super",
    name: "superadmin"
});

// handling /admin/super/post
superAdminRoutes.route('/post', {
    action: function () {

    }
});
~~~

You can determine which group the current route is in using:

~~~js
FlowRouter.current().route.group.name
~~~

This can be useful for determining if the current route is in a specific group (e.g. *admin*, *public*, *loggedIn*) without needing to use prefixes if you don't want to. If it's a nested group, you can get the parent group's name with:

~~~js
FlowRouter.current().route.group.parent.name
~~~

As with all current route properties, these are not reactive, but can be combined with `FlowRouter.watchPathChange()` to get group names reactively.

## Rendering and Layout Management

FlowRouter does not handle rendering or layout management. For that, you can use:

  * [Blaze Layout for Blaze](https://github.com/kadirahq/blaze-layout)
  * [React Layout for React](https://github.com/kadirahq/meteor-react-layout)

Then you can invoke the layout manager inside the `action` method in the router.

~~~js
FlowRouter.route('/blog/:postId', {
    action: function (params) {
        BlazeLayout.render("mainLayout", {area: "blog"});
    }
});
~~~

## Triggers

Triggers are the way FlowRouter allows you to perform tasks before you **enter** into a route and after you **exit** from a route.

#### Defining triggers for a route

Here's how you can define triggers for a route:

~~~js
FlowRouter.route('/home', {
  // calls just before the action
  triggersEnter: [trackRouteEntry],
  action: function () {
    // do something you like
  },
  // calls when when we decide to move to another route
  // but calls before the next route started
  triggersExit: [trackRouteClose]
});

function trackRouteEntry(context) {
  // context is the output of `FlowRouter.current()`
  Mixpanel.track("visit-to-home", context.queryParams);
}

function trackRouteClose(context) {
  Mixpanel.track("move-from-home", context.queryParams);
}
~~~

#### Defining triggers for a group route

This is how you can define triggers on a group definition.

~~~js
var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  triggersEnter: [trackRouteEntry],
  triggersExit: [trackRouteEntry]
});
~~~

> You can add triggers to individual routes in the group too.

#### Defining Triggers Globally

You can also define triggers globally. Here's how to do it:

~~~js
FlowRouter.triggers.enter([cb1, cb2]);
FlowRouter.triggers.exit([cb1, cb2]);

// filtering
FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});
~~~

As you can see from the last two examples, you can filter routes using the `only` or `except` keywords. But, you can't use both `only` and `except` at once.

> If you'd like to learn more about triggers and design decisions, visit [here](https://github.com/meteorhacks/flow-router/pull/59).

#### Redirecting With Triggers

You can redirect to a different route using triggers. You can do it from both enter and exit triggers. See how to do it:

~~~js
FlowRouter.route('/', {
  triggersEnter: [function (context, redirect) {
    redirect('/some-other-path');
  }],
  action: function (_params) {
    throw new Error("this should not get called");
  }
});
~~~

Every trigger callback comes with a second argument: a function you can use to redirect to a different route. Redirect also has few properties to make sure it's not blocking the router.

* redirect must be called with an URL
* redirect must be called within the same event loop cycle (no async or called inside a Tracker)
* redirect cannot be called multiple times

Check this [PR](https://github.com/meteorhacks/flow-router/pull/172) to learn more about our redirect API.

#### Stopping the Callback With Triggers

In some cases, you may need to stop the route callback from firing using triggers. You can do this in **before** triggers, using the third argument: the `stop` function. For example, you can check the prefix and if it fails, show the notFound layout and stop before the action fires.

```js
var localeGroup = FlowRouter.group({
  prefix: '/:locale?',
  triggersEnter: [localeCheck]
});

localeGroup.route('/login', {
  action: function (params, queryParams) {
    BlazeLayout.render('componentLayout', {content: 'login'});
  }
});

function localeCheck(context, redirect, stop) {
  var locale = context.params.locale;

  if (locale !== undefined && locale !== 'fr') {
    BlazeLayout.render('notFound');
    stop();
  }
}
```

> **Note**: When using the stop function, you should always pass the second **redirect** argument, even if you won't use it.

## Not Found Routes

You can configure Not Found routes like this:

~~~js
FlowRouter.notFound = {
    // Subscriptions registered here don't have Fast Render support.
    subscriptions: function () {

    },
    action: function () {

    }
};
~~~

## API

FlowRouter has a rich API to help you to navigate the router and reactively get information from the router.

#### FlowRouter.getParam(paramName);

Reactive function which you can use to get a parameter from the URL.

~~~js
// route def: /apps/:appId
// url: /apps/this-is-my-app

var appId = FlowRouter.getParam("appId");
console.log(appId); // prints "this-is-my-app"
~~~

#### FlowRouter.getQueryParam(queryStringKey);

Reactive function which you can use to get a value from the queryString.

~~~js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

var color = FlowRouter.getQueryParam("color");
console.log(color); // prints "red"
~~~

#### FlowRouter.path(pathDef, params, queryParams)

Generate a path from a path definition. Both `params` and `queryParams` are optional.

Special characters in `params` and `queryParams` will be URL encoded.

~~~js
var pathDef = "/blog/:cat/:id";
var params = {cat: "met eor", id: "abc"};
var queryParams = {show: "y+e=s", color: "black"};

var path = FlowRouter.path(pathDef, params, queryParams);
console.log(path); // prints "/blog/met%20eor/abc?show=y%2Be%3Ds&color=black"
~~~

If there are no params or queryParams, this will simply return the pathDef as it is.

##### Using Route name instead of the pathDef

You can also use the route's name instead of the pathDef. Then, FlowRouter will pick the pathDef from the given route. See the following example:

~~~js
FlowRouter.route("/blog/:cat/:id", {
    name: "blogPostRoute",
    action: function (params) {
        //...
    }
})

var params = {cat: "meteor", id: "abc"};
var queryParams = {show: "yes", color: "black"};

var path = FlowRouter.path("blogPostRoute", params, queryParams);
console.log(path); // prints "/blog/meteor/abc?show=yes&color=black"
~~~

#### FlowRouter.go(pathDef, params, queryParams);

This will get the path via `FlowRouter.path` based on the arguments and re-route to that path.

You can call `FlowRouter.go` like this as well:

~~~js
FlowRouter.go("/blog");
~~~


#### FlowRouter.url(pathDef, params, queryParams)

Just like `FlowRouter.path`, but gives the absolute url. (Uses `Meteor.absoluteUrl` behind the scenes.)

#### FlowRouter.setParams(newParams)

This will change the current params with the newParams and re-route to the new path.

~~~js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

FlowRouter.setParams({appId: "new-id"});
// Then the user will be redirected to the following path
//      /apps/new-id?show=yes&color=red
~~~

#### FlowRouter.setQueryParams(newQueryParams)

Just like `FlowRouter.setParams`, but for queryString params.

To remove a query param set it to `null` like below:

~~~js
FlowRouter.setQueryParams({paramToRemove: null});
~~~

#### FlowRouter.getRouteName()

To get the name of the route reactively.

~~~js
Tracker.autorun(function () {
  var routeName = FlowRouter.getRouteName();
  console.log("Current route name is: ", routeName);
});
~~~

#### FlowRouter.current()

Get the current state of the router. **This API is not reactive**.
If you need to watch the changes in the path simply use `FlowRouter.watchPathChange()`.

This gives an object like this:

~~~js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

var current = FlowRouter.current();
console.log(current);

// prints following object
// {
//     path: "/apps/this-is-my-app?show=yes&color=red",
//     params: {appId: "this-is-my-app"},
//     queryParams: {show: "yes", color: "red"}
//     route: {pathDef: "/apps/:appId", name: "name-of-the-route"}
// }
~~~

#### FlowRouter.watchPathChange()

Reactively watch the changes in the path. If you need to simply get the params or queryParams use dedicated APIs like `FlowRouter.getQueryParam()`.

~~~js
Tracker.autorun(function () {
  FlowRouter.watchPathChange();
  var currentContext = FlowRouter.current();
  // do anything with the current context
  // or anything you wish
});
~~~

#### FlowRouter.withReplaceState(fn)
Normally, all the route changes made via APIs like `FlowRouter.go` and `FlowRouter.setParams()` add a URL item to the browser history. For example, run the following code:

~~~js
FlowRouter.setParams({id: "the-id-1"});
FlowRouter.setParams({id: "the-id-2"});
FlowRouter.setParams({id: "the-id-3"});
~~~

Now you can hit the back button of your browser two times. This is normal behavior since users may click the back button and expect to see the previous state of the app.

But sometimes, this is not something you want. You don't need to pollute the browser history. Then, you can use the following syntax.

~~~js
FlowRouter.withReplaceState(function () {
  FlowRouter.setParams({id: "the-id-1"});
  FlowRouter.setParams({id: "the-id-2"});
  FlowRouter.setParams({id: "the-id-3"});
});
~~~

Now, there is no item in the browser history. Just like `FlowRouter.setParams`, you can use any FlowRouter API inside `FlowRouter.withReplaceState`.

> We named this function as `withReplaceState` because, replaceState is the underline API used for this functionality. Read more about [replace state & the history API](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).

#### FlowRouter.reload()

FlowRouter routes are idempotent. That means, even if you call `FlowRouter.go()` to the same URL multiple times, it only activates in the first run. This is also true for directly clicking on paths.

So, if you really need to reload the route, this is the API you want.

#### FlowRouter.wait() and FlowRouter.initialize()

By default, FlowRouter initializes the routing process in a `Meteor.startup()` callback. This works for most of the apps. But, some apps have custom initializations and FlowRouter needs to initialize after that.

So, that's where `FlowRouter.wait()` comes to save you. You need to call it directly inside your JavaScript file. After that, whenever your app is ready call `FlowRouter.initialize()`.

eg:-

~~~js
// file: app.js
FlowRouter.wait();
WhenEverYourAppIsReady(function () {
  FlowRouter.initialize();
});
~~~

For more information visit [issue #180](https://github.com/meteorhacks/flow-router/issues/180).

#### FlowRouter.onRouteRegister(cb)

This API is specially designed for add-on developers. They can listen for any registered route and add custom functionality to FlowRouter. This works on both server and client alike.

~~~js
FlowRouter.onRouteRegister(function (route) {
  // do anything with the route object
  console.log(route);
});
~~~

Let's say a user defined a route like this:

~~~js
FlowRouter.route('/blog/:post', {
  name: 'postList',
  triggersEnter: [function () {}],
  subscriptions: function () {},
  action: function () {},
  triggersExit: [function () {}],
  customField: 'customName'
});
~~~

Then the route object will be something like this:

~~~js
{
  pathDef: '/blog/:post',
  name: 'postList',
  options: {customField: 'customName'}
}
~~~

So, it's not the internal route object we are using.

## Subscription Management

For Subscription Management, we highly suggest you to follow [Template/Component level subscriptions](https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management). Visit this [guide](https://kadira.io/academy/meteor-routing-guide/content/subscriptions-and-data-management) for that.

FlowRouter also has it's own subscription registration mechanism. We will remove this in version 3.0. We don't remove or deprecate it in version 2.x because this is the easiest way to implement FastRender support for your app. In 3.0 we've better support for FastRender with Server Side Rendering.

FlowRouter only deals with registration of subscriptions. It does not wait until subscription becomes ready. This is how to register a subscription.

~~~js
FlowRouter.route('/blog/:postId', {
    subscriptions: function (params, queryParams) {
        this.register('myPost', Meteor.subscribe('blogPost', params.postId));
    }
});
~~~

We can also register global subscriptions like this:

~~~js
FlowRouter.subscriptions = function () {
  this.register('myCourses', Meteor.subscribe('courses'));
};
~~~

All these global subscriptions run on every route. So, pay special attention to names when registering subscriptions.

After you've registered your subscriptions, you can reactively check for the status of those subscriptions like this:

~~~js
Tracker.autorun(function () {
    console.log("Is myPost ready?:", FlowRouter.subsReady("myPost"));
    console.log("Are all subscriptions ready?:", FlowRouter.subsReady());
});
~~~

So, you can use `FlowRouter.subsReady` inside template helpers to show the loading status and act accordingly.

### FlowRouter.subsReady() with a callback

Sometimes, we need to use `FlowRouter.subsReady()` in places where an autorun is not available. One such example is inside an event handler. For such places, we can use the callback API of `FlowRouter.subsReady()`.

~~~js
Template.myTemplate.events({
   "click #id": function(){
      FlowRouter.subsReady("myPost", function() {
         // do something
      });
  }
});
~~~

> Arunoda has discussed more about Subscription Management in FlowRouter in [this](https://meteorhacks.com/flow-router-and-subscription-management.html#subscription-management) blog post about [FlowRouter and Subscription Management](https://meteorhacks.com/flow-router-and-subscription-management.html).

> He's showing how to build an app like this:

>![FlowRouter's Subscription Management](https://cldup.com/esLzM8cjEL.gif)

#### Fast Render
FlowRouter has built in support for [Fast Render](https://github.com/abecks/meteor-fast-render).

- `meteor add staringatlights:fast-render`
- Put `router.js` in a shared location. We suggest `lib/router.js`.

You can exclude Fast Render support by wrapping the subscription registration in an `isClient` block:

~~~js
FlowRouter.route('/blog/:postId', {
    subscriptions: function (params, queryParams) {
        // using Fast Render
        this.register('myPost', Meteor.subscribe('blogPost', params.postId));

        // not using Fast Render
        if(Meteor.isClient) {
            this.register('data', Meteor.subscribe('bootstrap-data');
        }
    }
});
~~~

#### Subscription Caching

You can also use [Subs Manager](https://github.com/meteorhacks/subs-manager) for caching subscriptions on the client. We haven't done anything special to make it work. It should work as it works with other routers.

## IE9 Support

FlowRouter has IE9 support. But it does not ship the **HTML5 history polyfill** out of the box. That's because most apps do not require it.

If you need to support IE9, add the **HTML5 history polyfill** with the following package.

~~~shell
meteor add tomwasd:history-polyfill
~~~

## Hashbang URLs

To enable hashbang urls like `mydomain.com/#!/mypath` simple set the `hashbang` option to `true` in the initialize function:

~~~js
// file: app.js
FlowRouter.wait();
WhenEverYourAppIsReady(function () {
  FlowRouter.initialize({hashbang: true});
});
~~~

## Prefixed paths

In cases you wish to run multiple web application on the same domain name, you’ll probably want to serve your particular meteor application under a sub-path (eg `example.com/myapp`). In this case simply include the path prefix in the meteor `ROOT_URL` environment variable and FlowRouter will handle it transparently without any additional configuration.

## Add-ons

Router is a base package for an app. Other projects like [useraccounts](http://useraccounts.meteor.com/)  should have support for FlowRouter. Otherwise, it's hard to use  FlowRouter in a real project. Now a lot of packages have [started to support FlowRouter](https://kadira.io/blog/meteor/addon-packages-for-flowrouter).

So, you can use your your favorite package with FlowRouter as well. If not, there is an [easy process](https://kadira.io/blog/meteor/addon-packages-for-flowrouter#what-if-project-xxx-still-doesn-t-support-flowrouter-) to convert them to FlowRouter.

**Add-on API**

We have also released a [new API](https://github.com/kadirahq/flow-router#flowrouteronrouteregistercb) to support add-on developers. With that add-on packages can get a notification, when the user created a route in their app.

If you've more ideas for the add-on API, [let us know](https://github.com/kadirahq/flow-router/issues).

## Difference with Iron Router

FlowRouter and Iron Router are two different routers. Iron Router tries to be a full featured solution. It tries to do everything including routing, subscriptions, rendering and layout management.

FlowRouter is a minimalistic solution focused on routing with UI performance in mind. It exposes APIs for related functionality.

Let's learn more about the differences:

### Rendering

FlowRouter doesn't handle rendering. By decoupling rendering from the router it's possible to use any rendering framework, such as [Blaze Layout](https://github.com/kadirahq/blaze-layout) to render with Blaze's Dynamic Templates. Rendering calls are made in the the route's action. We have a layout manager for [React](https://github.com/kadirahq/meteor-react-layout) as well.

### Subscriptions

With FlowRouter, we highly suggest using template/component layer subscriptions. But, if you need to do routing in the router layer, FlowRouter has [subscription registration](#subscription-management) mechanism. Even with that, FlowRouter never waits for the subscriptions and view layer to do it.

### Reactive Content

In Iron Router you can use reactive content inside the router, but any hook or method can re-run in an unpredictable manner. FlowRouter limits reactive data sources to a single run; when it is first called.

We think that's the way to go. Router is just a user action. We can work with reactive content in the rendering layer.

### router.current() is evil

`Router.current()` is evil. Why? Let's look at following example. Imagine we have a route like this in our app:

~~~
/apps/:appId/:section
~~~

Now let's say, we need to get `appId` from the URL. Then we will do, something like this in Iron Router.

~~~js
Templates['foo'].helpers({
    "someData": function () {
        var appId = Router.current().params.appId;
        return doSomething(appId);
    }
});
~~~

Let's say we changed `:section` in the route. Then the above helper also gets rerun. If we add a query param to the URL, it gets rerun. That's because `Router.current()` looks for changes in the route(or URL). But in any of above cases, `appId` didn't get changed.

Because of this, a lot parts of our app get re-run and re-rendered. This creates unpredictable rendering behavior in our app.

FlowRouter fixes this issue by providing the `Router.getParam()` API. See how to use it:

~~~js
Templates['foo'].helpers({
    "someData": function () {
        var appId = FlowRouter.getParam('appId');
        return doSomething(appId);
    }
});
~~~

### No data context

FlowRouter does not have a data context. Data context has the same problem as reactive `.current()`. We believe, it'll possible to get data directly in the template (component) layer.

### Built in Fast Render Support

FlowRouter has built in [Fast Render](https://github.com/abecks/meteor-fast-render) support. Just add Fast Render to your app and it'll work. Nothing to change in the router.

For more information check [docs](#fast-render).

### Server Side Routing

FlowRouter is a client side router and it **does not** support server side routing at all. But `subscriptions` run on the server to enable Fast Render support.

#### Reason behind that

Meteor is not a traditional framework where you can send HTML directly from the server. Meteor needs to send a special set of HTML to the client initially. So, you can't directly send something to the client yourself.

Also, in the server we need look for different things compared with the client. For example:

* In the server we have to deal with headers.
* In the server we have to deal with methods like `GET`, `POST`, etc.
* In the server we have Cookies.

So, it's better to use a dedicated server-side router like [`meteorhacks:picker`](https://github.com/meteorhacks/picker). It supports connect and express middlewares and has a very easy to use route syntax.

### Server Side Rendering

FlowRouter 3.0 will have server side rendering support. We've already started the initial version and check our [`ssr`](https://github.com/meteorhacks/flow-router/tree/ssr) branch for that.

It's currently very usable and Kadira already using it for <https://kadira.io>

### Better Initial Loading Support

In Meteor, we have to wait until all the JS and other resources send before rendering anything. This is an issue. In 3.0, with the support from Server Side Rendering we are going to fix it.

## Migrating into 2.0

Migrating into version 2.0 is easy and you don't need to change any application code since you are already using 2.0 features and the APIs. In 2.0, we've changed names and removed some deprecated APIs.

Here are the steps to migrate your app into 2.0.

#### Use the New FlowRouter Package
* Now FlowRouter comes as `kadira:flow-router`
* So, remove `meteorhacks:flow-router` with : `meteor remove meteorhacks:flow-router`
* Then, add `kadira:flow-router` with `meteor add kadira:flow-router`

#### Change FlowLayout into BlazeLayout
* We've also renamed FlowLayout as [BlazeLayout](https://github.com/kadirahq/blaze-layout).
* So, remove `meteorhacks:flow-layout` and add `kadira:blaze-layout` instead.
* You need to use `BlazeLayout.render()` instead of `FlowLayout.render()`

#### Stop using deprecated Apis
* There is no middleware support. Use triggers instead.
* There is no API called `.reactiveCurrent()`, use `.watchPathChange()` instead.
* Earlier, you can access query params with `FlowRouter.current().params.query`. But, now you can't do that. Use `FlowRouter.current().queryParams` instead.
