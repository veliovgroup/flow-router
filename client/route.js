Route = function(router, pathDef, options, group) {
  options = options || {};

  this.options = options;
  this.pathDef = pathDef;

  // Route.path is deprecated and will be removed in 3.0
  this.path = pathDef;

  if (options.name) {
    this.name = options.name;
  }

  this._action = options.action || Function.prototype;
  this._waitOn = options.waitOn || null;
  this._whileWaiting = options.whileWaiting || null;
  this._data = options.data || null;
  this._onNoData = options.onNoData || null;
  this._currentData = undefined;
  this._subscriptions = options.subscriptions || Function.prototype;
  this._triggersEnter = options.triggersEnter || [];
  this._triggersExit = options.triggersExit || [];
  this._subsMap = {};
  this._router = router;

  this._params = new ReactiveDict();
  this._queryParams = new ReactiveDict();
  this._routeCloseDep = new Tracker.Dependency();

  // tracks the changes in the URL
  this._pathChangeDep = new Tracker.Dependency();

  this.group = group;
};

Route.prototype.clearSubscriptions = function() {
  this._subsMap = {};
};

Route.prototype.register = function(name, sub, options) {
  this._subsMap[name] = sub;
};


Route.prototype.getSubscription = function(name) {
  return this._subsMap[name];
};


Route.prototype.getAllSubscriptions = function() {
  return this._subsMap;
};

Route.prototype.checkSubscriptions = function(subscriptions) {
  var i, len, results = [];
  for (i = 0, len = subscriptions.length; i < len; i++) {
    subscription = subscriptions[i];
    results.push(subscription != null ? subscription.ready() : false);
  }

  return !~results.indexOf(false);
};

Route.prototype.waitOn = function(current, next) {
  var self = this, subscriptions, timer, _data;
  if (self._waitOn) {
    if (!current) { current = {}; }
    self._whileWaiting && self._whileWaiting(current.params, current.queryParams);
    subscriptions = self._waitOn(current.params, current.queryParams);
    timer = Meteor.setInterval(function(){
      if (self.checkSubscriptions(subscriptions)) {
        Meteor.clearInterval(timer);
        if (self._data) {
          _data = self._data(current.params, current.queryParams);
          if (_data) {
            self._currentData = _.clone(_data);
          }
        }
        next(current, _data);
      }
    }, 25);
  } else {
    next(current);
  }
};

Route.prototype.callAction = function(current) {
  var self = this;
  if (self._waitOn) {
    self.waitOn(current, function(current, data){
      if (self._onNoData && !data) {
        self._onNoData(current.params, current.queryParams);
      } else {
        self._action(current.params, current.queryParams, data);
      }
    });

  } else {
    self._action(current.params, current.queryParams);
  }
};

Route.prototype.callSubscriptions = function(current) {
  this.clearSubscriptions();
  if (this.group) {
    this.group.callSubscriptions(current);
  }

  this._subscriptions(current.params, current.queryParams);
};

Route.prototype.getRouteName = function() {
  this._routeCloseDep.depend();
  return this.name;
};

Route.prototype.getParam = function(key) {
  this._routeCloseDep.depend();
  return this._params.get(key);
};

Route.prototype.getQueryParam = function(key) {
  this._routeCloseDep.depend();
  return this._queryParams.get(key);
};

Route.prototype.watchPathChange = function() {
  this._pathChangeDep.depend();
};

Route.prototype.registerRouteClose = function() {
  this._params = new ReactiveDict();
  this._queryParams = new ReactiveDict();
  this._routeCloseDep.changed();
  this._pathChangeDep.changed();
};

Route.prototype.registerRouteChange = function(currentContext, routeChanging) {
  // register params
  var params = currentContext.params;
  this._updateReactiveDict(this._params, params);

  // register query params
  var queryParams = currentContext.queryParams;
  this._updateReactiveDict(this._queryParams, queryParams);

  // if the route is changing, we need to defer triggering path changing
  // if we did this, old route's path watchers will detect this
  // Real issue is, above watcher will get removed with the new route
  // So, we don't need to trigger it now
  // We are doing it on the route close event. So, if they exists they'll 
  // get notify that
  if(!routeChanging) {
    this._pathChangeDep.changed();
  }
};

Route.prototype._updateReactiveDict = function(dict, newValues) {
  var currentKeys = _.keys(newValues);
  var oldKeys = _.keys(dict.keyDeps);

  // set new values
  //  params is an array. So, _.each(params) does not works
  //  to iterate params
  _.each(currentKeys, function(key) {
    dict.set(key, newValues[key]);
  });

  // remove keys which does not exisits here
  var removedKeys = _.difference(oldKeys, currentKeys);
  _.each(removedKeys, function(key) {
    dict.set(key, undefined);
  });
};
