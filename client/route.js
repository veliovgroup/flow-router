import { Router }       from './_init.js';
import { Meteor }       from 'meteor/meteor';
import { Promise }      from 'meteor/promise';
import { Tracker }      from 'meteor/tracker';
import { _helpers }     from './../lib/_helpers.js';
import { ReactiveDict } from 'meteor/reactive-dict';

const makeTriggers = (triggers) => {
  if (_helpers.isFunction(triggers)) {
    return [triggers];
  } else if (!_helpers.isArray(triggers)) {
    return [];
  }

  return triggers;
};

class Route {
  constructor(router = new Router(), pathDef, options = {}, group) {
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
    this._waitFor         = _helpers.isArray(options.waitFor) ? options.waitFor : [];
    this._subsMap         = {};
    this._onNoData        = options.onNoData || null;
    this._endWaiting      = options.endWaiting || null;
    this._currentData     = null;
    this._triggersExit    = options.triggersExit ? makeTriggers(options.triggersExit) : [];
    this._whileWaiting    = options.whileWaiting || null;
    this._triggersEnter   = options.triggersEnter ? makeTriggers(options.triggersEnter) : [];
    this._subscriptions   = options.subscriptions || Function.prototype;
    this._waitOnResources = options.waitOnResources || null;

    this._params          = new ReactiveDict();
    this._queryParams     = new ReactiveDict();
    this._routeCloseDep   = new Tracker.Dependency();
    this._pathChangeDep   = new Tracker.Dependency();

    if (options.name) {
      this.name = options.name;
    }
  }

  clearSubscriptions() {
    this._subsMap = {};
  }

  register(name, sub) {
    this._subsMap[name] = sub;
  }

  getSubscription(name) {
    return this._subsMap[name];
  }

  getAllSubscriptions() {
    return this._subsMap;
  }

  checkSubscriptions(subscriptions) {
    const results = [];
    for (let i = 0; i < subscriptions.length; i++) {
      results.push((subscriptions[i] && subscriptions[i].ready) ? subscriptions[i].ready() : false);
    }

    return !results.includes(false);
  }

  waitOn(current = {}, next) {
    let _data         = null;
    let _isWaiting    = false;
    let _preloaded    = 0;
    let _resources    = false;
    let waitFor       = [];
    let promises      = [];
    let subscriptions = [];
    let timer;
    let trackers      = [];

    const placeIn = (d) => {
      if (Object.prototype.toString.call(d) === '[object Promise]' || d.then && Object.prototype.toString.call(d.then) === '[object Function]') {
        promises.push(d);
      } else if (d.flush) {
        trackers.push(d);
      } else if (d.ready) {
        subscriptions.push(d);
      }
    };

    const whileWaitingAction = () => {
      if (!_isWaiting) {
        this._whileWaiting && this._whileWaiting(current.params, current.queryParams);
        _isWaiting = true;
      }
    };

    const subWait = (delay) => {
      timer = Meteor.setTimeout(() => {
        if (this.checkSubscriptions(subscriptions)) {
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

    const wait = (delay) => {
      if (promises.length) {
        Promise.all(promises).then(() => {
          subWait(delay);
          promises = [];
        });
      } else {
        subWait(delay);
      }
    };

    const processSubData = (subData) => {
      if (subData instanceof Array) {
        for (let i = subData.length - 1; i >= 0; i--) {
          if (subData[i] !== null && typeof subData[i] === 'object') {
            placeIn(subData[i]);
          }
        }
      } else if (subData !== null && typeof subData === 'object') {
        placeIn(subData);
      }
    };

    const stopSubs = () => {
      for (let i = subscriptions.length - 1; i >= 0; i--) {
        if (subscriptions[i].stop) {
          subscriptions[i].stop();
        }
        delete subscriptions[i];
      }
      subscriptions = [];
    };

    const done = (subscription) => {
      processSubData(_helpers.isFunction(subscription) ? subscription() : subscription);
    };

    if (current.route.globals.length) {
      for (let i = 0; i < current.route.globals.length; i++) {
        if (typeof current.route.globals[i] === 'object') {
          if (current.route.globals[i].waitOnResources) {
            if (!_resources) { _resources = []; }
            _resources.push(current.route.globals[i].waitOnResources);
          }

          if (current.route.globals[i].waitOn && _helpers.isFunction(current.route.globals[i].waitOn)) {
            waitFor.unshift(current.route.globals[i].waitOn);
          }
        }
      }
    }

    if (this._waitOnResources) {
      if (!_resources) { _resources = []; }
      _resources.push(this._waitOnResources);
    }

    const preload = (len, __data) => {
      _preloaded++;
      if (_preloaded >= len) {
        next(current, __data);
      }
    };

    const getData = () => {
      if (this._data) {
        if (!_data) {
          _data = this._currentData = this._data(current.params, current.queryParams);
        } else {
          _data = this._currentData;
        }
      }
      return _data;
    };

    const getResources = () => {
      _data      = getData();
      let len    = 0;
      let items;
      let images = [];
      let other  = [];
      for (let i = _resources.length - 1; i >= 0; i--) {
        items = _resources[i].call(this, current.params, current.queryParams, _data);
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
        if (other && other.length && typeof XMLHttpRequest !== 'undefined') {
          other = other.filter((elem, index, self) => {
            return index === self.indexOf(elem);
          });
          len += other.length;
          const prefetch = {};
          for (let k = other.length - 1; k >= 0; k--) {
            prefetch[k] = new XMLHttpRequest();
            prefetch[k].onload  = () => { preload(len, _data); };
            prefetch[k].onerror = () => { preload(len, _data); };
            prefetch[k].open('GET', other[k]);
            prefetch[k].send(null);
          }
        }

        if (images && images.length){
          images = images.filter((elem, index, self) => {
            return index === self.indexOf(elem);
          });
          len += images.length;
          const imgs = {};
          for (let j = images.length - 1; j >= 0; j--) {
            imgs[j]         = new Image();
            imgs[j].onload  = () => { preload(len, _data); };
            imgs[j].onerror = () => { preload(len, _data); };
            imgs[j].src     = images[j];
          }
        }
      } else {
        next(current, _data);
      }
    };

    if (this._waitFor.length) {
      waitFor = waitFor.concat(this._waitFor);
    }

    if (_helpers.isFunction(this._waitOn)) {
      waitFor.push(this._waitOn);
    }

    if (waitFor.length) {
      waitFor.forEach((wo) => {
        processSubData(wo.call(this, current.params, current.queryParams, done));
      });

      let triggerExitIndex = this._triggersExit.push(() => {
        stopSubs();
        for (let i = trackers.length - 1; i >= 0; i--) {
          if (trackers[i].stop) {
            trackers[i].stop();
          }
          delete trackers[i];
        }
        trackers = [];
        promises = [];
        subscriptions = [];
        _data = this._currentData = null;
        this._triggersExit.splice(triggerExitIndex - 1, 1);
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
  }

  callAction(current) {
    if (this._data) {
      if (this._onNoData && !this._currentData) {
        this._endWaiting && this._endWaiting();
        this._onNoData(current.params, current.queryParams);
      } else {
        this._endWaiting && this._endWaiting();
        this._action(current.params, current.queryParams, this._currentData);
      }
    } else {
      this._endWaiting && this._endWaiting();
      this._action(current.params, current.queryParams, this._currentData);
    }
  }

  callSubscriptions(current) {
    this.clearSubscriptions();
    if (this.group) {
      this.group.callSubscriptions(current);
    }

    this._subscriptions(current.params, current.queryParams);
  }

  getRouteName() {
    this._routeCloseDep.depend();
    return this.name;
  }

  getParam(key) {
    this._routeCloseDep.depend();
    return this._params.get(key);
  }

  getQueryParam(key) {
    this._routeCloseDep.depend();
    return this._queryParams.get(key);
  }

  watchPathChange() {
    this._pathChangeDep.depend();
  }

  registerRouteClose() {
    this._params = new ReactiveDict();
    this._queryParams = new ReactiveDict();
    this._routeCloseDep.changed();
    this._pathChangeDep.changed();
  }

  registerRouteChange(currentContext, routeChanging) {
    // register params
    this._updateReactiveDict(this._params, currentContext.params);

    // register query params
    this._updateReactiveDict(this._queryParams, currentContext.queryParams);

    // if the route is changing, we need to defer triggering path changing
    // if we did this, old route's path watchers will detect this
    // Real issue is, above watcher will get removed with the new route
    // So, we don't need to trigger it now
    // We are doing it on the route close event. So, if they exists they'll
    // get notify that
    if(!routeChanging) {
      this._pathChangeDep.changed();
    }
  }

  _updateReactiveDict(dict, newValues) {
    const currentKeys = Object.keys(newValues);
    const oldKeys = Object.keys(dict.keyDeps);

    // set new values
    //  params is an array. So, currentKeys.forEach() does not works
    //  to iterate params
    currentKeys.forEach((key) => {
      dict.set(key, newValues[key]);
    });

    // remove keys which does not exisits here
    oldKeys.filter((i) => {
      return currentKeys.indexOf(i) < 0;
    }).forEach((key) => {
      dict.set(key, undefined);
    });
  }
}

export default Route;
