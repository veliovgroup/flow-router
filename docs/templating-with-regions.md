### Templating with "Regions"

 - __Note__: Blaze templating is available only if application has `templating` and `blaze`, or `blaze-html-templates` packages installed.

#### Create layout
```handlebars
<!-- /imports/client/layout/layout.html -->
<template name="layout">
  <aside>
    <nav>
      {{> Template.dynamic template=sidebar }}
    </nav>
  </aside>

  <main>
    {{> yield}}
  </main>

  <footer>
    {{> Template.dynamic template=footer }}
  </footer>
</template>
```

```js
// /imports/client/layout/layout.js
import { Template } from 'meteor/templating';
import './layout.html';
/* ... */
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
/* ... */
```

#### Create sidebar template
```handlebars
<!-- /imports/client/sidebar/sidebar.html -->
<template name="sidebar">
  <ul>
    <li><a href="#">Link 1</a></li>
    <li><a href="#">Link 2</a></li>
    <li><a href="#">Link 3</a></li>
  </ul>
</template>
```

#### Create footer template
```handlebars
<!-- /imports/client/footer/footer.html -->
<template name="footer">
  Copyright Awesome Inc. © 2017
</template>
```

#### Create index route
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// Import layout template statically as it will be used a lot
import '/imports/client/layout/layout.js';

// Create index route
FlowRouter.route('/', {
  name: 'index',
  waitOn() {
    return [
      import('/imports/client/index/index.js'),
      import('/imports/client/sidebar/sidebar.html'),
      import('/imports/client/footer/footer.html')
    ];
  },
  action() {
    this.render('layout', 'index', {
      sidebar: 'sidebar',
      footer: 'footer'
    });
  }
});
```

#### Further Reading
 - [`.action()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/action.md)
 - [`.waitOn()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOn.md)
 - [`.render()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/render.md)
 - [Templating with Data](https://github.com/veliovgroup/flow-router/blob/master/docs/templating-with-data.md)
