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
 - Not dependent on Blaze, ready for [React](https://github.com/VeliovGroup/flow-router/issues?utf8=✓&q=is%3Aissue+label%3Areact+) and other templating/components engines/libs;
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
    // Render a template using Blaze
    this.render('templateName');
  }
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page using Blaze
    this.render('notFound');
  }
});
```

#### Documentation
 - Continue with our [wiki](https://github.com/VeliovGroup/flow-router/wiki);
 - [Quick start](https://github.com/VeliovGroup/flow-router/blob/master/docs/quick-start.md) tutorial;
 - All docs as [single document](https://github.com/VeliovGroup/flow-router/blob/master/docs/full.md).

#### Related packages:
 - [ostrio:flow-router-title](https://github.com/VeliovGroup/Meteor-flow-router-title) - Reactive page title (`document.title`)
 - [ostrio:flow-router-meta](https://github.com/VeliovGroup/Meteor-flow-router-meta) - Per route `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
 - [flean:flow-router-autoscroll](https://github.com/flean/flow-router-autoscroll) - Autoscroll for Flow Router
 - [mealsunite:flow-routing-extra](https://github.com/MealsUnite/flow-routing) - Add-on for User Accounts
 - [nxcong:flow-routing](https://github.com/cafe4it/flow-routing) - Add-on for User Accounts (alternative)
 - [forwarder:autoform-wizard-flow-router-extra](https://atmospherejs.com/forwarder/autoform-wizard-flow-router-extra) - Flow Router bindings for AutoForm Wizard
 - [nicolaslopezj:router-layer](https://github.com/nicolaslopezj/meteor-router-layer) - Helps package authors to support multiple routers

### Support this project:
This project wouldn't be possible without [ostr.io](https://ostr.io).

Using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one could be available for free.
