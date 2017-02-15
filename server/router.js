const Qs = require('qs');
const pathRegExp = /(:[\w\(\)\\\+\*\.\?]+)+/g;

Router = function () {
  this._routes = [];
  this._routesMap = {};
  this.subscriptions = Function.prototype;

  // holds onRoute callbacks
  this._onRouteCallbacks = [];
};

Router.prototype.route = function(pathDef, options = {}) {
  if (!/^\/.*/.test(pathDef)) {
    throw new Error('route\'s path must start with "/"');
  }

  const route = new Route(this, pathDef, options);
  this._routes.push(route);

  if (options.name) {
    this._routesMap[options.name] = route;
  }

  this._triggerRouteRegister(route);
  return route;
};

Router.prototype.group = function(options) {
  return new Group(this, options);
};

Router.prototype.path = function(pathDef, fields = {}, queryParams) {
  if (this._routesMap[pathDef]) {
    pathDef = this._routesMap[pathDef].path;
  }

  let path = pathDef.replace(pathRegExp, (key) => {
    const firstRegexpChar = key.indexOf('(');
    // get the content behind : and (\\d+/)
    key = key.substring(1, (firstRegexpChar > 0) ? firstRegexpChar : undefined);
    // remove +?*
    key = key.replace(/[\+\*\?]+/g, '');

    return fields[key] || '';
  });

  path = path.replace(/\/\/+/g, '/'); // Replace multiple slashes with single slash

  // remove trailing slash
  // but keep the root slash if it's the only one
  path = path.match(/^\/{1}$/) ? path : path.replace(/\/$/, '');

  const strQueryParams = Qs.stringify(queryParams || {});
  if(strQueryParams) {
    path += '?' + strQueryParams;
  }

  return path;
};

Router.prototype.onRouteRegister = function(cb) {
  this._onRouteCallbacks.push(cb);
};

Router.prototype._triggerRouteRegister = function(currentRoute) {
  // We should only need to send a safe set of fields on the route
  // object.
  // This is not to hide what's inside the route object, but to show
  // these are the public APIs
  const routePublicApi = _.pick(currentRoute, 'name', 'pathDef', 'path');
  routePublicApi.options = _.omit(currentRoute.options, ['triggersEnter', 'triggersExit', 'action', 'subscriptions', 'name']);

  _.each(this._onRouteCallbacks, function(cb) {
    cb(routePublicApi);
  });
};


Router.prototype.go = function() {
  // client only
};


Router.prototype.current = function() {
  // client only
};


Router.prototype.triggers = {
  enter() {
    // client only
  },
  exit() {
    // client only
  }
};

Router.prototype.middleware = function() {
  // client only
};


Router.prototype.getState = function() {
  // client only
};


Router.prototype.getAllStates = function() {
  // client only
};


Router.prototype.setState = function() {
  // client only
};


Router.prototype.removeState = function() {
  // client only
};


Router.prototype.clearStates = function() {
  // client only
};


Router.prototype.ready = function() {
  // client only
};


Router.prototype.initialize = function() {
  // client only
};

Router.prototype.wait = function() {
  // client only
};
