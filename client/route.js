Route = function(router, pathDef, options, group) {
  options               = options || {};
  this.render           = router.Renderer.render.bind(router.Renderer);
  this.options          = options;
  this.globals          = router.globals;
  this.pathDef          = pathDef;

  // Route.path is deprecated and will be removed in 3.0
  this.path             = pathDef;
  this.conf             = options.conf || {};
  this.group            = group;
  this._data            = options.data || null;
  this._router          = router;
  this._action          = options.action || Function.prototype;
  this._waitOn          = options.waitOn || null;
  this._subsMap         = {};
  this._onNoData        = options.onNoData || null;
  this._currentData     = null;
  this._triggersExit    = options.triggersExit || [];
  this._whileWaiting    = options.whileWaiting || null;
  this._triggersEnter   = options.triggersEnter || [];
  this._subscriptions   = options.subscriptions || Function.prototype;
  this._waitOnResources = options.waitOnResources || null;

  this._params          = new ReactiveDict();
  this._queryParams     = new ReactiveDict();
  this._routeCloseDep   = new Tracker.Dependency();
  this._pathChangeDep   = new Tracker.Dependency();

  if (options.name) {
    this.name = options.name;
  }
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
  var self = this, subscriptions = [], trackers = [], timer, _data = null, _preloaded = 0, _isWaiting = false, _resources = false;

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

  var preload = function (len, _data) {
    _preloaded++;
    if (_preloaded >= len) {
      next(current, _data);
    }
  };

  var getResources = function () {
    _data = getData();
    var len    = 0;
    var res    = [];
    var images = [];
    var other  = [];
    for (var i = _resources.length - 1; i >= 0; i--) {
      var items = _resources[i].call(self, current.params, current.queryParams, _data);
      if (items) {
        if (items.images && items.images.length) {
          images = images.concat(items.images);
        }
        if (items.other && items.other.length) {
          other = other.concat(items.other);
        }
      }
    }

    if ((other && other.length) || (images && images.length)) {
      if (other && other.length && typeof XMLHttpRequest != 'undefined') {
        other = other.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        });
        len += other.length;
        var prefetch = {};
        for (var k = other.length - 1; k >= 0; k--) {
          prefetch[k] = new XMLHttpRequest();
          prefetch[k].onload  = function () { preload(len, _data); };
          prefetch[k].onerror = function () { preload(len, _data); };
          prefetch[k].open('GET', other[k]);
          prefetch[k].send(null);
        }
      }

      if (images && images.length){
        images = images.filter(function(elem, index, self) {
          return index == self.indexOf(elem);
        });
        len += images.length;
        var imgs = {};
        for (var j = images.length - 1; j >= 0; j--) {
          imgs[j]         = new Image();
          imgs[j].onload  = function () { preload(len, _data); };
          imgs[j].onerror = function () { preload(len, _data); };
          imgs[j].src     = images[j];
        }
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
    var processSubData = function (subData) {
      var placeIn = function (d) {
         if (d.flush) {
            trackers.push(d);
          } else if (d.ready) {
            subscriptions.push(d);
          }
      };

      if (subData instanceof Array) {
        for (var i = subData.length - 1; i >= 0; i--) {
          if (subData[i] !== null && typeof subData[i] === 'object') {
            placeIn(subData[i]);
          }
        }
      } else if (subData !== null && typeof subData === 'object') {
        placeIn(subData);
      }
    };

    var stopSubs = function () {
      for (var i = subscriptions.length - 1; i >= 0; i--) {
        if (subscriptions[i].stop) {
          subscriptions[i].stop();
        }
      }
      subscriptions = [];
    };

    var done = function (subscribtion) {
      processSubData(subscribtion());
    };

    processSubData(this._waitOn(current.params, current.queryParams, done));

    this._triggersExit.push(function () {
      stopSubs();
      for (var i = trackers.length - 1; i >= 0; i--) {
        if (trackers[i].stop) {
          trackers[i].stop();
        }
      }
      trackers = [];
      _data = self._currentData = null;
    });

    whileWaitingAction();
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
