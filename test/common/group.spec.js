Tinytest.add('Common - Group - expose group options', function (test) {
  var pathDef = "/" + Random.id();
  var name = Random.id();
  var data = {aa: 10};
  var layout = 'blah';

  var group = FlowRouter.group({
    name: name,
    prefix: '/admin',
    layout: layout,
    someData: data
  });

  test.equal(group.options.someData, data);
  test.equal(group.options.layout, layout);
});

Tinytest.add('Common - Group - define route with nested prefix', function (test) {
  var firstPrefix = Random.id();
  var secondPrefix = Random.id();
  var routePath = Random.id();
  var routeName = Random.id();

  var firstGroup = FlowRouter.group({prefix: '/' + firstPrefix});
  var secondGroup = firstGroup.group({prefix: '/' + secondPrefix});

  secondGroup.route('/' + routePath, {name: routeName});

  test.equal(FlowRouter.path(routeName), '/' + firstPrefix + '/' + secondPrefix + '/' + routePath);
});