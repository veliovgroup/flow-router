import page          from 'page';
import Route          from './route.js';
import Group          from './group.js';
import { _helpers }   from '../lib/_helpers.js';
import { RouterBase } from '../lib/router-base.js';

class Router extends RouterBase {
  constructor() {
    super();
  }

  _getGroupClass() {
    return Group;
  }

  matchPath(path) {
    const params = {};
    const route = this._routes.find(r => {
      const pageRoute = new page.Route(r.pathDef);
      return pageRoute.match(path, params);
    });

    if (!route) {
      return null;
    }

    return {
      params: _helpers.clone(params),
      route:  _helpers.clone(route),
    };
  }

  setCurrent(current) {
    this._current = current;
  }

  route(pathDef, options = {}, group) {
    if (!/^\/.*/.test(pathDef) && pathDef !== '*') {
      throw new Error('route\'s path must start with "/"');
    }

    const route = new Route(this, pathDef, options, group);
    this._routes.push(route);

    if (options.name) {
      this._routesMap[options.name] = route;
    }

    this._triggerRouteRegister(route);
    return route;
  }
}

export default Router;
