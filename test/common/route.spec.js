import { FlowRouter, Router } from 'meteor/ostrio:flow-router-extra';

Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];

Tinytest.addAsync('Common - Route - expose route options', function (test, next) {
  var pathDef = '/' + Random.id();
  var name = Random.id();
  var data = {aa: 10};

  FlowRouter.route(pathDef, {
    name: name,
    someData: data
  });

  test.equal(FlowRouter._routesMap[name].options.someData, data);
  next();
});
