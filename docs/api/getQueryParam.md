### getQueryParam method

```js
FlowRouter.getQueryParam(queryKey);
```

- `queryKey` {*String*}
- Returns {*String*}

Reactive function which you can use to get a value from the query string.

```js
// route def: /apps/:appId
// url: /apps/this-is-my-app?show=yes&color=red

const color = FlowRouter.getQueryParam('color');
console.log(color); // prints "red"
```
