import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from 'meteor/jessedev:flow-router-extra';

Package['jessedev:flow-router-extra'].FlowRouter.decodeQueryParamsOnce = true;
Package['kadira:flow-router'] = Package['jessedev:flow-router-extra'];

const GetSub = (name) => {
  for(let id in Meteor.connection._subscriptions) {
    if(name === Meteor.connection._subscriptions[id].name) {
      return Meteor.connection._subscriptions[id];
    }
  }
  return void 0;
};

FlowRouter.route('/');

export { GetSub };
