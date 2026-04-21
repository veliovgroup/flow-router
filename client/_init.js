import { Meteor }    from 'meteor/meteor';
import Router        from './router.js';
import Route         from './route.js';
import Group         from './group.js';
import Triggers      from './triggers.js';
import BlazeRenderer from './renderer.js';
import helpersInit   from './active.route.js';

if (Package['zimme:active-route']) {
  Meteor._debug('Please remove `zimme:active-route` package, as its features is build into flow-router-extra, and will interfere.');
  Meteor._debug('meteor remove zimme:active-route');
}

if (Package['arillo:flow-router-helpers']) {
  Meteor._debug('Please remove `arillo:flow-router-helpers` package, as its features is build into flow-router-extra, and will interfere.');
  Meteor._debug('meteor remove arillo:flow-router-helpers');
}

if (Package['meteorhacks:inject-data']) {
  Meteor._debug('`meteorhacks:inject-data` is deprecated, please remove it and install its successor - `communitypackages:inject-data`');
  Meteor._debug('meteor remove meteorhacks:inject-data');
  Meteor._debug('meteor add communitypackages:inject-data');
}

if (Package['meteorhacks:fast-render']) {
  Meteor._debug('`meteorhacks:fast-render` is deprecated, please remove it and install its successor - `communitypackages:fast-render`');
  Meteor._debug('meteor remove meteorhacks:fast-render');
  Meteor._debug('meteor add communitypackages:fast-render');
}

if (Package['staringatlights:inject-data']) {
  Meteor._debug('`staringatlights:inject-data` is deprecated, please remove it and install its successor - `communitypackages:inject-data`');
  Meteor._debug('meteor remove staringatlights:inject-data');
  Meteor._debug('meteor add communitypackages:inject-data');
}

if (Package['staringatlights:fast-render']) {
  Meteor._debug('`staringatlights:fast-render` is deprecated, please remove it and install its successor - `communitypackages:fast-render`');
  Meteor._debug('meteor remove staringatlights:fast-render');
  Meteor._debug('meteor add communitypackages:fast-render');
}

const FlowRouter = new Router();
FlowRouter.Router = Router;
FlowRouter.Route = Route;

// Initialize FlowRouter
Meteor.startup(() => {
  if(!FlowRouter._askedToWait && !FlowRouter._initialized) {
    FlowRouter.initialize();

  }
});

const RouterHelpers = helpersInit(FlowRouter);

export { MAX_WAIT_FOR_MS } from '../lib/constants.js';
export { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer, RouterHelpers };
