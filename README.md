[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=FVDSXRFW9VGA2)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/flow-router/Lobby)
[![GitHub issues](https://img.shields.io/github/issues/VeliovGroup/flow-router.svg)](https://github.com/VeliovGroup/flow-router/issues)
[![GitHub forks](https://img.shields.io/github/forks/VeliovGroup/flow-router.svg)](https://github.com/VeliovGroup/flow-router/network)
[![GitHub stars](https://img.shields.io/github/stars/VeliovGroup/flow-router.svg)](https://github.com/VeliovGroup/flow-router/stargazers)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/VeliovGroup/flow-router.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2FVeliovGroup%2Fflow-router)

FlowRouter Extra
======
Carefully extended [flow-router](https://github.com/kadirahq/flow-router) package.

#### Features:
 - Great [tests coverage](https://github.com/VeliovGroup/flow-router/tree/master/test);
 - Up-to-date [dependencies](https://github.com/VeliovGroup/flow-router/blob/master/package.js);
 - Following semver with regular [releases](https://github.com/VeliovGroup/flow-router/releases);
 - Great [wiki](https://github.com/VeliovGroup/flow-router/wiki);
 - Great [quick start tutorial](https://github.com/VeliovGroup/flow-router/blob/master/docs/quick-start.md).

#### Install
```shell
meteor add ostrio:flow-router-extra
```

#### ES6 Import
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
```

#### Use
```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/', {
  name: 'index',
  action() {
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

#### Documentation
 - Continue with our [wiki](https://github.com/VeliovGroup/flow-router/wiki);
 - [Quick start](https://github.com/VeliovGroup/flow-router/blob/master/docs/quick-start.md) tutorial
 - All docs as [single document](https://github.com/VeliovGroup/flow-router/blob/master/docs/full.md)
