import { _ } from 'meteor/underscore';

const makeTriggers = (base, _triggers) => {
  let triggers = _triggers || [];
  if (triggers) {
    if (!_.isArray(triggers)) {
      triggers = [triggers];
    }
  }

  return (base || []).concat(triggers);
};

class Group {
  constructor(router, options = {}, parent) {
    if (options.prefix && !/^\/.*/.test(options.prefix)) {
      throw new Error('group\'s prefix must start with "/"');
    }

    this._router = router;
    this.prefix = options.prefix || '';
    this.name = options.name;
    this.options = options;

    this._triggersEnter = makeTriggers(this._triggersEnter, options.triggersEnter);
    this._triggersExit = makeTriggers(this._triggersExit, options.triggersExit);

    this.parent = parent;
    if (this.parent) {
      this.prefix = parent.prefix + this.prefix;

      this._triggersEnter = makeTriggers(this._triggersEnter, parent.triggersEnter);
      this._triggersExit = makeTriggers(this._triggersExit, parent.triggersExit);
    }
  }

  route(_pathDef, options = {}, _group) {
    if (!/^\/.*/.test(_pathDef)) {
      throw new Error('route\'s path must start with "/"');
    }

    const group = _group || this;
    const pathDef = this.prefix + _pathDef;

    options.triggersEnter = makeTriggers(this._triggersEnter, options.triggersEnter);
    options.triggersExit = makeTriggers(this._triggersExit, options.triggersExit);

    return this._router.route(pathDef, options, group);
  }

  group(options) {
    const group = new Group(this._router, options, this);
    group.parent = this;

    return group;
  }
}

export default Group;
