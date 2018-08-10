import { Meteor }     from 'meteor/meteor';
import { _helpers }   from './../../lib/_helpers.js';
import { FlowRouter } from '../_init.js';

if(!Package['staringatlights:fast-render']) {
  return;
}

const FastRender = Package['staringatlights:fast-render'].FastRender;

const setupFastRender = () => {
  FlowRouter._routes.forEach((route) => {
    if (route.pathDef === '*') {
      return;
    }

    FastRender.route(route.pathDef, function (routeParams, path) {
      // anyone using Meteor.subscribe for something else?
      const meteorSubscribe = Meteor.subscribe;
      Meteor.subscribe = function () {
        return Array.from(arguments);
      };

      route._subsMap = {};
      FlowRouter.subscriptions.call(route, path);
      if (route.subscriptions) {
        route.subscriptions(_helpers.omit(routeParams, ['query']), routeParams.query);
      }

      Object.keys(route._subsMap).forEach((key) => {
        this.subscribe.apply(this, route._subsMap[key]);
      });

      // restore Meteor.subscribe, ... on server side
      Meteor.subscribe = meteorSubscribe;
    });
  });
};

// hack to run after everything else on startup
Meteor.startup(() => {
  Meteor.startup(() => {
    setupFastRender();
  });
});
