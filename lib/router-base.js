import { Meteor }   from 'meteor/meteor';
import { _helpers } from './_helpers.js';
import { qs } from './qs.js';

class RouterBase {
  constructor() {
    this.pathRegExp   = /(:[\w\(\)\\\+\*\.\?\[\]\-]+)+/g;
    this.queryRegExp  = /\?([^\/\r\n].*)/;
    this.globals      = [];
    this._routes      = [];
    this._routesMap   = {};
    this._current     = {};
    this._specialChars = ['/', '%', '+'];
    this._encodeParam = (param) => {
      const paramArr = param.split('');
      let _param = '';
      for (let i = 0; i < paramArr.length; i++) {
        if (this._specialChars.includes(paramArr[i])) {
          _param += encodeURIComponent(encodeURIComponent(paramArr[i]));
        } else {
          try {
            _param += encodeURIComponent(paramArr[i]);
          } catch (_e) {
            _param += paramArr[i];
          }
        }
      }
      return _param;
    };

    this.subscriptions    = Function.prototype;
    this._onRouteCallbacks = [];

    this.triggers = {
      enter() { /* client only */ },
      exit()  { /* client only */ }
    };
  }

  path(_pathDef, fields = {}, _queryParams = {}) {
    let pathDef    = _pathDef || '';
    let queryParams = _queryParams;

    if (this._routesMap[pathDef]) {
      pathDef = _helpers.clone(this._routesMap[pathDef].pathDef);
    }

    if (this.queryRegExp.test(pathDef)) {
      const pathDefParts = pathDef.split(this.queryRegExp);
      pathDef = pathDefParts[0];
      if (pathDefParts[1]) {
        queryParams = qs.merge(qs.parse(pathDefParts[1]), queryParams);
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
        return this._encodeParam(`${fields[key]}`);
      }
      return '';
    });

    path = path.replace(/\/\/+/g, '/');
    path = path.match(/^\/{1}$/) ? path : path.replace(/\/$/, '');

    if (this.env && this.env.trailingSlash && this.env.trailingSlash.get() && path[path.length - 1] !== '/') {
      path += '/';
    }

    const strQueryParams = qs.stringify(queryParams || {});
    if (strQueryParams) {
      path += `?${strQueryParams}`;
    }

    path = path.replace(/\/\/+/g, '/');
    return path;
  }

  url() {
    return Meteor.absoluteUrl(
      this.path.apply(this, arguments).replace(
        new RegExp('^' + (`/${this._basePath || ''}/`).replace(/\/\/+/g, '/')),
        ''
      )
    );
  }

  group(options) {
    const GroupClass = this._getGroupClass();
    return new GroupClass(this, options);
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

  // Subclasses must implement
  _getGroupClass() {
    throw new Error('Subclass must implement _getGroupClass()');
  }

  // Client-only stubs
  go()             {}
  setParams()      {}
  setQueryParams() {}
  initialize()     {}
  wait()           {}
  getRouteName()   {}
  getParam()       {}
  getQueryParam()  {}
  watchPathChange() {}

  current() {
    return this._current;
  }
}

export { RouterBase, qs };
