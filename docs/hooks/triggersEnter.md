### triggersEnter

`triggersEnter` is option (*not actually a hook*), it accepts array of *Function*s, each function will be called with next arguments:

- `context` {*Route*} - Output of `FlowRouter.current()`
- `redirect` {*Function*} - Use to redirect to another route, same as [`FlowRouter.go()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/go.md)
- `stop` {*Function*} - Use to abort current route execution
- `data` {*Mix*} - Value returned from `.data()` hook
- Return: {*void*}

#### Scroll to top:

```js
const scrollToTop = () => {
  (window.scroll || window.scrollTo || function (){})(0, 0);
};

FlowRouter.route('/', {
  name: 'index',
  triggersEnter: [scrollToTop]
});

// Apply to every route:
FlowRouter.triggers.enter([scrollToTop]);
```

#### Logging:

```js
FlowRouter.route('/', {
  name: 'index',
  triggersEnter: [() => {
    console.log('triggersEnter');
  }]
});
```

#### Redirect:

```js
FlowRouter.route('/', {
  name: 'index',
  triggersEnter: [(context, redirect) => {
    redirect('/other/route');
  }]
});
```

#### Global

```js
FlowRouter.triggers.enter([cb1, cb2]);
```

#### Further reading

- [`.current()` method](https://github.com/veliovgroup/flow-router/blob/master/docs/api/current.md)
- [Global `.triggers`](https://github.com/veliovgroup/flow-router/blob/master/docs/api/triggers.md)
- [`.action()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/action.md)
- [`.triggersExit()` hooks](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/triggersExit.md)
