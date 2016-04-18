Package.describe({
  name: 'ostrio:flow-router-extra',
  summary: 'Carefully extended flow-router with waitOn and template context',
  version: '2.11.0',
  git: 'https://github.com/VeliovGroup/flow-router'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.3');
  api.use([
    'underscore', 
    'tracker', 
    'reactive-dict', 
    'reactive-var', 
    'ejson', 
    'modules'
  ], ['client', 'server']);

  api.addFiles([
    'client-modules.js', 
    'client/triggers.js', 
    'client/router.js', 
    'client/group.js', 
    'client/route.js', 
    'client/_init.js'
  ], 'client');

  api.addFiles([
    'server/router.js', 
    'server/group.js', 
    'server/route.js', 
    'server/_init.js', 
    'server/plugins/fast_render.js'
  ], 'server');
  
  api.addFiles('lib/router.js', ['client', 'server']);
  api.export('FlowRouter');
}
