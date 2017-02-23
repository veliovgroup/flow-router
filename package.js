Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'Carefully extended flow-router with waitOn and template context',
  version: '2.12.9',
  git: 'https://github.com/VeliovGroup/flow-router'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use([
    'blaze',
    'templating',
    'modules',
    'underscore',
    'tracker',
    'reactive-dict',
    'reactive-var',
    'ejson',
    'ecmascript'
  ]);

  api.addFiles([
    'client/yield.html',
    'client/renderer.js',
    'client/modules.js',
    'client/triggers.js',
    'client/router.js',
    'client/group.js',
    'client/route.js'
  ], 'client');
  api.mainModule('client/_init.js', 'client');

  api.addFiles([
    'server/router.js',
    'server/group.js',
    'server/route.js'
  ], 'server');
  api.mainModule('server/_init.js', 'server');
  api.addFiles('lib/router.js', ['client', 'server']);

  api.export('FlowRouter');
  // Uncomment before running tests
  // api.export('Triggers');
});

Package.onTest(function(api) {
  api.use(['tinytest', 'underscore', 'reactive-var', 'tracker', 'check', 'mongo', 'http', 'random', 'ostrio:flow-router-extra', 'meteorhacks:fast-render', 'meteorhacks:inject-data', 'tmeasday:html5-history-api']);

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
  'qs': '6.3.1'
});
