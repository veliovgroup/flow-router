Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'Carefully extended flow-router with waitOn and template context',
  version: '3.7.2',
  git: 'https://github.com/VeliovGroup/flow-router'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use(['modules', 'ecmascript', 'promise', 'tracker', 'reactive-dict', 'reactive-var', 'ejson', 'check'], ['client', 'server']);

  api.use(['templating', 'blaze'], 'client', { weak: true });
  api.mainModule('client/_init.js', 'client');
  api.mainModule('server/_init.js', 'server');
});

Package.onTest((api) => {
  api.use(['ecmascript', 'tinytest', 'underscore', 'check', 'mongo', 'http', 'random', 'staringatlights:fast-render@3.2.0', 'staringatlights:inject-data@2.3.0', 'lamhieu:meteorx@2.1.1', 'ostrio:flow-router-extra'], ['client', 'server']);
  api.use(['reactive-var', 'tracker'], 'client');

  api.addFiles('test/common/fast_render_route.js', ['client', 'server']);

  api.addFiles('test/client/_helpers.js', 'client');
  api.addFiles('test/server/_helpers.js', 'server');

  api.addFiles('test/client/loader.spec.js', 'client');
  api.addFiles('test/client/route.reactivity.spec.js', 'client');
  api.addFiles('test/client/router.core.spec.js', 'client');
  api.addFiles('test/client/router.subs_ready.spec.js', 'client');
  api.addFiles('test/client/router.reactivity.spec.js', 'client');
  api.addFiles('test/client/group.spec.js', 'client');
  api.addFiles('test/client/trigger.spec.js', 'client');
  api.addFiles('test/client/triggers.js', 'client');

  api.addFiles('test/server/plugins/fast_render.js', 'server');

  api.addFiles('test/common/router.path.spec.js', ['client', 'server']);
  api.addFiles('test/common/router.url.spec.js', ['client', 'server']);
  api.addFiles('test/common/router.addons.spec.js', ['client', 'server']);
  api.addFiles('test/common/route.spec.js', ['client', 'server']);
  api.addFiles('test/common/group.spec.js', ['client', 'server']);
});

Npm.depends({
  page: '1.9.0',
  qs: '6.5.2'
});
