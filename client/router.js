import { FlowRouter, Route, Group, Triggers, BlazeRenderer } from './_init.js';
import { EJSON }    from 'meteor/ejson';
import { Meteor }   from 'meteor/meteor';
import { Tracker }  from 'meteor/tracker';
import { _helpers } from './../lib/_helpers.js';
import { qs } from './modules.js';
import { MicroRouter } from '../lib/micro-router.js';
import { MAX_WAIT_FOR_MS } from '../lib/constants.js';

class Router {
  constructor() {
    this.pathRegExp = /(:[\w\(\)\\\+\*\.\?\[\]\-]+)+/g;
    this.queryRegExp = /\?([^\/\r\n].*)/;
    this.globals = [];
    this.subscriptions = Function.prototype;
    this.Renderer = new BlazeRenderer({ router: this });

    this._microRouter = new MicroRouter();
    this._tracker = this._buildTracker();
    this._current = {};
    this._onEveryPath = new Tracker.Dependency();

    this.maxWaitFor = MAX_WAIT_FOR_MS;
    this._globalRoute = new Route(this);
    this._onRouteCallbacks = [];

    this._askedToWait = false;
    this._initialized = false;
    this._triggersEnter = [];
    this._triggersExit = [];
    this._routes = [];
    this._routesMap = {};
    this._updateCallbacks();
    this._notFound = null;
    this.notfound = this.notFound;
    this.safeToRun = 0;

    this._basePath = window.__meteor_runtime_config__.ROOT_URL_PATH_PREFIX || '';
    this._oldRouteChain = [];

    this.env = {
      replaceState: new Meteor.EnvironmentVariable(),
      reload: new Meteor.EnvironmentVariable(),
      trailingSlash: new Meteor.EnvironmentVariable()
    };

    const reactiveApis = ['getParam', 'getQueryParam', 'getRouteName', 'watchPathChange'];
    reactiveApis.forEach((api) => {
      this[api] = function (arg1) {
        const currentRoute = this._current.route;
        if (!currentRoute) {
          this._onEveryPath.depend();
          return void 0;
        }
        return currentRoute[api].call(currentRoute, arg1);
      };
    });

    this._redirectFn = (pathDef, fields, queryParams) => {
      if (/^http(s)?:\/\//.test(pathDef)) {
        throw new Error("Redirects to URLs outside of the app are not supported in this version of Flow Router. Use 'window.location = yourUrl' instead");
      }
      this.withReplaceState(() => {
        this._microRouter.redirect(this._stripBase(FlowRouter.path(pathDef, fields, queryParams)));
      });
    };
    this._initTriggersAPI();
  }

  set notFound(opts) {
    Meteor.deprecate('FlowRouter.notFound is deprecated, use FlowRouter.route(\'*\', { /*...*/ }) instead!');
    opts.name = opts.name || '__notFound';
    this._notFound = this.route('*', opts);
  }

  get notFound() {
    return this._notFound;
  }

  route(pathDef, options = {}, group) {
    if (!/^\//.test(pathDef) && pathDef !== '*') {
      throw new Error("route's path must start with '/'");
    }

    const route = new Route(this, pathDef, options, group);

    route._actionHandle = (context) => {
      const oldRoute = this._current.route;
      this._oldRouteChain.push(oldRoute);

      const queryParams = qs.parse(context.querystring || '');
      // Reconstruct the full path (with base) so idempotency check in go() works
      const base = this._basePath ? `/${this._basePath}`.replace(/\/\/+/g, '/') : '';
      const fullPath = (base + context.path).replace(/\/\/+/g, '/');
      this._current = {
        path: fullPath,
        params: context.params,
        route,
        context,
        oldRoute,
        queryParams
      };

      const afterAllTriggersRan = () => {
        this._invalidateTracker();
      };

      route.waitOn(this._current, (current, data) => {
        Triggers.runTriggers(
          this._triggersEnter.concat(route._triggersEnter),
          this._current,
          this._redirectFn,
          afterAllTriggersRan,
          data
        );
      });
    };

    route._exitHandle = (context, next) => {
      Triggers.runTriggers(
        this._triggersExit.concat(route._triggersExit),
        this._current,
        this._redirectFn,
        next
      );
    };

    this._routes.push(route);
    if (options.name) {
      this._routesMap[options.name] = route;
    }

    this._updateCallbacks();
    this._triggerRouteRegister(route);
    return route;
  }

  group(options) {
    return new Group(this, options);
  }

  path(_pathDef, fields = {}, _queryParams = {}) {
    let pathDef = _pathDef || '';
    let queryParams = _queryParams;

    if (this._routesMap[pathDef]) {
      pathDef = _helpers.clone(this._routesMap[pathDef].pathDef);
    }

    if (this.queryRegExp.test(pathDef)) {
      const pathDefParts = pathDef.split(this.queryRegExp);
      pathDef = pathDefParts[0];
      if (pathDefParts[1]) {
        queryParams = Object.assign(qs.parse(pathDefParts[1]), queryParams);
      }
    }

    let path = '';

    if (this._basePath) {
      path += `/${this._basePath}/`;
    }

    path += pathDef.replace(this.pathRegExp, (_key) => {
      const firstRegexpChar = _key.indexOf('(');
      let key = _key.substring(1, firstRegexpChar > 0 ? firstRegexpChar : undefined);
      key = key.replace(/[\+\*\?]+/g, '');

      if (fields[key]) {
        return encodeURIComponent(`${fields[key]}`);
      }
      return '';
    });

    path = path.replace(/\/\/+/g, '/');
    path = path.match(/^\/{1}$/) ? path : path.replace(/\/$/, '');

    if (this.env.trailingSlash.get() && path[path.length - 1] !== '/') {
      path += '/';
    }

    const strQueryParams = qs.stringify(queryParams || {});
    if (strQueryParams) {
      path += `?${strQueryParams}`;
    }

    path = path.replace(/\/\/+/g, '/');
    return path;
  }

  go(pathDef, fields, queryParams) {
    const path = this.path(pathDef, fields, queryParams);
    if (!this.env.reload.get() && path === this._current.path) {
      return;
    }

    try {
      // MicroRouter expects paths without base; strip it before passing
      const routerPath = this._stripBase(path);
      if (this.env.replaceState.get()) {
        this._microRouter.replace(routerPath);
      } else {
        this._microRouter.show(routerPath);
      }
    } catch (e) {
      Meteor._debug('Malformed URI!', path, e);
    }
  }

  reload() {
    this.env.reload.withValue(true, () => {
      this._microRouter.replace(this._stripBase(this._current.path));
    });
  }

  redirect(path) {
    this._microRouter.redirect(this._stripBase(path));
  }

  // Strip the base path prefix before passing to MicroRouter.
  // FlowRouter.path() includes the base path for link generation,
  // but MicroRouter works with app-relative paths and adds the base in pushState.
  _stripBase(path) {
    if (!this._basePath) return path;
    const base = `/${this._basePath}`.replace(/\/\/+/g, '/').replace(/\/$/, '');
    if (path.startsWith(base + '/') || path === base) {
      return path.slice(base.length) || '/';
    }
    return path;
  }

  setParams(newParams) {
    if (!this._current.route) { return false; }

    const pathDef = this._current.route.pathDef;
    const existingParams = this._current.params;
    let params = {};
    Object.keys(existingParams).forEach((key) => {
      params[key] = existingParams[key];
    });

    params = _helpers.extend(params, newParams);
    const queryParams = this._current.queryParams;
    this.go(pathDef, params, queryParams);
    return true;
  }

  setQueryParams(newParams) {
    if (!this._current.route) { return false; }

    const queryParams = _helpers.extend(_helpers.clone(this._current.queryParams), newParams);
    for (const k in queryParams) {
      if (queryParams[k] === null || queryParams[k] === undefined) {
        delete queryParams[k];
      }
    }

    const pathDef = this._current.route.pathDef;
    const params = this._current.params;
    this.go(pathDef, params, queryParams);
    return true;
  }

  current() {
    const current = _helpers.clone(this._current);
    current.queryParams = EJSON.clone(current.queryParams);
    current.params = EJSON.clone(current.params);
    return current;
  }

  track(reactiveMapper) {
    return (props, onData, env) => {
      let trackerCleanup = null;
      const handler = Tracker.nonreactive(() => {
        return Tracker.autorun(() => {
          trackerCleanup = reactiveMapper(props, onData, env);
        });
      });

      return () => {
        if (typeof trackerCleanup === 'function') {
          trackerCleanup();
        }
        return handler.stop();
      };
    };
  }

  mapper(props, onData, env) {
    if (typeof onData === 'function') {
      onData(null, { route: this.current(), props, env });
    }
  }

  trackMapper() {
    return this.track(this.mapper);
  }

  subsReady() {
    let callback = null;
    const args = Array.from(arguments);

    if (typeof args[args.length - 1] === 'function') {
      callback = args.pop();
    }

    const currentRoute = this.current().route;
    const globalRoute = this._globalRoute;

    this._onEveryPath.depend();

    if (!currentRoute) {
      return false;
    }

    let subscriptions;
    if (args.length === 0) {
      subscriptions = Object.values(globalRoute.getAllSubscriptions());
      subscriptions = subscriptions.concat(Object.values(currentRoute.getAllSubscriptions()));
    } else {
      subscriptions = args.map((subName) => {
        return globalRoute.getSubscription(subName) || currentRoute.getSubscription(subName);
      });
    }

    const isReady = () => {
      return subscriptions.every((sub) => sub && sub.ready());
    };

    if (callback) {
      Tracker.autorun((c) => {
        if (isReady()) {
          callback();
          c.stop();
        }
      });
      return true;
    }
    return isReady();
  }

  withReplaceState(fn) {
    return this.env.replaceState.withValue(true, fn);
  }

  withTrailingSlash(fn) {
    return this.env.trailingSlash.withValue(true, fn);
  }

  initialize(options = {}) {
    if (this._initialized) {
      throw new Error('FlowRouter is already initialized');
    }

    if (options.maxWaitFor !== undefined) {
      this.maxWaitFor = options.maxWaitFor;
    }

    this._updateCallbacks();
    this._microRouter.base(this._basePath);
    this._microRouter.start({
      click: options.click !== undefined ? options.click : true,
      popstate: options.popstate !== undefined ? options.popstate : true,
      dispatch: true
    });

    this._initialized = true;
  }

  wait() {
    if (this._initialized) {
      throw new Error("can't wait after FlowRouter has been initialized");
    }
    this._askedToWait = true;
  }

  onRouteRegister(cb) {
    this._onRouteCallbacks.push(cb);
  }

  _triggerRouteRegister(currentRoute) {
    const routePublicApi = _helpers.pick(currentRoute, ['name', 'pathDef', 'path']);
    routePublicApi.options = _helpers.omit(currentRoute.options, [
      'triggersEnter', 'triggersExit', 'action', 'subscriptions', 'name'
    ]);

    this._onRouteCallbacks.forEach((cb) => {
      cb(routePublicApi);
    });
  }

  url() {
    return Meteor.absoluteUrl(
      this.path.apply(this, arguments).replace(
        new RegExp('^' + (`/${this._basePath || ''}/`).replace(/\/\/+/g, '/')),
        ''
      )
    );
  }

  _buildTracker() {
    const tracker = Tracker.autorun(() => {
      if (!this._current || !this._current.route) {
        return;
      }

      const currentContext = this._current;
      const route = currentContext.route;
      const path = currentContext.path;

      if (this.safeToRun === 0) {
        throw new Error("You can't use reactive data sources like Session inside the `.subscriptions` method!");
      }

      this._globalRoute.clearSubscriptions();
      this.subscriptions.call(this._globalRoute, path);
      route.callSubscriptions(currentContext);

      Tracker.nonreactive(() => {
        let isRouteChange = currentContext.oldRoute !== currentContext.route;
        if (!currentContext.oldRoute) {
          isRouteChange = false;
        }

        const oldestRoute = this._oldRouteChain[0];
        this._oldRouteChain = [];

        currentContext.route.registerRouteChange(currentContext, isRouteChange);
        route.callAction(currentContext);

        Tracker.afterFlush(() => {
          this._onEveryPath.changed();
          if (isRouteChange) {
            if (oldestRoute && oldestRoute.registerRouteClose) {
              oldestRoute.registerRouteClose();
            }
          }
        });
      });

      this.safeToRun--;
    });

    return tracker;
  }

  _invalidateTracker() {
    this.safeToRun++;
    this._tracker.invalidate();

    if (!Tracker.currentComputation) {
      try {
        Tracker.flush();
      } catch(ex) {
        if (!/Tracker\.flush while flushing/.test(ex.message)) {
          return;
        }

        Meteor.defer(() => {
          const path = this._nextPath;
          if (!path) {
            return;
          }
          delete this._nextPath;
          this.env.reload.withValue(true, () => {
            this.go(path);
          });
        });
      }
    }
  }

  _updateCallbacks() {
    this._microRouter.reset();
    let catchAll = null;

    this._routes.forEach((route) => {
      if (route.pathDef === '*') {
        catchAll = route;
      } else {
        this._microRouter.route(route.pathDef, route._actionHandle);
        this._microRouter.exit(route.pathDef, route._exitHandle);
      }
    });

    if (catchAll) {
      this._microRouter.route(catchAll.pathDef, catchAll._actionHandle);
    }
  }

  _initTriggersAPI() {
    const self = this;
    this.triggers = {
      enter(_triggers, filter) {
        let triggers = Triggers.applyFilters(_triggers, filter);
        if (triggers.length) {
          self._triggersEnter = self._triggersEnter.concat(triggers);
        }
      },
      exit(_triggers, filter) {
        let triggers = Triggers.applyFilters(_triggers, filter);
        if (triggers.length) {
          self._triggersExit = self._triggersExit.concat(triggers);
        }
      }
    };
  }
}

export default Router;
