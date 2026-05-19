import { Random } from 'meteor/random';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { isActiveRoute } from '../../client/renderer.js';

Tinytest.add('Client - Renderer - isActiveRoute matches router._current.route', (test) => {
  const routeA = { name: 'a' };
  const routeB = { name: 'b' };
  const router = { _current: { route: routeB } };

  test.isFalse(isActiveRoute(router, routeA));
  test.isTrue(isActiveRoute(router, routeB));
  test.isFalse(isActiveRoute(null, routeA));
});

Tinytest.addAsync('Client - Router - superseded async action does not apply render', (test, next) => {
  const rand = Random.id();
  const renderLog = [];
  const renderer = FlowRouter.Renderer;

  const renderForRoute = (route, layout) => {
    renderLog.push({
      routeName: route.name,
      layout,
      active: isActiveRoute(FlowRouter, route),
    });
  };

  FlowRouter.Renderer = {
    renderForRoute,
    render(...args) {
      renderForRoute(void 0, ...args);
    },
  };

  FlowRouter.route('/slow-' + rand, {
    name: 'slow-' + rand,
    async action() {
      await new Promise((resolve) => Meteor.setTimeout(resolve, 80));
      this.render('layoutSlow', 'slow');
    },
  });

  FlowRouter.route('/fast-' + rand, {
    name: 'fast-' + rand,
    action() {
      this.render('layoutFast', 'fast');
    },
  });

  FlowRouter.go('/slow-' + rand);
  FlowRouter.go('/fast-' + rand);

  Meteor.setTimeout(() => {
    FlowRouter.Renderer = renderer;

    const slowAttempts = renderLog.filter((entry) => entry.layout === 'layoutSlow');
    const fastAttempts = renderLog.filter((entry) => entry.layout === 'layoutFast');

    test.equal(FlowRouter.getRouteName(), 'fast-' + rand);
    test.equal(fastAttempts.length, 1);
    test.isTrue(fastAttempts[0].active);

    test.equal(slowAttempts.length, 1);
    test.isFalse(slowAttempts[0].active);

    next();
  }, 200);
});
