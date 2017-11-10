import { _ } from 'meteor/underscore';

const makeTrigger = (trigger) => {
  if (_.isFunction(trigger)) {
    return [trigger];
  } else if (!_.isArray(trigger)) {
    return [];
  }

  return trigger;
};

const makeWaitFor = (func) => {
  if (_.isFunction(func)) {
    return [func];
  }

  return [];
};

const makeTriggers = (_base, _triggers) => {
  if (!_base && !_triggers) {
    return [];
  }
  return makeTrigger(_base).concat(makeTrigger(_triggers));
};

class Group {
  constructor(router, options = {}, parent) {
    if (options.prefix && !/^\//.test(options.prefix)) {
      throw new Error('group\'s prefix must start with "/"');
    }

    this._waitFor = makeWaitFor(options.waitOn);
    this._router  = router;
    this.prefix   = options.prefix || '';
    this.name     = options.name;
    this.options  = options;

    this._triggersEnter = makeTriggers(options.triggersEnter, this._triggersEnter);
    this._triggersExit  = makeTriggers(this._triggersExit, options.triggersExit);

    this._subscriptions = options.subscriptions || Function.prototype;

    this.parent = parent;
    if (this.parent) {
      this.prefix = parent.prefix + this.prefix;
      this._triggersEnter = makeTriggers(parent._triggersEnter, this._triggersEnter);
      this._triggersExit  = makeTriggers(this._triggersExit, parent._triggersExit);
      this._waitFor       = this.parent._waitFor.concat(this._waitFor);
    }
  }

  route(_pathDef, options = {}, _group) {
    if (!/^\//.test(_pathDef)) {
      throw new Error('route\'s path must start with "/"');
    }

    const group   = _group || this;
    const pathDef = this.prefix + _pathDef;

    options.triggersEnter = makeTriggers(this._triggersEnter, options.triggersEnter);
    options.triggersExit  = makeTriggers(options.triggersExit, this._triggersExit);
    options.waitFor       = this._waitFor.concat([]);
    return this._router.route(pathDef, _.extend(_.omit(this.options, 'triggersEnter', 'triggersExit', 'subscriptions', 'prefix', 'waitOn', 'name', 'title', 'titlePrefix', 'link', 'script', 'meta'), options), group);
  }

  group(options) {
    return new Group(this._router, options, this);
  }

  callSubscriptions(current) {
    if (this.parent) {
      this.parent.callSubscriptions(current);
    }

    this._subscriptions.call(current.route, current.params, current.queryParams);
  }
}

export default Group;
