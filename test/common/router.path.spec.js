import { FlowRouter, Router } from 'meteor/ostrio:flow-router-extra';

Tinytest.addAsync('Common - Router - validate path definition', function (test, next) {
  // path must start with '/'
  try {
    FlowRouter.route(Random.id());
  } catch(ex) {
    next();
  }
});

Tinytest.add('Common - Router - path - generic', function (test) {
  var pathDef = "/blog/:blogId/some/:name";
  var fields = {
    blogId: "1001",
    name: "superb"
  };
  var expectedPath = "/blog/1001/some/superb";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - queryParams', function (test) {
  var pathDef = "/blog/:blogId/some/:name";
  var fields = {
    blogId: "1001",
    name: "superb"
  };

  var queryParams = {
    aa: "100",
    bb: "200"
  };

  var expectedPath = "/blog/1001/some/superb?aa=100&bb=200";

  var path = FlowRouter.path(pathDef, fields, queryParams);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - just queryParams', function (test) {
  var pathDef = "/blog/abc";
  var queryParams = {
    aa: "100",
    bb: "200"
  };

  var expectedPath = "/blog/abc?aa=100&bb=200";

  var path = FlowRouter.path(pathDef, null, queryParams);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - query from pathDef', function (test) {
  var pathDef = "/blog/abc?aa=100&bb=200";
  var expectedPath = "/blog/abc?aa=100&bb=200";

  var path = FlowRouter.path(pathDef);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - merge query from pathDef and queryParams', function (test) {
  var pathDef = "/blog/abc?aa=100&bb=200";
  var queryParams = {
    bb: "300",
    cc: "400"
  };
  var expectedPath = "/blog/abc?aa=100&bb=300&cc=400";

  var path = FlowRouter.path(pathDef, null, queryParams);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - encode query values', function (test) {
  var pathDef = "/blog/abc";
  var queryParams = {
    q: "flow router",
    amp: "a&b",
    eq: "x=y"
  };
  var expectedPath = "/blog/abc?q=flow%20router&amp=a%26b&eq=x%3Dy";

  var path = FlowRouter.path(pathDef, null, queryParams);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - array query values', function (test) {
  var pathDef = "/blog/abc";
  var queryParams = {
    tags: ["flow", "router"]
  };
  var expectedPath = "/blog/abc?tags%5B0%5D=flow&tags%5B1%5D=router";

  var path = FlowRouter.path(pathDef, null, queryParams);
  test.equal(path, expectedPath);
});


Tinytest.add('Common - Router - path - missing fields', function (test) {
  var pathDef = "/blog/:blogId/some/:name";
  var fields = {
    blogId: "1001",
  };
  var expectedPath = "/blog/1001/some";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - no fields', function (test) {
  var pathDef = "/blog/blogId/some/name";
  var path = FlowRouter.path(pathDef);
  test.equal(path, pathDef);
});

Tinytest.add('Common - Router - path - complex route', function (test) {
  var pathDef = "/blog/:blogId/some/:name(\\d*)+";
  var fields = {
    blogId: "1001",
    name: 20
  };
  var expectedPath = "/blog/1001/some/20";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - optional last param missing', function (test) {
  var pathDef = "/blog/:blogId/some/:name?";
  var fields = {
    blogId: "1001"
  };
  var expectedPath = "/blog/1001/some";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - both optional last param missing', function (test) {
  var pathDef = "/blog/:id?/:action?";
  var fields = {
    id: "6135cb32d14df059605901fd",
    action: ''
  };
  var expectedPath = "/blog/6135cb32d14df059605901fd";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - both optional last param exists', function (test) {
  var pathDef = "/blog/:id?/:action?";
  var fields = {
    id: "6135cb32d14df059605901fd",
    action: 'view'
  };
  var expectedPath = "/blog/6135cb32d14df059605901fd/view";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - optional last param exists', function (test) {
  var pathDef = "/blog/:blogId/some/:name?";
  var fields = {
    blogId: "1001",
    name: 20
  };
  var expectedPath = "/blog/1001/some/20";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - remove trailing slashes', function (test) {
  var pathDef = "/blog/:blogId/some/:name//";
  var fields = {
    blogId: "1001",
    name: "superb"
  };
  var expectedPath = "/blog/1001/some/superb";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - handle multiple slashes', function (test) {
  var pathDef = "/blog///some/hi////";
  var expectedPath = "/blog/some/hi";

  var path = FlowRouter.path(pathDef);
  test.equal(path, expectedPath);
});

Tinytest.add('Common - Router - path - keep the root slash', function (test) {
  var pathDef = "/";
  var fields = {};
  var expectedPath = "/";

  var path = FlowRouter.path(pathDef, fields);
  test.equal(path, expectedPath);
});
