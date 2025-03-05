### Templating with Data

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
  <h1>{{article.title}}</h1>
  <p>{{article.headline}}</p>

  {{{article.text}}}
</template>
```

#### Create loading template

```handlebars
<!-- /imports/client/loading/loading.html -->
<template name="loading">
  Loading...
</template>
```

#### Create article route

1. Create article route
2. Using `waitOn` hook wait for template and methods/subscription to be ready
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
      import('/imports/client/article/article.html'),
      Meteor.subscribe('article', params._id) // OMIT IF METHOD IS USED TO FETCH ARTICLE
    ];
  },
  whileWaiting() {
    this.render('layout', 'loading');
  },
  action(params, qs, article) {
    this.render('layout', 'article', { article });
  },
  async data(params) {
    // USE SUBSCRIPTION:
    return await ArticlesCollection.findOneAsync({ _id: params._id });
    // OR USE METHOD
    return await Meteor.callAsync('article.get', params._id);
  },
  onNoData() {
    this.render('notFound');
  }
});
```

#### Further Reading

- [`.action()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/action.md)
- [`.data()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md)
- [`.onNoData()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/onNoData.md)
- [`.waitOn()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOn.md)
- [`.whileWaiting()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/whileWaiting.md)
- [`.render()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/render.md)
- [Templating with "Regions"](https://github.com/veliovgroup/flow-router/blob/master/docs/templating-with-regions.md)
