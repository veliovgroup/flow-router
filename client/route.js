Route = function(router, pathDef, options, group) {
  options = options || {};

  this.options = options;
  this.globals = router.globals;
  this.render  = router.Renderer.render.bind(router.Renderer);
  this.pathDef = pathDef;

  // Route.path is deprecated and will be removed in 3.0
  this.path = pathDef;

  if (options.name) {
    this.name = options.name;
  }

  this._action = options.action || Function.prototype;
  this._waitOn = options.waitOn || null;
  this._waitOnResources = options.waitOnResources || null;
  this._whileWaiting = options.whileWaiting || null;
  this._data = options.data || null;
  this._onNoData = options.onNoData || null;
  this._currentData = null;
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
  var self = this, subscriptions, timer, _data, _preloaded = 0, _isWaiting = false, _resources = false;

  if (current.route.globals.length) {
    for (var i = 0, len = current.route.globals.length; i < len; i++) {
      var option = current.route.globals[i];
      if (typeof option === 'object' && option.waitOnResources) {
        if (!_resources) { _resources = []; }
        _resources.push(option.waitOnResources);
      }
    }
  }

  if (self._waitOnResources) {
    if (!_resources) { _resources = []; }
    _resources.push(self._waitOnResources);
  }

  var preload = function (items, _data) {
    _preloaded++;
    if (_preloaded >= items.length) {
      next(current, _data);
    }
  };

  var getResources = function () {
    _data = getData();
    var res = [];
    for (var i = _resources.length - 1; i >= 0; i--) {
      var items = _resources[i](current.params, current.queryParams, _data);
      if (items && items.images && items.images.length) {
        res = res.concat(items.images);
      }
    }

    if (res && res.length){
      res = res.filter(function(elem, index, self) {
        return index == self.indexOf(elem);
      });

      var imgs = {};
      for (var j = res.length - 1; j >= 0; j--) {
        imgs[j]         = new Image();
        imgs[j].onload  = function () { preload(res, _data);};
        imgs[j].onerror = function () { preload(res, _data);};
        imgs[j].src     = res[j];
      }
    } else {
      next(current, _data);
    }
  };

  var getData = function () {
    if (self._data) {
      if (!_data) {
        _data = self._currentData = self._data(current.params, current.queryParams);
      } else {
        _data = self._currentData;
      }
    }
    return _data;
  };

  var whileWaitingAction = function () {
    if (!_isWaiting) {
      self._whileWaiting && self._whileWaiting(current.params, current.queryParams);
      _isWaiting = true;
    }
  };

  if (this._waitOn) {
    var wait = function (delay) {
      timer = Meteor.setTimeout(function(){
        if (self.checkSubscriptions(subscriptions)) {
          Meteor.clearTimeout(timer);
          _data = getData();

          if (_resources) {
            whileWaitingAction();
            getResources();
          } else {
            next(current, _data);
          }
        } else {
          wait(25);
        }
      }, delay);
    };

    if (!current) { current = {}; }
    subscriptions = this._waitOn(current.params, current.queryParams);

    this._triggersExit.push(function () {
      for (var i = subscriptions.length - 1; i >= 0; i--) {
        if (subscriptions[i].stop) {
          subscriptions[i].stop();
        }
      }
    });

    if (!this.checkSubscriptions(subscriptions)) {
      whileWaitingAction();
    }
    wait(0);
  } else if (_resources) {
    whileWaitingAction();
    getResources();
  } else if (this._data) {
    next(current, getData());
  } else {
    next(current);
  }
};

Route.prototype.callAction = function(current) {
  if (this._data) {
    if (this._onNoData && !this._currentData) {
      this._onNoData(current.params, current.queryParams);
    } else {
      this._action(current.params, current.queryParams, this._currentData);
    }
  } else {
    this._action(current.params, current.queryParams, this._currentData);
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
