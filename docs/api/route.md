### route method

```js
FlowRouter.route(path, options);
```

- `path` {*String*} - Path with placeholders
- `options` {*Object*}
- `options.name` {*String*} - Route's name
- `options[prop-name]` {*Any*} - [Optional] Any property which will be available inside route call
- `options[hook-name]` {*Function*} - [Optional] See [all available hooks](https://github.com/veliovgroup/flow-router/tree/master/docs#hooks-in-execution-order)
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

#### Further reading

- [`.path()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/path.md)
