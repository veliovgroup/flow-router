import { Meteor }       from 'meteor/meteor';
import { _helpers }     from './../lib/_helpers.js';
import { check, Match } from 'meteor/check';
import { ReactiveDict } from 'meteor/reactive-dict';

let Template;
if (Package.templating) {
  Template = Package.templating.Template;
}

const init = (FlowRouter) => {
  // Active Route
  // https://github.com/meteor-activeroute/legacy
  // zimme:active-route
  // License (MIT License): https://github.com/meteor-activeroute/legacy/blob/master/LICENSE.md
  // Lib
  const errorMessages = {
    noSupportedRouter: 'No supported router installed. Please install flow-router.',
    invalidRouteNameArgument: 'Invalid argument, must be String or RegExp.',
    invalidRouteParamsArgument: 'Invalid argument, must be Object.'
  };

  const checkRouteOrPath = (arg) => {
    try {
      return check(arg, Match.OneOf(RegExp, String));
    } catch (e) {
      throw new Error(errorMessages.invalidRouteNameArgument);
    }
  };

  const checkParams = (arg) => {
    try {
      return check(arg, Object);
    } catch (e) {
      throw new Error(errorMessages.invalidRouteParamsArgument);
    }
  };

  const config = new ReactiveDict('activeRouteConfig');
  config.setDefault({
    activeClass: 'active',
    caseSensitive: true,
    disabledClass: 'disabled'
  });

  const test = (_value, _pattern) => {
    let value = _value;
    let pattern = _pattern;
    if (!value) {
      return false;
    }

    if (Match.test(pattern, RegExp)) {
      return value.search(pattern) > -1;
    }

    if (Match.test(pattern, String)) {
      if (config.equals('caseSensitive', false)) {
        value = value.toLowerCase();
        pattern = pattern.toLowerCase();
      }
      return (value === pattern);
    }

    return false;
  };

  const ActiveRoute = {
    config() {
      return this.configure.apply(this, arguments);
    },
    configure(options) {
      if (!Meteor.isServer) {
        config.set(options);
      }
    },
    name(routeName, routeParams = {}) {
      if (Meteor.isServer) {
        return void 0;
      }
      checkRouteOrPath(routeName);
      checkParams(routeParams);

      let currentPath;
      let currentRouteName;
      let path;
      if (!_helpers.isEmpty(routeParams) && Match.test(routeName, String)) {
        FlowRouter.watchPathChange();
        currentPath = FlowRouter.current().path;
        path = FlowRouter.path(routeName, routeParams);
      } else {
        currentRouteName = FlowRouter.getRouteName();
      }
      return test(currentPath || currentRouteName, path || routeName);
    },
    path(path) {
      if (Meteor.isServer) {
        return void 0;
      }
      checkRouteOrPath(path);

      FlowRouter.watchPathChange();
      return test(FlowRouter.current().path, path);
    }
  };

  // Client
  const isActive = (type, inverse = false) => {
    let helperName;

    helperName = 'is';
    if (inverse) {
      helperName += 'Not';
    }
    helperName += 'Active' + type;

    return (_options = {}, _attributes = {}) => {
      let options    = (_helpers.isObject(_options)) ? (_options.hash || _options) : _options;
      let attributes = (_helpers.isObject(_attributes)) ? (_attributes.hash || _attributes) : _attributes;

      if (Match.test(options, String)) {
        if (config.equals('regex', true)) {
          options = {
            regex: options
          };
        } else if (type === 'Path') {
          options = {
            path: options
          };
        } else {
          options = {
            name: options
          };
        }
      }
      options = _helpers.extend(options, attributes);
      const pattern = Match.ObjectIncluding({
        class: Match.Optional(String),
        className: Match.Optional(String),
        regex: Match.Optional(Match.OneOf(RegExp, String)),
        name: Match.Optional(String),
        path: Match.Optional(String)
      });
      check(options, pattern);

      let regex     = options.regex;
      let name      = options.name;
      let path      = options.path;
      let className = options.class ? options.class : options.className;
      if (type === 'Path') {
        name = null;
      } else {
        path = null;
      }

      if (!(regex || name || path)) {
        const t = (type === 'Route' ? 'name' : type).toLowerCase();
        Meteor._debug(('Invalid argument, ' + helperName + ' takes "' + t + '", ') + (t + '="' + t + '" or regex="regex"'));
        return false;
      }

      if (Match.test(regex, String)) {
        if (config.equals('caseSensitive', false)) {
          regex = new RegExp(regex, 'i');
        } else {
          regex = new RegExp(regex);
        }
      }

      if (!_helpers.isRegExp(regex)) {
        regex = name || path;
      }

      if (inverse) {
        if (!_helpers.isString(className)) {
          className = config.get('disabledClass');
        }
      } else {
        if (!_helpers.isString(className)) {
          className = config.get('activeClass');
        }
      }

      let isPath;
      let result;
      if (type === 'Path') {
        isPath = true;
      }

      if (isPath) {
        result = ActiveRoute.path(regex);
      } else {
        options = _helpers.extend(attributes.data, attributes);
        result = ActiveRoute.name(regex, _helpers.omit(options, ['class', 'className', 'data', 'regex', 'name', 'path']));
      }

      if (inverse) {
        result = !result;
      }

      if (result) {
        return className;
      }
      return false;
    };
  };

  const arHelpers = {
    isActiveRoute: isActive('Route'),
    isActivePath: isActive('Path'),
    isNotActiveRoute: isActive('Route', true),
    isNotActivePath: isActive('Path', true)
  };

  // If blaze is in use, register global helpers
  if (Template) {
    for (const [name, helper] of Object.entries(arHelpers)) {
      Template.registerHelper(name, helper);
    }
  }

  // FlowRouter Helpers
  // arillo:flow-router-helpers
  // https://github.com/arillo/meteor-flow-router-helpers
  // License (MIT License): https://github.com/arillo/meteor-flow-router-helpers/blob/master/LICENCE
  const subsReady = (..._subs) => {
    let subs = _subs.slice(0, -1);
    if (subs.length === 1) {
      return FlowRouter.subsReady();
    }

    return subs.filter((memo, sub) => {
      if (_helpers.isString(sub)) {
        return memo && FlowRouter.subsReady(sub);
      }
    }, true);
  };

  const pathFor = (_path, _view = {hash: {}}) => {
    let path = _path;
    let view = _view;
    if (!path) {
      throw new Error('no path defined');
    }

    if (!view.hash) {
      view = {
        hash: view
      };
    }

    if (path.hash && path.hash.route) {
      view = path;
      path = view.hash.route;
      delete view.hash.route;
    }
    const query    = view.hash.query ? FlowRouter._qs.parse(view.hash.query) : {};
    const hashBang = view.hash.hash ? view.hash.hash : '';
    return FlowRouter.path(path, view.hash, query) + (hashBang ? '#' + hashBang : '');
  };

  const urlFor = (path, view) => {
    return Meteor.absoluteUrl(pathFor(path, view).substr(1));
  };

  const param = (name) => {
    return FlowRouter.getParam(name);
  };

  const queryParam = (key) => {
    return FlowRouter.getQueryParam(key);
  };

  const currentRouteName = () => {
    return FlowRouter.getRouteName();
  };

  const currentRouteOption = (optionName) => {
    return FlowRouter.current().route.options[optionName];
  };

  const isSubReady = (sub) => {
    if (sub) {
      return FlowRouter.subsReady(sub);
    }
    return FlowRouter.subsReady();
  };

  const frHelpers = {
    subsReady: subsReady,
    pathFor: pathFor,
    urlFor: urlFor,
    param: param,
    queryParam: queryParam,
    currentRouteName: currentRouteName,
    isSubReady: isSubReady,
    currentRouteOption: currentRouteOption
  };

  let FlowRouterHelpers;

  if (Meteor.isServer) {
    FlowRouterHelpers = {
      pathFor: pathFor,
      urlFor: urlFor
    };
  } else {
    FlowRouterHelpers = frHelpers;
    // If blaze is in use, register global helpers
    if (Template) {
      for (const [name, helper] of Object.entries(frHelpers)) {
        Template.registerHelper(name, helper);
      }
    }
  }

  return Object.assign({}, ActiveRoute, FlowRouterHelpers);
};

export default init;
