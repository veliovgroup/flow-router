# Flow-Router Extra Docs Index

## General tutorials:

- [Quick Start](https://github.com/VeliovGroup/flow-router/blob/master/docs/quick-start.md)
- [Templating](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating.md)
- [Templating with "Regions"](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-regions.md)
- [Templating with Data](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-data.md)
- [Auto-scroll](https://github.com/VeliovGroup/flow-router/blob/master/docs/auto-scroll.md)

## Hooks (*in execution order*):

- [`.whileWaiting()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/whileWaiting.md)
- [`.waitOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOn.md)
- [`.waitOnResources()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOnResources.md)
- [`.endWaiting()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/endWaiting.md)
- [`.data()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/data.md)
- [`.onNoData()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/onNoData.md)
- [`.triggersEnter()` hooks](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
- [`.action()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/action.md)
- [`.triggersExit()` hooks](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/triggersExit.md)

## Helpers:

- [`isActiveRoute` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/isActiveRoute.md)
- [`isActivePath` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/isActivePath.md)
- [`isNotActiveRoute` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/isNotActiveRoute.md)
- [`isNotActivePath` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/isNotActivePath.md)
- [`pathFor` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/pathFor.md)
- [`urlFor` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/urlFor.md)
- [`linkTo` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/linkTo.md)
- [`param` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/param.md)
- [`queryParam` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/queryParam.md)
- [`currentRouteName` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/currentRouteName.md)
- [`currentRouteOption` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/currentRouteOption.md)
- [`isActiveRoute` template helper](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/isActiveRoute.md)
- [`RouterHelpers` class](https://github.com/VeliovGroup/flow-router/blob/master/docs/helpers/RouterHelpers.md)
- [`templatehelpers` package](https://github.com/VeliovGroup/Meteor-Template-helpers)

## API:

- __General Methods:__
  - [`.go()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/go.md)
  - [`.route()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/route.md)
  - [`.group()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/group.md)
  - [`.render()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/render.md)
  - [Global `.triggers`](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/triggers.md)
- __Workarounds:__
  - [`.refresh()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/refresh.md)
  - [`.reload()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/reload.md)
  - [`.pathRegExp` option](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/pathRegExp.md)
- __Manipulation:__
  - [`.getParam()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getParam.md)
  - [`.getQueryParam()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getQueryParam.md)
  - [`.setParams()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/setParams.md)
  - [`.setQueryParams()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/setQueryParams.md)
- __URLs and data:__
  - [`.url()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/url.md)
  - [`.path()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/path.md)
  - [`.current()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/current.md)
  - [`.getRouteName()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/getRouteName.md)
- __Reactivity:__
  - [`.watchPathChange()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/watchPathChange.md)
  - [`.withReplaceState()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/withReplaceState.md)
- __For add-on developers:__
  - [`.onRouteRegister()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/onRouteRegister.md)
- __Tweaking:__
  - [`.wait()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/wait.md)
  - [`.initialize()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/initialize.md)

## Related packages:

- [ostrio:flow-router-title](https://github.com/VeliovGroup/Meteor-flow-router-title) - Reactive page title (`document.title`)
- [ostrio:flow-router-meta](https://github.com/VeliovGroup/Meteor-flow-router-meta) - Per route `meta` tags, `script` and `link` (CSS), set per-route stylesheets and scripts
- [staringatlights:fast-render](https://github.com/abecks/meteor-fast-render) - Fast Render can improve the initial load time of your app, giving you 2-10 times faster initial page loads.
- [flean:flow-router-autoscroll](https://github.com/flean/flow-router-autoscroll) - Autoscroll for Flow Router
- [mealsunite:flow-routing-extra](https://github.com/MealsUnite/flow-routing) - Add-on for User Accounts
- [nxcong:flow-routing](https://github.com/cafe4it/flow-routing) - Add-on for User Accounts (alternative)
- [forwarder:autoform-wizard-flow-router-extra](https://atmospherejs.com/forwarder/autoform-wizard-flow-router-extra) - Flow Router bindings for AutoForm Wizard
- [nicolaslopezj:router-layer](https://github.com/nicolaslopezj/meteor-router-layer) - Helps package authors to support multiple routers
- [krishaamer:flow-router-breadcrumb](https://github.com/krishaamer/flow-router-breadcrumb) - Easy way to add a breadcrumb with enough flexibility to your project (`flow-router-extra` edition)
- [nicolaslopezj:router-layer](https://github.com/krishaamer/body-class) - Easily scope CSS by automatically adding the current template and layout names as classes on the body element

## Support this project:

This project wouldn't be possible without [ostr.io](https://ostr.io).

Using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one could be available for free.
