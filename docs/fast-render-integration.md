### Fast-Render Integration

To get the most out of Flow-Router Extra and [Fast-Render](https://github.com/abecks/meteor-fast-render) use combination of `subscriptions` and `waitOn`.

#### Install fast-render library:

```shell
meteor add communitypackages:fast-render
```

__Note: make sure `communitypackages:fast-render` placed above `ostrio:flow-router-extra` in `meteor-app/.meteor/packages` file. For package developers: Make sure `communitypackages:fast-render` placed before `ostrio:flow-router-extra` in `api.use()` method:__

```plaintext
# meteor-app/.meteor/packages
communitypackages:fast-render
ostrio:flow-router-extra
```

```js
// meteor-package/package.js
Package.onUse((api) => {
  api.use(['communitypackages:fast-render', 'ostrio:flow-router-extra', /*...*/]);
});
```

__To utilize features of Fast-Render place routes definition into `lib` or any other isomorphic location/import.__

```js
// meteor-app/lib/routes.js
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

#### Further Reading

- [Fast Render Repository](https://github.com/abecks/meteor-fast-render)
- [`.waitOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waitOn.md)
- [`.subscriptions()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/original-readme.md#subscription-management)
- [`.data()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/data.md)
- [`.action()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/action.md)
- [`.render()` method](https://github.com/VeliovGroup/flow-router/blob/master/docs/api/render.md)
