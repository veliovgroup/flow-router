import { Meteor } from 'meteor/meteor';
import page from 'page';
import Route from './route.js';
import Group from './group.js';
import { _helpers } from '../lib/_helpers.js';


const qs = require('qs');

class Router {
  constructor() {
    this.pathRegExp = /(:[\w\(\)\\\+\*\.\?\[\]\-]+)+/g;
    this._routes = [];
    this._routesMap = {};
    this._current = {};
    this.subscriptions = Function.prototype;

    // holds onRoute callbacks
    this._onRouteCallbacks = [];

    this.triggers = {
      enter() {
        // client only
      },
      exit() {
        // client only
      },
    };
  }

  matchPath(path, queryParams) {
    const params = {};
    const route = this._routes.find(r => {
      const pageRoute = new page.Route(r.pathDef);

      return pageRoute.match(path, params);
    });
    if (!route) {
      return null;
    }
    this._current = {
      path,
      params,
      route,
      queryParams,
    };

    return { params, route };
  }

  route(pathDef, options = {}) {
    if (!/^\/.*/.test(pathDef) && pathDef !== '*') {
      throw new Error('route\'s path must start with "/"');
    }

    const route = new Route(this, pathDef, options);
    this._routes.push(route);

    if (options.name) {
      this._routesMap[options.name] = route;
    }

    this._triggerRouteRegister(route);
    return route;
  }

  group(options) {
    return new Group(this, options);
  }

  path(_pathDef, fields = {}, queryParams) {
    let pathDef = _pathDef;
    if (this._routesMap[pathDef]) {
      pathDef = this._routesMap[pathDef].path;
    }

    let path = pathDef.replace(this.pathRegExp, _key => {
      const firstRegexpChar = _key.indexOf('(');
      // get the content behind : and (\\d+/)
      let key = _key.substring(
        1,
        firstRegexpChar > 0 ? firstRegexpChar : undefined
      );
      // remove +?*
      key = key.replace(/[\+\*\?]+/g, '');

      return fields[key] || '';
    });

    path = path.replace(/\/\/+/g, '/'); // Replace multiple slashes with single slash

    // remove trailing slash
    // but keep the root slash if it's the only one
    path = path.match(/^\/{1}$/) ? path : path.replace(/\/$/, '');

    const strQueryParams = qs.stringify(queryParams || {});
    if (strQueryParams) {
      path += `?${strQueryParams}`;
    }

    return path;
  }

  onRouteRegister(cb) {
    this._onRouteCallbacks.push(cb);
  }

  _triggerRouteRegister(currentRoute) {
    // We should only need to send a safe set of fields on the route
    // object.
    // This is not to hide what's inside the route object, but to show
    // these are the public APIs
    const routePublicApi = _helpers.pick(currentRoute, [
      'name',
      'pathDef',
      'path',
    ]);
    routePublicApi.options = _helpers.omit(currentRoute.options, [
      'triggersEnter',
      'triggersExit',
      'action',
      'subscriptions',
      'name',
    ]);

    this._onRouteCallbacks.forEach(cb => {
      cb(routePublicApi);
    });
  }

  go() {
    // client only
  }

  current() {
    // client only
    return this._current;
  }

  middleware() {
    // client only
  }

  getState() {
    // client only
  }

  getAllStates() {
    // client only
  }

  getRouteName() {
    return this._current.route ? this._current.route.name : undefined;
  }

  getQueryParam(key) {
    return this._current.query ? this._current.queryParams[key] : undefined;
  }

  setState() {
    // client only
  }

  removeState() {
    // client only
  }

  clearStates() {
    // client only
  }

  ready() {
    // client only
  }

  initialize() {
    // client only
  }

  wait() {
    // client only
  }

  url() {
    // We need to remove the leading base path, or "/", as it will be inserted
    // automatically by `Meteor.absoluteUrl` as documented in:
    // http://docs.meteor.com/#/full/meteor_absoluteurl
    return Meteor.absoluteUrl(
      this.path
        .apply(this, arguments)
        .replace(
          new RegExp(`^${`/${this._basePath || ''}/`.replace(/\/\/+/g, '/')}`),
          ''
        )
    );
  }
}

export default Router;
