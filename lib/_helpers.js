import { Meteor } from 'meteor/meteor';

const _helpers = {
  isEmpty(obj) { // 1
    if (obj == null) {
      return true;
    }

    if (this.isArray(obj) || this.isString(obj) || this.isArguments(obj)) {
      return obj.length === 0;
    }

    return Object.keys(obj).length === 0;
  },
  isObject(obj) {
    const type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  },
  omit(obj, keys) { // 10
    if (!this.isObject(obj)) {
      Meteor._debug('[jessedev:flow-router-extra] [_helpers.omit] First argument must be an Object');
      return obj;
    }

    if (!this.isArray(keys)) {
      Meteor._debug('[jessedev:flow-router-extra] [_helpers.omit] Second argument must be an Array');
      return obj;
    }

    const copy = this.clone(obj);
    keys.forEach((key) => {
      delete copy[key];
    });

    return copy;
  },
  pick(obj, keys) { // 2
    if (!this.isObject(obj)) {
      Meteor._debug('[jessedev:flow-router-extra] [_helpers.omit] First argument must be an Object');
      return obj;
    }

    if (!this.isArray(keys)) {
      Meteor._debug('[jessedev:flow-router-extra] [_helpers.omit] Second argument must be an Array');
      return obj;
    }

    const picked = {};
    keys.forEach((key) => {
      picked[key] = obj[key];
    });

    return picked;
  },
  isArray(obj) {
    return Array.isArray(obj);
  },
  extend(...objs) { // 4
    return Object.assign({}, ...objs);
  },
  clone(obj) {
    if (!this.isObject(obj)) return obj;
    return this.isArray(obj) ? obj.slice() : this.extend(obj);
  }
};

['Arguments', 'Function', 'String', 'RegExp'].forEach((name) => {
  _helpers['is' + name] = function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + name + ']';
  };
});

export { _helpers };
