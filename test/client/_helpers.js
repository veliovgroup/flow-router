import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
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
