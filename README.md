[![support](https://img.shields.io/badge/support-GitHub-white)](https://github.com/sponsors/dr-dimitru)
[![support](https://img.shields.io/badge/support-PayPal-white)](https://paypal.me/veliovgroup)
<a href="https://ostr.io/info/built-by-developers-for-developers?ref=github-flowrouter-repo-top"><img src="https://ostr.io/apple-touch-icon-60x60.png" height="20"></a>
<a href="https://meteor-files.com/?ref=github-flowrouter-repo-top"><img src="https://meteor-files.com/apple-touch-icon-60x60.png" height="20"></a>

# FlowRouter Extra

Carefully extended `flow-router` package. FlowRouter is a very simple router for [Meteor.js](https://docs.meteor.com/?utm_source=dr.dimitru&utm_medium=online&utm_campaign=Q2-2022-Ambassadors). It does routing for client-side apps and compatible with React, Vue, Svelte, and Blaze.

It exposes a great API for changing the URL and getting data from the URL. However, inside the router, it's not reactive. Most importantly, FlowRouter is designed with performance in mind and it focuses on what it does best: __routing__.

## Features:

- 📦 Not dependent on Blaze, ready for [__React.js__](https://github.com/veliovgroup/flow-router/blob/master/docs/react.md) and other templating/components engines/libs;
- 📦 No `underscore` package dependency;
- 👨‍💻 TypeScript definition [`index.d.ts`](https://github.com/veliovgroup/flow-router/blob/master/index.d.ts)
- 👨‍🔬 Great [tests coverage](https://github.com/veliovgroup/flow-router/tree/master/test);
- 🥑 Up-to-date [dependencies](https://github.com/veliovgroup/flow-router/blob/master/package.js);
- 📦 Support of [Fast Render](https://github.com/veliovgroup/flow-router/blob/master/docs/fast-render-integration.md) and [other great packages](https://github.com/veliovgroup/flow-router#related-packages);
- 📋 Following semver with regular [releases](https://github.com/veliovgroup/flow-router/releases);
- 📋 Great [wiki](https://github.com/veliovgroup/flow-router/wiki);
- 📋 Great [quick start tutorial](https://github.com/veliovgroup/flow-router/blob/master/docs/quick-start.md).

## Install

```shell
meteor add ostrio:flow-router-extra
```

### Compatibility

- Meteor `>=1.4`, including latest Meteor `3.4`;
- Compatible with `ostrio:flow-router-title@3.5.0` and `ostrio:flow-router-meta@2.4.0`.

### ES6 Import

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
// Full list of available classes and instances:
// { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer, RouterHelpers }
```

### Usage

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// DISABLE QUERY STRING COMPATIBILITY
// WITH OLDER FlowRouter AND Meteor RELEASES
FlowRouter.decodeQueryParamsOnce = true;

FlowRouter.route('/', {
  name: 'index',
  action() {
    // Render a template using Blaze
    this.render('layoutName', 'index');

    // Can be used with BlazeLayout,
    // and ReactLayout for React-based apps
  },
  waitOn() {
    // Dynamically load JS per route
    return [import('/imports/client/index.js')];
  }
});

// Create 404 route (catch-all)
FlowRouter.route('*', {
  action() {
    // Show 404 error page using Blaze
    this.render('notFound');

    // Can be used with BlazeLayout,
    // and ReactLayout for React-based apps
  }
});
```

> [!TIP]
> TypeScript: add [`zodern:types`](https://github.com/zodern/meteor-types) to the app (`meteor add zodern:types`), enable TypeScript per [Meteor docs](https://docs.meteor.com/guide/typescript.html), then run a build so `.meteor/local/types` is generated. This package ships [`index.d.ts`](https://github.com/veliovgroup/flow-router/blob/master/index.d.ts) and [`package-types.json`](https://github.com/veliovgroup/flow-router/blob/master/package-types.json) for `meteor/ostrio:flow-router-extra` imports.

## Documentation

- Continue with our [wiki](https://github.com/veliovgroup/flow-router/wiki) or [README index](https://github.com/veliovgroup/flow-router/blob/master/docs/README.md);
- [Quick start](https://github.com/veliovgroup/flow-router/blob/master/docs/quick-start.md) tutorial;
- All docs as [single document](https://github.com/veliovgroup/flow-router/blob/master/docs/full.md).

### AGENTS.md

The repo ships [`AGENTS.md`](https://github.com/veliovgroup/flow-router/blob/master/AGENTS.md): a compact **implementation map** for `ostrio:flow-router-extra` (routes, groups, catch-all, hooks, globals, `RouterHelpers`, debugging, testing). It complements narrative API docs under `docs/` with file pointers and conventions maintainers rely on.

### SKILLS.md

- This repo ships a bundled skill at **`.agents/skills/meteor-flow-router/SKILL.md`** (covers **`ostrio:flow-router-extra`**, **`ostrio:flow-router-meta`**, **`ostrio:flow-router-title`**). Install into your project with the [Skills CLI](https://www.npmjs.com/package/skills) (`npx skills`):

```bash
# From a Meteor app repo (install into that app’s .agents/skills for Cursor, etc.)
npx skills add veliovgroup/flow-router --skill meteor-flow-router --agent cursor --yes

# Only list skills discovered in the Flow Router repo (no install)
npx skills add veliovgroup/flow-router --list

# Local clone of flow-router (path can be absolute or ./relative)
npx skills add ./flow-router --skill meteor-flow-router --agent cursor --yes

# User-global Cursor skills dir (~/.cursor/skills)
npx skills add veliovgroup/flow-router --skill meteor-flow-router --agent cursor --global --yes
```

### Related packages:

- [`ostrio:flow-router-title`](https://github.com/veliovgroup/Meteor-flow-router-title) - Reactive page title (`document.title`)
- [`ostrio:flow-router-meta`](https://github.com/veliovgroup/Meteor-flow-router-meta) - Per route `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
- [`communitypackages:fast-render`](https://github.com/Meteor-Community-Packages/meteor-fast-render) - Fast Render can improve the initial load time of your app, giving you 2-10 times faster initial page loads. [`fast-render` integration tutorial](https://github.com/veliovgroup/flow-router/blob/master/docs/fast-render-integration.md)
- [`communitypackages:inject-data`](https://github.com/Meteor-Community-Packages/meteor-inject-data) - This is the package used by `fast-render` to push data to the client with the initial HTML
- [`flean:flow-router-autoscroll`](https://github.com/flean/flow-router-autoscroll) - Autoscroll for Flow Router
- [`mealsunite:flow-routing-extra`](https://github.com/MealsUnite/flow-routing) - Add-on for User Accounts
- [`nxcong:flow-routing`](https://github.com/cafe4it/flow-routing) - Add-on for User Accounts (alternative)
- [`forwarder:autoform-wizard-flow-router-extra`](https://atmospherejs.com/forwarder/autoform-wizard-flow-router-extra) - Flow Router bindings for AutoForm Wizard
- [`nicolaslopezj:router-layer`](https://github.com/nicolaslopezj/meteor-router-layer) - Helps package authors to support multiple routers
- [`krishaamer:flow-router-breadcrumb`](https://github.com/krishaamer/flow-router-breadcrumb) - Easy way to add a breadcrumb with enough flexibility to your project (`flow-router-extra` edition)
- [`krishaamer:body-class`](https://github.com/krishaamer/body-class) - Easily scope CSS by automatically adding the current template and layout names as classes on the body element

## Running Tests

1. Clone this package
2. In Terminal (*Console*) go to directory where package is cloned
3. Then run:

### Meteor/Tinytest

```shell
# Default
meteor test-packages ./

# With custom port
meteor test-packages ./ --port 8888

# With local MongoDB and custom port
MONGO_URL="mongodb://127.0.0.1:27017/flow-router-tests" meteor test-packages ./ --port 8888
```

### Running Typescript Test

1. Install [`tsd`](https://github.com/SamVerschueren/tsd) as a global package;
2. Run `tsd` in your terminal. `tsd` will find the correct `*.test.d.ts` file and return with any errors.

## Support this project:

- Upload and share files using [☄️ meteor-files.com](https://meteor-files.com/?ref=github-flowrouter-repo-footer) — Continue interrupted file uploads without losing any progress. There is nothing that will stop Meteor from delivering your file to the desired destination
- Use [▲ ostr.io](https://ostr.io?ref=github-flowrouter-repo-footer) for [Server Monitoring](https://snmp-monitoring.com), [Web Analytics](https://ostr.io/info/web-analytics?ref=github-flowrouter-repo-footer), [WebSec](https://domain-protection.info), [Web-CRON](https://web-cron.info) and [SEO Pre-rendering](https://prerendering.com) of a website
- Star on [GitHub](https://github.com/veliovgroup/flow-router)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/flow-router-extra)
- [Sponsor via GitHub](https://github.com/sponsors/dr-dimitru)
- [Support via PayPal](https://paypal.me/veliovgroup)
