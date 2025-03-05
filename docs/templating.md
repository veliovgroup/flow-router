### Templating

> [!NOTE]
> Blaze templating is available only if application has `templating` and `blaze`, or `blaze-html-templates` packages installed

#### Create layout

```handlebars
<!-- /imports/client/layout/layout.html -->
<template name="layout">
  <aside>
    <nav>
      <!-- sidebar -->
    </nav>
  </aside>

  <main>
    {{> yield}}
  </main>

  <footer>
    <!-- page footer -->
  </footer>
</template>
```

```js
// /imports/client/layout/layout.js
import { Template } from 'meteor/templating';
import './layout.html';

// As example all available Template's callbacks
// layout should be considered as a regular template
Template.layout.onCreated(function () { /* ... */ });
Template.layout.onRendered(function () { /* ... */ });
Template.layout.onDestroyed(function () { /* ... */ });
Template.layout.helpers({ /* ... */ });
Template.layout.events({ /* ... */ });
```

#### Create index template

```handlebars
<!-- /imports/client/index/index.html -->
<template name="index">
  <h1>Hello World!</h1>
  <p>This is index template.</p>
</template>
```

```js
// /imports/client/index/index.js
import { Template } from 'meteor/templating';
import './index.html';

// As example all available Template's callbacks
Template.index.onCreated(function () { /* ... */ });
Template.index.onRendered(function () { /* ... */ });
Template.index.onDestroyed(function () { /* ... */ });
Template.index.helpers({ /* ... */ });
Template.index.events({ /* ... */ });
```

#### Create loading template

```handlebars
<!-- /imports/client/loading/loading.html -->
<template name="loading">
  Loading...
</template>
```

#### Create index route

1. Create index route
2. Using `waitOn` hook wait for template to load from server
3. Using `action` hook to render template into layout

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// Import layout and loading templates statically as it will be used a lot
import '/imports/client/layout/layout.js';
import '/imports/client/loading/loading.html';

// Create index route
FlowRouter.route('/', {
  name: 'index',
  waitOn() {
    return import('/imports/client/index/index.js');
  },
  whileWaiting() {
    this.render('layout', 'loading');
  },
  action() {
    this.render('layout', 'index');
  }
});
```

#### Force template re-rendering

*Introduced in `v3.7.1`*

By default if same template is rendered when user navigates to a different route, including parameters or query-string change/update rendering engine will smoothly __only update__ template's data. In case if you wish to force full template rendering executing all hooks and callbacks use `{ conf: { forceReRender: true } }`, like:

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '/imports/client/layout/layout.js';

FlowRouter.route('/item/:_id', {
  name: 'item',
  conf: {
    // without this option template won't be re-rendered
    // upon navigation between different "item" routes
    // e.g. when navigating from `/item/1` to `/item/2`
    forceReRender: true
  },
  waitOn() {
    return import('/imports/client/item/item.js');
  },
  action(params) {
    this.render('layout', 'item', params);
  }
});
```

#### Further Reading

- [`.action()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/action.md)
- [`.waitOn()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOn.md)
- [`.whileWaiting()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/whileWaiting.md)
- [`.render()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/render.md)
- [Templating with "Regions"](https://github.com/veliovgroup/flow-router/blob/master/docs/templating-with-regions.md)
