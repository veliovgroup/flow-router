### waitOnResources hook

`waitOnResources(params, qs)`
 - `params` {*Object*} - Serialized route parameters, `/route/:_id => { _id: 'str' }`
 - `qs` {*Object*} - Serialized query string, `/route/?key=val => { key: 'val' }`
 - Return: {*Object*} `{ images: ['url'], other: ['url'] }`

`.waitOnResources()` hook is triggered before `.action()` hook, allowing to load necessary files, images, fonts before rendering a template.

#### Preload images
```js
FlowRouter.route('/images', {
  name: 'images',
  waitOnResources() {
    return {
      images:[
        '/imgs/1.png',
        '/imgs/2.png',
        '/imgs/3.png'
      ]
    };
  },
});
```

#### Global
Useful to preload background images and other globally used resources
```js
FlowRouter.globals.push({
  waitOnResources() {
    return {
      images: [
        '/imgs/background/jpg',
        '/imgs/icon-sprite.png',
        '/img/logo.png'
      ]
    };
  }
});
```

#### Preload Resources
This method will work only for __cacheble__ resources, if URLs returns non-cacheble resources (*dynamic resources*) it will be useless.

*Why Images and Other resources is separated? What the difference?* - Images can be prefetched via `Image()` constructor, all other resources will use `XMLHttpRequest` to cache resources. Thats why important to make sure requested URLs returns cacheble response.


```js
FlowRouter.route('/', {
  name: 'index',
  waitOnResources() {
    return {
      other:[
        '/fonts/OpenSans-Regular.eot',
        '/fonts/OpenSans-Regular.svg',
        '/fonts/OpenSans-Regular.ttf',
        '/fonts/OpenSans-Regular.woff',
        '/fonts/OpenSans-Regular.woff2'
      ]
    };
  }
});
```

#### Global
Useful to prefetch Fonts and other globally used resources
```js
FlowRouter.globals.push({
  waitOnResources() {
    return {
      other:[
        '/fonts/OpenSans-Regular.eot',
        '/fonts/OpenSans-Regular.svg',
        '/fonts/OpenSans-Regular.ttf',
        '/fonts/OpenSans-Regular.woff',
        '/fonts/OpenSans-Regular.woff2'
      ]
    };
  }
});
```

#### Further reading
 - [`.waiOn()` hook](https://github.com/VeliovGroup/flow-router/blob/master/docs/hooks/waiOn.md)
