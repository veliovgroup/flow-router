### Flow-Router Extra Quick Start

#### Install
```shell
# Remove original FlowRouter
meteor remove kadira:flow-router

# Install FR-Extra
meteor add ostrio:flow-router-extra
```

#### ES6 Import
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
```

#### Create your fist route
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Create index route
FlowRouter.route('/', {
  name: 'index',
  action() {
    // Do something here
    // After route is followed
  }
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page
  }
});
```

#### Further reading
 - [Templating]()
