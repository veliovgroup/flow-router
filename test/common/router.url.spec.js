import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Tinytest.add('Common - Router - url - generic', function (test) {
  var pathDef = '/blog/:blogId/some/:name';
  var fields = {
    blogId: '1001',
    name: 'superb'
  };
  var expectedUrl = Meteor.absoluteUrl('blog/1001/some/superb');

  var path = FlowRouter.url(pathDef, fields);
  test.equal(path, expectedUrl);
});
