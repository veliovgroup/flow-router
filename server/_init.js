import { Meteor } from 'meteor/meteor';
import Router     from './router.js';
import Route      from './route.js';
import Group      from './group.js';

if (Package['meteorhacks:inject-data']) {
  Meteor._debug('`meteorhacks:inject-data` is deprecated, please remove it and install its successor - `staringatlights:inject-data`');
  Meteor._debug('meteor remove meteorhacks:inject-data');
  Meteor._debug('meteor add staringatlights:inject-data');
}

if (Package['meteorhacks:fast-render']) {
  Meteor._debug('`meteorhacks:fast-render` is deprecated, please remove it and install its successor - `staringatlights:fast-render`');
  Meteor._debug('meteor remove meteorhacks:fast-render');
  Meteor._debug('meteor add staringatlights:fast-render');
}

const Triggers = {};
const BlazeRenderer = {};

const FlowRouter = new Router();
FlowRouter.Router = Router;
FlowRouter.Route = Route;

export { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer };
