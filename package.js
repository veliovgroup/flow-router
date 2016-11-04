Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'Carefully extended flow-router with waitOn and template context',
  version: '2.12.5',
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
});

Npm.depends({
  'page':'1.7.1',
  'qs':'6.3.0'
});