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

#### Further reading
 - [`.go()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/go.md)
 - [`.route()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/route.md)
 - [`.group()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/group.md)
