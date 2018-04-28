import { _ }          from 'meteor/underscore';
import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from '../_init.js';

if(!Package['staringatlights:fast-render']) {
  return;
}

const FastRender = Package['staringatlights:fast-render'].FastRender;

const setupFastRender = () => {
  _.each(FlowRouter._routes, (route) => {
    if (route.pathDef === '*') {
      return;
    }

    FastRender.route(route.pathDef, function (routeParams, path) {
      // anyone using Meteor.subscribe for something else?
      const meteorSubscribe = Meteor.subscribe;
      Meteor.subscribe = function () {
        return _.toArray(arguments);
      };

      route._subsMap = {};
      FlowRouter.subscriptions.call(route, path);
      if (route.subscriptions) {
        route.subscriptions(_.omit(routeParams, 'query'), routeParams.query);
      }

      _.each(route._subsMap, (args) => {
        this.subscribe.apply(this, args);
      });

      // restore Meteor.subscribe, ... on server side
      Meteor.subscribe = meteorSubscribe;
    });
  });
};

// hack to run after eveything else on startup
Meteor.startup(() => {
  Meteor.startup(() => {
    setupFastRender();
  });
});
