### getParam method

```js
FlowRouter.getParam(paramName);
```
 - `paramName` {*String*}
 - Returns {*String*}

Reactive function which you can use to get a parameter from the URL.

#### Example
```js
// route def: /apps/:appId
// url: /apps/this-is-my-app

const appId = FlowRouter.getParam('appId');
console.log(appId); // prints "this-is-my-app"
```
