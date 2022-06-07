import { Meteor } from 'meteor/meteor';
import Router     from './router.js';
import Route      from './route.js';
import Group      from './group.js';
import './plugins/fast-render.js';

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

const Triggers = {};
const BlazeRenderer = {};

const FlowRouter = new Router();
FlowRouter.Router = Router;
FlowRouter.Route = Route;

export { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer };
