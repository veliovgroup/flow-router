/* eslint-disable no-new -- tsd exercises constructor signatures */
import { expectAssignable, expectError, expectType } from 'tsd';
import type {
  FlowRouterSingleton,
  GroupConstructor,
  RouteConstructor,
  Router as RouterApi,
  RouterConstructor,
} from '.';
import {
  BlazeRenderer,
  FlowRouter,
  Group,
  MAX_WAIT_FOR_MS,
  Route,
  Router,
  RouterHelpers,
  Triggers,
} from '.';

expectType<number>(MAX_WAIT_FOR_MS);

expectType<RouterConstructor>(FlowRouter.Router);
expectType<RouteConstructor>(FlowRouter.Route);
expectType<RouterConstructor>(Router);
expectType<RouteConstructor>(Route);
expectType<GroupConstructor>(Group);

expectAssignable<RouterApi>(FlowRouter);
expectType<FlowRouterSingleton>(FlowRouter);

expectType<RouterApi>(new FlowRouter.Router());
const routeInstance = new FlowRouter.Route();
expectType<string>(routeInstance.name);
new Group();
new BlazeRenderer();

expectType<typeof Triggers>(Triggers);

expectType<number>(FlowRouter.maxWaitFor);
FlowRouter.initialize({ hashbang: false, maxWaitFor: 60_000 });

FlowRouter.route('/', {
  name: 'home',
});

FlowRouter.go('/');

expectType<string>(FlowRouter.current().route.name);
expectType<string>(FlowRouter.current().path);
expectType<Record<string, string>>(FlowRouter.current().params);

FlowRouter.route('/post/:id', {
  name: 'singlePost',
});
FlowRouter.go('singlePost', { id: '12345' });

expectType<string>(FlowRouter.path('singlePost', { id: 'a' }));
expectType<string>(FlowRouter.url('singlePost', { id: 'a' }));
expectType<boolean>(FlowRouter.setParams({ id: '1' }));
expectType<boolean>(FlowRouter.setQueryParams({ q: null }));

// getParam is always string at type level
expectType<string>(FlowRouter.getParam('id'));
expectType<string>(FlowRouter.getQueryParam('q'));

expectType<boolean>(RouterHelpers.name('home'));
expectType<string>(RouterHelpers.pathFor('home', {}));

// Should error when a number is given instead of string | null
expectError(FlowRouter.go('singlePost', { id: 12345 }));
