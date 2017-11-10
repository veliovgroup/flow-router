Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'Carefully extended flow-router with waitOn and template context',
  version: '3.4.1',
  git: 'https://github.com/VeliovGroup/flow-router'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4');
  api.use([
    'modules',
    'ecmascript',
    'promise',
    'blaze',
    'templating',
    'modules',
    'underscore',
    'tracker',
    'reactive-dict',
    'reactive-var',
    'ejson'
  ], ['client', 'server']);

  api.mainModule('client/_init.js', 'client');
  api.mainModule('server/_init.js', 'server');
});

Package.onTest(function(api) {
  api.use(['ecmascript', 'tinytest', 'underscore', 'reactive-var', 'tracker', 'check', 'mongo', 'http', 'random', 'tmeasday:html5-history-api', 'staringatlights:fast-render', 'staringatlights:inject-data', 'ostrio:flow-router-extra']);

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
  'page': '1.7.1',
  'qs': '6.5.1'
});
