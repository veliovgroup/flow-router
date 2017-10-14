import { Meteor }       from 'meteor/meteor';
import { _ }            from 'meteor/underscore';
import { Template }     from 'meteor/templating';
import { check, Match } from 'meteor/check';
import { ReactiveDict } from 'meteor/reactive-dict';

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

  const test = (value, pattern) => {
    let result;
    if (!value) {
      return false;
    }
    if (Match.test(pattern, RegExp)) {
      result = value.search(pattern);
      result = result > -1;
    } else if (Match.test(pattern, String)) {
      if (config.equals('caseSensitive', false)) {
        value = value.toLowerCase();
        pattern = pattern.toLowerCase();
      }
      result = (value === pattern);
    }
    return (result != null) ? result : false;
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
      if (!_.isEmpty(routeParams) && Match.test(routeName, String)) {
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

    return (options = {}, attributes = {}) => {
      options    = (_.isObject(options)) ? (options.hash || options) : options;
      attributes = (_.isObject(attributes)) ? (attributes.hash || attributes) : attributes;

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
      options = _.defaults(attributes, options);
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

      if (regex == null) {
        regex = name || path;
      }

      if (inverse) {
        if (className == null) {
          className = config.get('disabledClass');
        }
      } else {
        if (className == null) {
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
        options = _.defaults(attributes, attributes.data);
        result = ActiveRoute.name(regex, _.omit(options, ['class', 'className', 'data', 'regex', 'name', 'path']));
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

  for (let name in arHelpers) {
    Template.registerHelper(name, arHelpers[name]);
  }

  // FlowRouter Helpers
  // arillo:flow-router-helpers
  // https://github.com/arillo/meteor-flow-router-helpers
  // License (MIT License): https://github.com/arillo/meteor-flow-router-helpers/blob/master/LICENCE
  const subsReady = (...subs) => {
    subs = subs.slice(0, -1);
    if (subs.length === 1) {
      return FlowRouter.subsReady();
    }

    return _.reduce(subs, (memo, sub) => {
      if (_.isString(sub)) {
        return memo && FlowRouter.subsReady(sub);
      }
    }, true);
  };

  const pathFor = (path, view = {hash: {}}) => {
    if (!path) {
      throw new Error('no path defined');
    }

    if (!view.hash) {
      view = {
        hash: view
      };
    }

    if (path.hash && path.hash.route != null) {
      view = path;
      path = view.hash.route;
      delete view.hash.route;
    }
    const query = view.hash.query ? FlowRouter._qs.parse(view.hash.query) : {};
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
    for (let name in frHelpers) {
      Template.registerHelper(name, frHelpers[name]);
    }
  }

  return _.extend(ActiveRoute, FlowRouterHelpers);
};

export default init;
