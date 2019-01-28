import { _ }          from 'meteor/underscore';
import { check }      from 'meteor/check';
import { GetSub }     from './_helpers.js';
import { Meteor }     from 'meteor/meteor';
import { Random }     from 'meteor/random';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Tinytest.addAsync('Client - Router - define and go to route', (test, next) => {
  const rand   = Random.id();
  let rendered = 0;

  FlowRouter.route('/' + rand, {
    action() {
      rendered++;
    }
  });

  FlowRouter.go('/' + rand);

  setTimeout(() => {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - define and go to route with fields', (test, next) => {
  const rand    = Random.id();
  const pathDef = '/' + rand + '/:key';
  let rendered  = 0;

  FlowRouter.route(pathDef, {
    action(params) {
      test.equal(params.key, 'abc +@%');
      rendered++;
    }
  });

  FlowRouter.go(pathDef, {key: 'abc +@%'});

  setTimeout(() => {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - define and go to route with UTF-8 fields', (test, next) => {
  const rand    = Random.id();
  const pathDef = '/' + rand + '/:key';
  let rendered  = 0;

  FlowRouter.route(pathDef, {
    action(params) {
      test.equal(params.key, '𒀨𒀭');
      rendered++;
    }
  });

  FlowRouter.go(pathDef, {key: '𒀨𒀭'});

  setTimeout(() => {
    test.equal(rendered, 1);
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - parse params and query', (test, next) => {
  const rand   = Random.id();
  let rendered = 0;
  let params   = null;

  FlowRouter.route('/' + rand + '/:foo', {
    action(_params) {
      rendered++;
      params = _params;
    }
  });

  FlowRouter.go('/' + rand + '/bar');

  setTimeout(() => {
    test.equal(rendered, 1);
    test.equal(params.foo, 'bar');
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - redirect using FlowRouter.go', (test, next) => {
  const rand  = Random.id();
  const rand2 = Random.id();
  const log   = [];
  const paths = ['/' + rand2, '/' + rand];

  FlowRouter.route(paths[0], {
    action() {
      log.push(1);
      FlowRouter.go(paths[1]);
    }
  });

  FlowRouter.route(paths[1], {
    action() {
      log.push(2);
    }
  });

  FlowRouter.go(paths[0]);

  setTimeout(() => {
    test.equal(log, [1, 2]);
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - get current route path', (test, next) => {
  const value       = Random.id();
  const randomValue = Random.id();
  const pathDef     = '/' + randomValue + '/:_id';
  const path        = '/' + randomValue + '/' + value;

  let detectedValue = null;

  FlowRouter.route(pathDef, {
    action(params) {
      detectedValue = params._id;
    }
  });

  FlowRouter.go(path);

  Meteor.setTimeout(() => {
    test.equal(detectedValue, value);
    test.equal(FlowRouter.current().path, path);
    next();
  }, 50);
});

Tinytest.addAsync('Client - Router - subscribe to global subs', (test, next) => {
  const rand = Random.id();
  FlowRouter.route('/' + rand);

  FlowRouter.subscriptions = function (path) {
    test.equal(path, '/' + rand);
    this.register('baz', Meteor.subscribe('baz'));
  };

  FlowRouter.go('/' + rand);
  setTimeout(() => {
    test.isTrue(!!GetSub('baz'));
    FlowRouter.subscriptions = Function.prototype;
    next();
  }, 100);
});

Tinytest.addAsync('Client - Router - setParams - generic', (test, done) => {
  const randomKey  = Random.id();
  const pathDef    = `/${randomKey}/:cat/:id`;
  const paramsList = [];
  FlowRouter.route(pathDef, {
    action(params) {
      paramsList.push(params);
    }
  });

  FlowRouter.go(pathDef, {cat: 'meteor', id: '200'});
  setTimeout(() => {
    // return done();
    const success = FlowRouter.setParams({id: '700'});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(paramsList.length, 2);
    test.equal(_.pick(paramsList[0], 'id', 'cat'), {cat: 'meteor', id: '200'});
    test.equal(_.pick(paramsList[1], 'id', 'cat'), {cat: 'meteor', id: '700'});
    done();
  }
});

Tinytest.addAsync('Client - Router - setParams - preserve query strings', (test, done) => {
  const randomKey  = Random.id();
  const pathDef    = `/${randomKey}/:cat/:id`;
  const paramsList = [];
  const queryParamsList = [];

  FlowRouter.route(pathDef, {
    action: function(params, queryParams) {
      paramsList.push(params);
      queryParamsList.push(queryParams);
    }
  });

  FlowRouter.go(pathDef, {cat: 'meteor', id: '200 +% / ad'}, {aa: '20 +%'});
  setTimeout(function() {
    // return done();
    const success = FlowRouter.setParams({id: '700 +% / ad'});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(paramsList.length, 2);
    test.equal(queryParamsList.length, 2);

    test.equal(_.pick(paramsList[0] || {}, 'id', 'cat'), {cat: 'meteor', id: '200 +% / ad'});
    test.equal(_.pick(paramsList[1] || {}, 'id', 'cat'), {cat: 'meteor', id: '700 +% / ad'});
    test.equal(queryParamsList, [{aa: '20 +%'}, {aa: '20 +%'}]);
    done();
  }
});

Tinytest.add('Client - Router - setParams - no route selected', (test) => {
  const originalRoute = FlowRouter._current.route;
  FlowRouter._current.route = undefined;
  const success = FlowRouter.setParams({id: '800'});
  test.isFalse(success);
  FlowRouter._current.route = originalRoute;
});

Tinytest.addAsync('Client - Router - setQueryParams - using check', (test, done) => {
  const randomKey = Random.id();
  const pathDef   = `/${randomKey}`;
  const queryParamsList = [];

  FlowRouter.route(pathDef, {
    action(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FlowRouter.go(pathDef, {}, {cat: 'meteor', id: '200'});
  setTimeout(() => {
    check(FlowRouter.current().queryParams, {cat: String, id: String});
    done();
  }, 50);
});

Tinytest.addAsync('Client - Router - setQueryParams - generic', (test, done) => {
  const randomKey = Random.id();
  const pathDef   = `/${randomKey}`;
  const queryParamsList = [];
  FlowRouter.route(pathDef, {
    action: function(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FlowRouter.go(pathDef, {}, {cat: 'meteor', id: '200'});
  setTimeout(() => {
    // return done();
    const success = FlowRouter.setQueryParams({id: '700'});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(_.pick(queryParamsList[0] || [], 'id', 'cat'), {cat: 'meteor', id: '200'});
    test.equal(_.pick(queryParamsList[1] || [], 'id', 'cat'), {cat: 'meteor', id: '700'});
    done();
  }
});

Tinytest.addAsync('Client - Router - setQueryParams - remove query param null', (test, done) => {
  const randomKey = Random.id();
  const pathDef   = `/${randomKey}`;
  const queryParamsList = [];
  FlowRouter.route(pathDef, {
    action(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FlowRouter.go(pathDef, {}, {cat: 'meteor', id: '200'});
  setTimeout(() => {
    const success = FlowRouter.setQueryParams({id: '700', cat: null});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(_.pick(queryParamsList[0], 'id', 'cat'), {cat: 'meteor', id: '200'});
    test.equal(queryParamsList[1], {id: '700'});
    done();
  }
});

Tinytest.addAsync('Client - Router - setQueryParams - remove query param undefined', (test, done) => {
  const randomKey = Random.id();
  const pathDef   = `/${randomKey}`;
  const queryParamsList = [];
  FlowRouter.route(pathDef, {
    action(params, queryParams) {
      queryParamsList.push(queryParams);
    }
  });

  FlowRouter.go(pathDef, {}, {cat: 'meteor', id: '200'});
  setTimeout(() => {
    const success = FlowRouter.setQueryParams({id: '700', cat: undefined});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(_.pick(queryParamsList[0], 'id', 'cat'), {cat: 'meteor', id: '200'});
    test.equal(queryParamsList[1], {id: '700'});
    done();
  }
});

Tinytest.addAsync('Client - Router - setQueryParams - preserve params', (test, done) => {
  const randomKey = Random.id();
  const pathDef   = '/' + randomKey + '/:abc';
  const queryParamsList = [];
  const paramsList = [];
  FlowRouter.route(pathDef, {
    action(params, queryParams) {
      paramsList.push(params);
      queryParamsList.push(queryParams);
    }
  });

  FlowRouter.go(pathDef, {abc: '20'}, {cat: 'meteor', id: '200'});
  setTimeout(() => {
    // return done();
    const success = FlowRouter.setQueryParams({id: '700'});
    test.isTrue(success);
    setTimeout(validate, 50);
  }, 50);

  function validate() {
    test.equal(queryParamsList.length, 2);
    test.equal(queryParamsList, [
      {cat: 'meteor', id: '200'}, {cat: 'meteor', id: '700'}
    ]);

    test.equal(paramsList.length, 2);
    test.equal(_.pick(paramsList[0] || [], 'abc'), {abc: '20'});
    test.equal(_.pick(paramsList[1] || [], 'abc'), {abc: '20'});
    done();
  }
});

Tinytest.add('Client - Router - setQueryParams - no route selected', (test) => {
  const originalRoute = FlowRouter._current.route;
  FlowRouter._current.route = undefined;
  const success = FlowRouter.setQueryParams({id: '800'});
  test.isFalse(success);
  FlowRouter._current.route = originalRoute;
});

Tinytest.addAsync('Client - Router - notFound', (test, done) => {
  const data = [];
  FlowRouter.route('*', {
    subscriptions() {
      data.push('subscriptions');
    },
    action() {
      data.push('action');
    }
  });

  FlowRouter.go('/' + Random.id());
  setTimeout(() => {
    test.equal(data, ['subscriptions', 'action']);
    done();
  }, 50);
});

Tinytest.addAsync('Client - Router - withReplaceState - enabled', (test, done) => {
  const pathDef = '/' + Random.id() + '/:id';
  const originalRedirect = FlowRouter._page.replace;
  let callCount = 0;
  FlowRouter._page.replace = function(path) {
    callCount++;
    originalRedirect.call(FlowRouter._page, path);
  };

  FlowRouter.route(pathDef, {
    name: name,
    action(params) {
      test.equal(params.id, 'awesome');
      test.equal(callCount, 1);
      FlowRouter._page.replace = originalRedirect;
      // We don't use Meteor.defer here since it carries
      // Meteor.Environment vars too
      // Which breaks our test below
      setTimeout(done, 0);
    }
  });

  FlowRouter.withReplaceState(function() {
    FlowRouter.go(pathDef, {id: 'awesome'});
  });
});

Tinytest.addAsync('Client - Router - withReplaceState - disabled', (test, done) => {
  const pathDef = '/' + Random.id() + '/:id';
  const originalRedirect = FlowRouter._page.replace;
  let callCount = 0;
  FlowRouter._page.replace = function(path) {
    callCount++;
    originalRedirect.call(FlowRouter._page, path);
  };

  FlowRouter.route(pathDef, {
    name: name,
    action(params) {
      test.equal(params.id, 'awesome');
      test.equal(callCount, 0);
      FlowRouter._page.replace = originalRedirect;
      Meteor.defer(done);
    }
  });

  FlowRouter.go(pathDef, {id: 'awesome'});
});

Tinytest.addAsync('Client - Router - withTrailingSlash - enabled', (test, next) => {
  const rand = Random.id();
  let rendered = 0;

  FlowRouter.route('/' + rand, {
    action() {
      rendered++;
    }
  });

  FlowRouter.withTrailingSlash(function() {
    FlowRouter.go('/' + rand);
  });

  setTimeout(() => {
    test.equal(rendered, 1);
    test.equal(_.last(location.href), '/');
    setTimeout(next, 100);
  }, 100);
});

Tinytest.addAsync('Client - Router - idempotent routing - action', (test, done) => {
  const rand    = Random.id();
  const pathDef = `/${rand}`;
  let rendered  = 0;

  FlowRouter.route(pathDef, {
    action() {
      rendered++;
    }
  });

  FlowRouter.go(pathDef);

  Meteor.defer(() => {
    FlowRouter.go(pathDef);

    Meteor.defer(() => {
      test.equal(rendered, 1);
      done();
    });
  });
});

Tinytest.addAsync('Client - Router - idempotent routing - triggers', (test, next) => {
  const rand    = Random.id();
  const pathDef = `/${rand}`;
  let runnedTriggers = 0;
  let done = false;

  const triggerFns = [function() {
    if (done) return;

    runnedTriggers++;
  }];

  FlowRouter.triggers.enter(triggerFns);

  FlowRouter.route(pathDef, {
    triggersEnter: triggerFns,
    triggersExit: triggerFns
  });

  FlowRouter.go(pathDef);

  FlowRouter.triggers.exit(triggerFns);

  Meteor.defer(() => {
    FlowRouter.go(pathDef);

    Meteor.defer(() => {
      test.equal(runnedTriggers, 2);
      done = true;
      next();
    });
  });
});

Tinytest.addAsync('Client - Router - reload - action', (test, done) => {
  const rand    = Random.id();
  const pathDef = `/${rand}`;
  let rendered  = 0;

  FlowRouter.route(pathDef, {
    action() {
      rendered++;
    }
  });

  FlowRouter.go(pathDef);

  Meteor.defer(() => {
    FlowRouter.reload();

    Meteor.defer(() => {
      test.equal(rendered, 2);
      done();
    });
  });
});

Tinytest.addAsync('Client - Router - reload - triggers', (test, next) => {
  const rand    = Random.id();
  const pathDef = `/${rand}`;
  let runnedTriggers = 0;
  let done = false;

  const triggerFns = [function() {
    if (done) return;

    runnedTriggers++;
  }];

  FlowRouter.triggers.enter(triggerFns);

  FlowRouter.route(pathDef, {
    triggersEnter: triggerFns,
    triggersExit: triggerFns
  });

  FlowRouter.go(pathDef);

  FlowRouter.triggers.exit(triggerFns);

  Meteor.defer(() => {
    FlowRouter.reload();

    Meteor.defer(() => {
      test.equal(runnedTriggers, 6);
      done = true;
      next();
    });
  });
});

Tinytest.addAsync('Client - Router - wait - before initialize', (test, done) => {
  FlowRouter._initialized = false;
  FlowRouter.wait();
  test.equal(FlowRouter._askedToWait, true);

  FlowRouter._initialized = true;
  FlowRouter._askedToWait = false;
  done();
});

Tinytest.addAsync('Client - Router - wait - after initialized', (test, done) => {
  try {
    FlowRouter.wait();
  } catch(ex) {
    test.isTrue(/can't wait/.test(ex.message));
    done();
  }
});

Tinytest.addAsync('Client - Router - initialize - after initialized', (test, done) => {
  try {
    FlowRouter.initialize();
  } catch(ex) {
    test.isTrue(/already initialized/.test(ex.message));
    done();
  }
});

Tinytest.addAsync('Client - Router - base path - url updated', (test, done) => {
  const simulatedBasePath = '/flow';
  const rand = Random.id();
  FlowRouter.route('/' + rand, { action() {} });

  setBasePath(simulatedBasePath);
  FlowRouter.go('/' + rand);
  setTimeout(() => {
    test.equal(location.pathname, simulatedBasePath + '/' + rand);
    resetBasePath();
    done();
  }, 100);
});

Tinytest.addAsync('Client - Router - base path - route action called', (test, done) => {
  const simulatedBasePath = '/flow';
  const rand = Random.id();
  FlowRouter.route('/' + rand, {
    action() {
      resetBasePath();
      done();
    }
  });

  setBasePath(simulatedBasePath);
  FlowRouter.go('/' + rand);
});

Tinytest.add('Client - Router - base path - path generation', (test) => {
  _.each(['/flow', '/flow/', 'flow/', 'flow'], function(simulatedBasePath) {
    const rand = Random.id();
    setBasePath(simulatedBasePath);
    test.equal(FlowRouter.path('/' + rand), '/flow/' + rand);
  });
  resetBasePath();
});

Tinytest.add('Client - Router - base path - url generation', (test) => {
  _.each(['/flow', '/flow/', 'flow/', 'flow'], function(simulatedBasePath) {
    const rand = Random.id();
    setBasePath(simulatedBasePath);

    Meteor.absoluteUrl.defaultOptions.rootUrl = 'http://example.com/flow';
    test.equal(FlowRouter.url(`/${rand}`), 'http://example.com/flow/' + rand);
  });
  resetBasePath();
});


function setBasePath(path) {
  FlowRouter._initialized = false;
  FlowRouter._basePath = path;
  FlowRouter.initialize();
}

const defaultBasePath = FlowRouter._basePath;
function resetBasePath() {
  setBasePath(defaultBasePath);
}

// function bind(obj, method) {
//   return function() {
//     obj[method].apply(obj, arguments);
//   };
// }
