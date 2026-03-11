import Route                            from './route.js';
import Group                            from './group.js';
import { _helpers }                     from '../lib/_helpers.js';
import { RouterBase }                   from '../lib/router-base.js';
import { pathToRegExp, matchPath }      from '../lib/micro-router.js';

class Router extends RouterBase {
  constructor() {
    super();
    // Pre-compiled route patterns cache (populated lazily in matchPath)
    this._compiledRoutes = new WeakMap();
  }

  _getGroupClass() {
    return Group;
  }

  matchPath(path) {
    for (const route of this._routes) {
      if (!this._compiledRoutes.has(route)) {
        this._compiledRoutes.set(route, pathToRegExp(route.pathDef));
      }
      const compiled = this._compiledRoutes.get(route);
      const params = matchPath(compiled, path);
      if (params) {
        return {
          params: _helpers.clone(params),
          route:  _helpers.clone(route),
        };
      }
    }
    return null;
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
