### Global Triggers

```js
FlowRouter.triggers.enter([cb1, cb2]);
FlowRouter.triggers.exit([cb1, cb2]);

// filtering
FlowRouter.triggers.enter([trackRouteEntry], {only: ["home"]});
FlowRouter.triggers.exit([trackRouteExit], {except: ["home"]});
```

To filter routes use `only` or `except` keywords.
You can't use both `only` and `except` at once.

#### Further reading

- [`.triggersEnter()` hooks](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
- [`.triggersExit()` hooks](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/triggersExit.md)
