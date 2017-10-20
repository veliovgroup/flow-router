### Templating with Data

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
/* ... */
```

#### Create notFound (404) template
```handlebars
<!-- /imports/client/notFound/notFound.html -->
<template name="notFound">
  <h1>404</h1>
  <p>No such page.</p>
</template>
```

#### Create article template
```handlebars
<!-- /imports/client/article/article.html -->
<template name="article">
  <h1>Hello World!</h1>
  <p>This is index template.</p>
</template>
```

```js
// /imports/client/article/article.js
import { Template } from 'meteor/templating';
import './article.html';
/* ... */
```

#### Create loading template
```handlebars
<!-- /imports/client/loading/loading.html -->
<template name="index">
  Loading...
</template>
```

#### Create article route
 1. Create article route
 2. Using `waitOn` hook wait for template and subscription to be ready
 3. Using `action` hook to render article template into layout 
 4. Using `data` hook fetch data from Collection
 5. If article doesn't exists (*bad* `_id` *is provided*) - render 404 template using `onNoData` hook

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// Import layout, loading and notFound templates statically as it will be used a lot
import '/imports/client/layout/layout.js';
import '/imports/client/loading/loading.html';
import '/imports/client/notFound/notFound.html';

// Create article route
FlowRouter.route('/article/:_id', {
  name: 'article',
  waitOn(params) {
    return [
      import('/imports/client/article/article.js'),
      Meteor.subscribe('article', params._id)
    ];
  },
  whileWaiting() {
    this.render('layout', 'loading');
  },
  action(params, qs, article) {
    this.render('layout', 'article', { article });
  },
  data(params) {
    return ArticlesCollection.findOne({ _id: params._id });
  },
  onNoData() {
    this.render('notFound');
  }
});
```

#### Further Reading
 - [`.action()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/action.md)
 - [`.data()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/data.md)
 - [`.onNoData()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/onNoData.md)
 - [`.waitOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOn.md)
 - [`.whileWaiting()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/whileWaiting.md)
 - [`.render()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/render.md)
 - [Templating with "Regions"](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-regions.md)
