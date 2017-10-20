### `currentRouteOption` Template Helper

This adds support to get options from flow router

```javascript
FlowRouter.route('name', {
  name: 'routeName',
  action() {
    this.render('layoutTemplate', 'main');
  },
  coolOption: "coolOptionValue"
});
```

```handlebars
<div class={{currentRouteOption 'coolOption'}}>
  ...
</div>
```
