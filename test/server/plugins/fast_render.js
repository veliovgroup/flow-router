// Tinytest.add('Server - Fast Render - fast render supported route', function (test) {
//   var expectedFastRenderCollData = [
//     [{_id: "two", aa: 20}, {_id: "one", aa: 10}]
//   ];

//   var data = GetFRData('/the-fast-render-route');
//   test.equal(data.collectionData['fast-render-coll'], expectedFastRenderCollData);
// });

// Tinytest.add('Server - Fast Render - fast render supported route with params', function (test) {
//   var expectedFastRenderCollData = [
//     [{
//       _id: "one",
//       params: {id: 'the-id'},
//       queryParams: {aa: "20"}
//     }]
//   ];

//   var data = GetFRData('/the-fast-render-route-params/the-id?aa=20');
//   test.equal(data.collectionData['fast-render-coll'], expectedFastRenderCollData);
// });

// Tinytest.add('Server - Fast Render - no fast render supported route', function (test) {
//   var data = GetFRData('/no-fast-render');
//   test.equal(data.collectionData, {});
// });

// Tinytest.add('Server - Fast Render - with group routes', function (test) {
//   var expectedFastRenderCollData = [
//     [{_id: "two", aa: 20}, {_id: "one", aa: 10}]
//   ];

//   var data = GetFRData('/fr/have-fr');
//   test.equal(data.collectionData['fast-render-coll'], expectedFastRenderCollData);
// }); 


if(!Package['staringatlights:fast-render']) {
  return;
}

FastRender = Package['staringatlights:fast-render'].FastRender;

// hack to run after eveything else on startup
Meteor.startup(function () {
  Meteor.startup(function () {
    setupFastRender();
  });
});

function setupFastRender () {
  _.each(FlowRouter._routes, function (route) {
    FastRender.route(route.pathDef, function (routeParams, path) {
      var self = this;

      // anyone using Meteor.subscribe for something else?
      var original = Meteor.subscribe;
      Meteor.subscribe = function () {
        return _.toArray(arguments);
      };

      route._subsMap = {};
      FlowRouter.subscriptions.call(route, path);
      if(route.subscriptions) {
        var queryParams = routeParams.query;
        var params = _.omit(routeParams, 'query');
        route.subscriptions(params, queryParams);
      }
      _.each(route._subsMap, function (args) {
        self.subscribe.apply(self, args);
      });

      // restore Meteor.subscribe, ... on server side
      Meteor.subscribe = original;
    });
  });
}