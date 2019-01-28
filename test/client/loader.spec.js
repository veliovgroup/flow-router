import { FlowRouter, Router } from 'meteor/ostrio:flow-router-extra';

Tinytest.add('Client - import page.js', (test) => {
  test.isTrue(!!Router.prototype._page);
  test.isTrue(!!FlowRouter._page);
  test.isFalse(!!window.page);
});

Tinytest.add('Client - import query.js', (test) => {
  test.isTrue(!!Router.prototype._qs);
  test.isTrue(!!FlowRouter._qs);
});

Tinytest.add('Client - create FlowRouter', (test) => {
  test.isTrue(!!FlowRouter);
});
