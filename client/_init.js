import { Meteor }    from 'meteor/meteor';
import Router        from './router.js';
import Route         from './route.js';
import Group         from './group.js';
import Triggers      from './triggers.js';
import BlazeRenderer from './renderer.js';
import helpersInit   from './active.route.js';
import { _helpers }  from './../lib/_helpers.js';
import { requestAnimFrame } from './modules.js';

if (Package['zimme:active-route']) {
  Meteor._debug('Please remove `zimme:active-route` package, as its features is build into flow-router-extra, and will interfere.');
  Meteor._debug('meteor remove zimme:active-route');
}

if (Package['arillo:flow-router-helpers']) {
  Meteor._debug('Please remove `arillo:flow-router-helpers` package, as its features is build into flow-router-extra, and will interfere.');
  Meteor._debug('meteor remove arillo:flow-router-helpers');
}

if (Package['meteorhacks:inject-data']) {
  Meteor._debug('`meteorhacks:inject-data` is deprecated, please remove it and install its successor - `staringatlights:inject-data`');
  Meteor._debug('meteor remove meteorhacks:inject-data');
  Meteor._debug('meteor add staringatlights:inject-data');
}

if (Package['meteorhacks:fast-render']) {
  Meteor._debug('`meteorhacks:fast-render` is deprecated, please remove it and install its successor - `staringatlights:fast-render`');
  Meteor._debug('meteor remove meteorhacks:fast-render');
  Meteor._debug('meteor add staringatlights:fast-render');
}

const FlowRouter = new Router();
FlowRouter.Router = Router;
FlowRouter.Route = Route;

// Initialize FlowRouter
Meteor.startup(() => {
  if(!FlowRouter._askedToWait && !FlowRouter._initialized) {
    FlowRouter.initialize();

    FlowRouter.route('/___refresh/:layout/:template/:oldRoute?', {
      name: '___refresh',
      action(params, queryParams) {
        this.render(params.layout, params.template, () => {
          requestAnimFrame(() => {
            if (params.oldRoute) {
              try {
                if (history.length) {
                  window.history.go(-1);
                } else {
                  FlowRouter.go(params.oldRoute, (queryParams.oldParams ? JSON.parse(queryParams.oldParams) : {}));
                }
              } catch (e) {
                FlowRouter.go('/');
              }
            } else {
              if (history.length) {
                window.history.go(-1);
              } else {
                FlowRouter.go('/');
              }
            }
          });
        });
      }
    });

    FlowRouter.refresh = (layout, template) => {
      if (!layout || !_helpers.isString(layout)) {
        throw new Meteor.Error(400, '[FlowRouter.refresh(layout, template)] -> "layout" must be a String!');
      }

      if (!template || !_helpers.isString(template)) {
        throw new Meteor.Error(400, '[FlowRouter.refresh(layout, template)] -> "template" must be a String!');
      }

      FlowRouter.go('___refresh', {
        oldRoute: FlowRouter._current.route.name,
        layout,
        template
      }, {
        oldParams: JSON.stringify(FlowRouter._current.params || {})
      });
    };
  }
});

const RouterHelpers = helpersInit(FlowRouter);

export { FlowRouter, Router, Route, Group, Triggers, BlazeRenderer, RouterHelpers };
