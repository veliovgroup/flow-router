### Fast-Render Integration

To get the most out of Flow-Router Extra and Fast-Render use combination of `subscriptions` and `waitOn`.

__To utilize features of Fast-Render place routes definition into `lib` or any other isomorphic location/import.__

```js
import { Meteor }     from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/:_id', {
  name: 'file',
  action(params, queryParams, data) {
    // this.render(/*...*/);
  },
  waitOn(params) {
    if (Meteor.isClient) {
      return Meteor.subscribe('data', params._id);
    }
  },
  subscriptions(params) {
    if (Meteor.isServer) {
      this.register('data', Meteor.subscribe('data', params._id));
    }
  },
  fastRender: true,
  data(params) {
    // Get subscribed data
    return MyCollection.findOne(params._id) || false;
  }
});
```
