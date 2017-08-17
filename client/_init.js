import { Meteor }    from 'meteor/meteor';
import { _ }         from 'meteor/underscore';
import Router        from './router.js';
import Route         from './route.js';
import Group         from './group.js';
import Triggers      from './triggers.js';
import BlazeRenderer from './renderer.js';
import helpersInit   from './active.route.js';
import { requestAnimFrame } from './modules.js';

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
      if (!layout || !_.isString(layout)) {
        throw new Meteor.Error(400, '[FlowRouter.refresh(layout, template)] -> "layout" must be a String!');
      }

      if (!template || !_.isString(template)) {
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
