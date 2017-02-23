const makeTriggers = (base, triggers) => {
  if (triggers) {
    if (!_.isArray(triggers)) {
      triggers = [triggers];
    }
  } else {
    triggers = [];
  }

  return (base || []).concat(triggers);
};

Group = function(router, options = {}, parent) {
  if (options.prefix && !/^\/.*/.test(options.prefix)) {
    throw new Error('group\'s prefix must start with "/"');
  }

  this._router = router;
  this.prefix = options.prefix || '';
  this.name = options.name;
  this.options = options;

  this._triggersEnter = makeTriggers(this._triggersEnter, options.triggersEnter);
  this._triggersExit = makeTriggers(this._triggersExit, options.triggersExit);

  this._subscriptions = options.subscriptions || Function.prototype;

  this.parent = parent;
  if (this.parent) {
    this.prefix = parent.prefix + this.prefix;

    this._triggersEnter = makeTriggers(this._triggersEnter, parent.triggersEnter);
    this._triggersExit = makeTriggers(this._triggersExit, parent.triggersExit);
  }
};

Group.prototype.route = function(pathDef, options = {}, group) {
  if (!/^\/.*/.test(pathDef)) {
    throw new Error('route\'s path must start with "/"');
  }

  group = group || this;
  pathDef = this.prefix + pathDef;

  options.triggersEnter = makeTriggers(this._triggersEnter, options.triggersEnter);
  options.triggersExit = makeTriggers(this._triggersExit, options.triggersExit);

  return this._router.route(pathDef, options, group);
};

Group.prototype.group = function(options) {
  return new Group(this._router, options, this);
};

Group.prototype.callSubscriptions = function(current) {
  if (this.parent) {
    this.parent.callSubscriptions(current);
  }

  this._subscriptions.call(current.route, current.params, current.queryParams);
};
