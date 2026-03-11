import { FlowRouter, Router } from 'meteor/ostrio:flow-router-extra';

Tinytest.add('Client - import page.js', (test) => {
  // page.js has been replaced by MicroRouter — verify it is no longer present
  test.isFalse(!!window.page);
  test.isTrue(!!FlowRouter._microRouter);
});

Tinytest.add('Client - import query.js', (test) => {
  // qs is used internally — verify the router can generate query strings
  test.isTrue(!!FlowRouter.path('/', {}, { foo: 'bar' }).includes('foo=bar'));
});

Tinytest.add('Client - create FlowRouter', (test) => {
  test.isTrue(!!FlowRouter);
});
