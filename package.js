Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'The router for modern JavaScript apps, with support for Blaze, Vue, React, Svelte',
  version: '3.12.0',
  git: 'https://github.com/veliovgroup/flow-router',
});

Package.onUse((api) => {
  api.versionsFrom(['1.4', '2.8.0', '3.0.1']);
  api.use(['modules', 'ecmascript', 'promise', 'tracker', 'reactive-dict', 'reactive-var', 'ejson', 'check'], ['client', 'server']);

  api.use(['zodern:types@1.0.13', 'typescript'], ['client', 'server'], { weak: true });
  api.use(['templating', 'blaze@2.0.0 || 3.0.0'], 'client', { weak: true });
  api.mainModule('client/_init.js', 'client');
  api.mainModule('server/_init.js', 'server');

  // For zodern:types to pick up our published types.
  api.addAssets('index.d.ts', ['client', 'server']);
});

Package.onTest((api) => {
  api.use(['ecmascript', 'tinytest', 'underscore', 'check', 'mongo', 'http', 'random', 'ostrio:flow-router-extra', 'zodern:types', 'typescript'], ['client', 'server']);
  api.use(['reactive-var', 'tracker'], 'client');

  // Temporary disable `fast-render` tests as not compatible with meteor@3
  // once fast-render, meteorx, and inject-data are compatible with meteor@3, add the next packages:
  // 'communitypackages:fast-render', 'communitypackages:inject-data', 'montiapm:meteorx'
  // api.addFiles('test/common/fast_render_route.js', ['client', 'server']);
  // api.addFiles('test/server/plugins/fast_render.js', 'server');

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


  api.addFiles('test/common/router.path.spec.js', ['client', 'server']);
  api.addFiles('test/common/router.url.spec.js', ['client', 'server']);
  api.addFiles('test/common/router.addons.spec.js', ['client', 'server']);
  api.addFiles('test/common/route.spec.js', ['client', 'server']);
  api.addFiles('test/common/group.spec.js', ['client', 'server']);
});

Npm.depends({
  page: '1.9.0',
  qs: '6.14.0',
});
