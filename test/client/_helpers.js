import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
GetSub = function (name) {
  for(var id in Meteor.connection._subscriptions) {
    var sub = Meteor.connection._subscriptions[id];
    if(name === sub.name) {
      return sub;
    }
  }
};

FlowRouter.route('/');
