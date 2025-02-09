import { Mongo }      from 'meteor/mongo';
import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from 'meteor/jessedev:flow-router-extra';

const FastRenderColl = new Mongo.Collection('fast-render-coll');

FlowRouter.route('/the-fast-render-route', {
  subscriptions() {
    if (Meteor.isServer) {
      this.register('data', Meteor.subscribe('fast-render-data'));
    }
  },
  fastRender: true,
  waitOn() {
    if (Meteor.isClient) {
      return Meteor.subscribe('fast-render-data');
    }
  },
});

FlowRouter.route('/the-fast-render-route-params/:id', {
  subscriptions(params, queryParams) {
    if (Meteor.isServer) {
      this.register('data', Meteor.subscribe('fast-render-data-params', params, queryParams));
    }
  },
  fastRender: true,
  waitOn(params, queryParams) {
    if (Meteor.isClient) {
      return Meteor.subscribe('fast-render-data-params', params, queryParams);
    }
  },
});

FlowRouter.route('/no-fast-render', {
  subscriptions() {
    if(Meteor.isClient) {
      this.register('data', Meteor.subscribe('fast-render-data'));
    }
  },
  fastRender: true,
  waitOn() {
    if (Meteor.isClient) {
      return Meteor.subscribe('fast-render-data');
    }
  }
});

const frGroup = FlowRouter.group({
  prefix: '/fr'
});

frGroup.route('/have-fr', {
  subscriptions() {
    if (Meteor.isServer) {
      this.register('data', Meteor.subscribe('fast-render-data'));
    }
  },
  fastRender: true,
  waitOn() {
    if (Meteor.isClient) {
      return Meteor.subscribe('fast-render-data');
    }
  }
});

export { FastRenderColl };
