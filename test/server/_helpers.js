import { HTTP }   from 'meteor/http';
import { Meteor } from 'meteor/meteor';

Package['ostrio:flow-router-extra'].FlowRouter.decodeQueryParamsOnce = true;
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

let GetFRData;

if (Package['communitypackages:inject-data']) {
  const InjectData = Package['communitypackages:inject-data'].InjectData;
  const urlResolve = require('url').resolve;
  GetFRData = function (path) {
    const url = urlResolve(process.env.ROOT_URL, path);
    // FastRender only servers if there is a accept header with html in it
    const options  = {
      headers: {'accept': 'html'}
    };
    const res = HTTP.get(url, options);
    if (res.content) {
      const encodedData = res.content.match(/data">(.*)<\/script/);
      if (encodedData && encodedData[1]) {
        return InjectData._decode(encodedData[1])['fast-render-data'];
      }
    }
    return {collectionData: {'fast-render-coll': {}}};
  };
}

export { GetFRData };
