import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Tinytest.add('Common - Router - url - generic', (test) => {
  const pathDef = '/blog/:blogId/some/:name';
  const fields = {
    blogId: '1001',
    name: 'superb'
  };
  const expectedUrl = Meteor.absoluteUrl('blog/1001/some/superb');

  const path = FlowRouter.url(pathDef, fields);
  test.equal(path, expectedUrl);
});
