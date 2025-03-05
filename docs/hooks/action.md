### action hook

`action(params, qs, data)`

- `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
- `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
- `data` {*Mix*} - Value returned from `.data()` hook
- Return: {*void*}

`.action()` hook is triggered right after page is navigated to route, or after (*exact order, if any of those is defined*):

- [`.whileWaiting()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/whileWaiting.md)
- [`.waitOn()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOn.md)
- [`.waitOnResources()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/waitOnResources.md)
- [`.triggersEnter()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/triggersEnter.md)
- [`.data()` hook](https://github.com/veliovgroup/flow-router/blob/master/docs/hooks/data.md)
