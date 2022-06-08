### Auto-scroll to the top of the page after navigation

*FlowRouter* causes the page to remain at the same scroll position on navigation between routes (which people are often surprised by). Little snipped below would fix this behavior to more common, when each page loaded at the top of the scrolling position.

Originated from [`#9`](https://github.com/veliovgroup/flow-router/issues/9).

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

const scrollToTop = () => {
  setTimeout(() => {
    if (!window.location.hash) {
      (window.scroll || window.scrollTo || function (){})(0, 0);
    }
  }, 25);
};

FlowRouter.triggers.enter([scrollToTop]);
```

With jQuery animation:

```js
import { $ }          from 'meteor/jquery';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

const scrollToTop = () => {
  setTimeout(() => {
    if (!window.location.hash) {
      $('html, body').animate({scrollTop: 100});
    }
  }, 25);
};

FlowRouter.triggers.enter([scrollToTop]);
```
