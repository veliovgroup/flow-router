FlowRouter Extra
======

Carefully extended [flow-router](https://github.com/kadirahq/flow-router) package.

Unfortunately FlowRouter has very close API, so there is no way to extend it without digging into the core, and creating separate package, sorry for this.

## Installation
```shell
meteor add ostrio:flow-router-extra
```

## TOC
FlowRouter Extra:
* [waitOn hook](https://github.com/VeliovGroup/flow-router#waiton-hook) - Wait for all subscriptions is ready
* [whileWaiting hook](https://github.com/VeliovGroup/flow-router#whilewaiting-hook) - Do something while waiting for subscriptions
* [data hook](https://github.com/VeliovGroup/flow-router#data-hook) - Fetch data from collection before render router's template
* [onNoData hook](https://github.com/VeliovGroup/flow-router#onnodata-hook) - Do something if "*data hook*" returns falsy value
* [Data in other hooks](https://github.com/VeliovGroup/flow-router#data-in-other-hooks) - Use fetched data in other hooks
* [Suggested usage](https://github.com/VeliovGroup/flow-router#suggested-usage) - Bootstrap router's configuration
* [Other packages compatibility](https://github.com/VeliovGroup/flow-router#other-packages-compatibility) - Best packages to be used with flow-router-extra

Original FlowRouter's documentation:
* [Meteor Routing Guide](#meteor-routing-guide)
* [Getting Started](#getting-started)
* [Routes Definition](#routes-definition)
* [Group Routes](#group-routes)
* [Rendering and Layout Management](#rendering-and-layout-management)
* [Triggers](#triggers)
* [Not Found Routes](#not-found-routes)
* [API](#api)
* [Subscription Management](#subscription-management)
* [IE9 Support](#ie9-support)
* [Hashbang URLs](#hashbang-urls)
* [Prefixed paths](#prefixed-paths)
* [Add-ons](#add-ons)
* [Difference with Iron Router](#difference-with-iron-router)
* [Migrating into 2.0](#migrating-into-20)


## FlowRouter Extra:
### waitOn hook
`waitOn` hook is *Function* passed as property into route configuration object. It is called with two arguments `params` and `queryParams`, same as `action`. Works like a charm with both original Meteor's [`Meteor.subscribe`](http://docs.meteor.com/#/full/meteor_subscribe) and [`subs-manager` package](https://github.com/kadirahq/subs-manager). Function __must__ return array of subscription handlers.
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn: function (params, queryParams) {
    return [subsManager.subscribe('post', params._id), Meteor.subscribe('suggestedPosts', params._id)];
  }
});
```

### whileWaiting hook
`whileWaiting` hook is capable for time between user hits your page and all subscriptions from `waitOn` hook is ready. It is called with two arguments `params` and `queryParams`, same as `action`. Let's render `_loading` template in it. This hook also follows main `flow-router` ideology - loading hook not depend from layout or anything else. You may run any JavaScript code inside this hook, it is not limited to loading template.
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn: function (params) {
    return [Meteor.subscribe('post', params._id)];
  },
  whileWaiting: function (params, queryParams) {
    BlazeLayout.render('_layout', {content: '_loading'});
  }
});
```

### data hook
`data` hook is capable for time after `waitOn` hook is ready and `action` is begin run. It is called with two arguments `params` and `queryParams`, same as `action`. This hook must return *Object*, *Mongo.Cursor* (or array of it) or falsy value.
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn: function (params) {
    return [Meteor.subscribe('post', params._id)];
  },
  whileWaiting: function () {
    BlazeLayout.render('_layout', {content: '_loading'});
  },
  data: function (params, queryParams) {
    return PostsCollection.findOne({_id: params._id});
  }
});
```

When you having `data` hook in a route, - returned data will be passed to `action` as third argument. So you can pass fetched data into template:
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  action: function (params, queryParams, data) {
    BlazeLayout.render('_layout', {content: 'post', post: data});
  },
  waitOn: function (params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data: function (params, queryParams) {
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
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn: function (params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data: function (params) {
    return PostsCollection.findOne({_id: params._id});
  },
  onNoData: function (params, queryParams){
    BlazeLayout.render('_layout', {content: '_404'});
  }
});
```

### Data in other hooks
Returned data from `data` hook, will be also passed into all `triggersEnter` hooks as fourth argument.
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  waitOn: function (params) {
    return [Meteor.subscribe('post', params._id)];
  },
  data: function (params) {
    return PostsCollection.findOne({_id: params._id});
  },
  triggersEnter: [function (context, redirect, stop, data){
    console.log(data);
  }]
});
```

### Suggested usage
As example we took simple post route:
```javascript
FlowRouter.route('/post/:_id', {
  name: 'post',
  action: function (params, queryParams, data) {
    // Pass data to template's context
    // No need to create helpers
    BlazeLayout.render('_layout', {content: 'post', post: data});
  },
  waitOn: function (params) {
    // meteorhacks:subs-manager package
    return [subsManager.subscribe('post', params._id)];
  },
  data: function (params) {
    return PostsCollection.findOne({_id: params._id});
  },
  onNoData: function (){
    BlazeLayout.render('_layout', {content: '_404'});
  },
  // ostrio:flow-router-title package
  title: function (params, queryParams, post) {
    return (post) ? post.title : '404: Page not found';
  }
});

FlowRouter.notFound = {
  title: '404: Page not found',
  action: function () {
    BlazeLayout.render('_layout', {content: '_404'});
  }
};

// jazeee:spiderable-longer-timeout package
FlowRouter.triggers.enter([function () {
  Meteor.isReadyForSpiderable = true;
}]);

// meteorhacks:fast-render package
FastRender.route('/post/:_id', function (params) {
  this.subscribe('post', params._id);
});
```

```html
<!-- in template -->
<template name="post">
  <h1>{{post.title}}</h1>
  <p>{{post.text}}</p>
</template>
```

### Other packages compatibility
This package tested and recommended to use with next packages:
 - [kadira:blaze-layout](https://github.com/kadirahq/blaze-layout) - Render layout template and pass data to UI
 - [meteorhacks:subs-manager](https://github.com/kadirahq/subs-manager) - Manage subscriptions with caching
 - [meteorhacks:fast-render](https://github.com/kadirahq/fast-render) - Pre-fetch collection's data on server-side
 - [jazeee:spiderable](https://github.com/jazeee/jazeee-meteor-spiderable) - Making your pages accessible for crawlers
 - [ostrio:flow-router-title](https://github.com/VeliovGroup/Meteor-flow-router-title) - Reactive page title (`document.title`)
 - [ostrio:flow-router-meta](https://github.com/VeliovGroup/Meteor-flow-router-meta) - Reactive `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
 - [appcache](https://github.com/meteor/meteor/wiki/AppCache) - Making your application available offline


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
FlowRouter has built in support for [Fast Render](https://github.com/meteorhacks/fast-render).

- `meteor add meteorhacks:fast-render`
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

FlowRouter has built in [Fast Render](https://github.com/meteorhacks/fast-render) support. Just add Fast Render to your app and it'll work. Nothing to change in the router.

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
