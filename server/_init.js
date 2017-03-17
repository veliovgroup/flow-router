import Router from './router.js';
import Route from './route.js';
import Group from './group.js';

const Triggers = {};
const BlazeRenderer = {};

const FlowRouter = new Router();
FlowRouter.Router = Router;
FlowRouter.Route = Route;

export { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer };
