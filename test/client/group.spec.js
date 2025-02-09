import { Meteor }            from 'meteor/meteor';
import { Random }            from 'meteor/random';
import { GetSub }            from './_helpers.js';
import { FlowRouter, Group } from 'meteor/jessedev:flow-router-extra';

Tinytest.add('Client - Group - validate path definition', (test) => {
  // path & prefix must start with '/'
  test.throws(function() {
    new Group(null, {prefix: Random.id()});
  });

  const group = FlowRouter.group({prefix: '/' + Random.id()});

  test.throws(function() {
    group.route(Random.id());
  });
});

Tinytest.addAsync('Client - Group - define and go to route with prefix', (test, next) => {
  const prefix = Random.id();
  const rand   = Random.id();
  let rendered = 0;

  const group = FlowRouter.group({prefix: '/' + prefix});

  group.route('/' + rand, {
    action() {
      rendered++;
    }
  });

  FlowRouter.go('/' + prefix + '/' + rand);

  setTimeout(() => {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Group - define and go to route without prefix', (test, next) => {
  const rand   = Random.id();
  let rendered = 0;
  const group  = FlowRouter.group();

  group.route('/' + rand, {
    action() {
      rendered++;
    }
  });

  FlowRouter.go('/' + rand);

  setTimeout(() => {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Group - subscribe', (test, next) => {
  const rand  = Random.id();
  const group = FlowRouter.group({
    subscriptions() {
      this.register('baz', Meteor.subscribe('baz'));
    }
  });

  group.route('/' + rand);

  FlowRouter.go('/' + rand);
  setTimeout(() => {
    test.isTrue(!!GetSub('baz'));
    next();
  }, 100);
});


Tinytest.addAsync('Client - Group - set and retrieve group name', (test, next) => {
  const rand = Random.id();
  const name = Random.id();

  const group = FlowRouter.group({
    name: name
  });

  group.route('/' + rand);

  FlowRouter.go('/' + rand);
  setTimeout(() => {
    test.isTrue((FlowRouter.current().route.group || {}).name === name);
    next();
  }, 100);
});

Tinytest.add('Client - Group - expose group options on a route', (test) => {
  const pathDef   = '/' + Random.id();
  const name      = Random.id();
  const groupName = Random.id();
  const data      = {aa: 10};
  const layout    = 'blah';

  const group = FlowRouter.group({
    name: groupName,
    prefix: '/admin',
    layout: layout,
    someData: data
  });

  group.route(pathDef, { name });

  const route = FlowRouter._routesMap[name];

  test.equal(route.group.options.someData, data);
  test.equal(route.group.options.layout, layout);
});
