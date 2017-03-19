Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
Meteor.publish('foo', function () {
  this.ready();
});

Meteor.publish('fooNotReady', function () {
});

Meteor.publish('bar', function () {
  this.ready();
});

// use this only to test global subs
Meteor.publish('baz', function () {
  this.ready();
});

Meteor.publish('bazNotReady', function () {
});

Meteor.publish('readyness', function (doIt) {
  if(doIt) {
    this.ready();
  }
});

if (Package['meteorhacks:inject-data']) {
  InjectData = Package['meteorhacks:inject-data'].InjectData;
  var urlResolve = Npm.require('url').resolve;
  GetFRData = function GetFRData(path) {
    var url = urlResolve(process.env.ROOT_URL, path);
    // FastRender only servers if there is a accept header with html in it
    var options  = {
      headers: {'accept': 'html'}
    };
    var res = HTTP.get(url, options);
    if (res.content) {
      var encodedData = res.content.match(/data">(.*)<\/script/);
      if (encodedData && encodedData[1]) {
        return InjectData._decode(encodedData[1])['fast-render-data'];
      }
    }
    return {collectionData: {'fast-render-coll': {}}};
  };
}
