import { Random }     from 'meteor/random';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Tinytest.add('Common - Group - expose group options', (test) => {
  const name   = Random.id();
  const data   = {aa: 10};
  const layout = 'blah';

  const group = FlowRouter.group({
    name: name,
    prefix: '/admin',
    layout: layout,
    someData: data
  });

  test.equal(group.options.someData, data);
  test.equal(group.options.layout, layout);
});

Tinytest.add('Common - Group - define route with nested prefix', (test) => {
  const firstPrefix  = Random.id();
  const secondPrefix = Random.id();
  const routePath    = Random.id();
  const routeName    = Random.id();

  const firstGroup  = FlowRouter.group({prefix: '/' + firstPrefix});
  const secondGroup = firstGroup.group({prefix: '/' + secondPrefix});

  secondGroup.route('/' + routePath, {name: routeName});

  test.equal(FlowRouter.path(routeName), '/' + firstPrefix + '/' + secondPrefix + '/' + routePath);
});
