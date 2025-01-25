Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'Carefully extended flow-router with waitOn and template context',
  version: '3.11.0-rc300.1',
  git: 'https://github.com/veliovgroup/flow-router'
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '3.0-rc.0']);
  api.use(['modules', 'ecmascript', 'promise', 'tracker', 'reactive-dict', 'reactive-var', 'ejson', 'check'], ['client', 'server']);

  api.use(['zodern:types@1.0.13', 'typescript@4.9.5 || 5.4.3-rc300.0'], ['client', 'server'], { weak: true });
  api.use(['templating', 'blaze@2.7.1 || 2.8.0 || 2.9.0 || 3.0.0-alpha300.0'], 'client', { weak: true });
  api.mainModule('client/_init.js', 'client');
  api.mainModule('server/_init.js', 'server');
});

Package.onTest((api) => {
  api.use(['ecmascript', 'tinytest', 'underscore', 'check', 'mongo', 'http', 'random', 'communitypackages:fast-render@4.0.6', 'communitypackages:inject-data@2.3.2', 'montiapm:meteorx@2.3.1', 'ostrio:flow-router-extra', 'zodern:types', 'typescript@4.9.5 || 5.4.3-rc300.0'], ['client', 'server']);
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
  qs: '6.11.0'
});
