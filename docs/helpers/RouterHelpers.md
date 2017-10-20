### RouterHelpers Class

Use template helpers right from JavaScript code.
```jsx
import { RouterHelpers } from 'meteor/ostrio:flow-router-extra';

RouterHelpers.name('home');
// Returns true if current route's name is 'home'.
RouterHelpers.name(new RegExp('home|dashboard'));
// Returns true if current route's name contains 'home' or 'dashboard'.
RouterHelpers.name(/^products/);
// Returns true if current route's name starts with 'products'.
RouterHelpers.path('/home');
// Returns true if current route's path is '/home'.
RouterHelpers.path(new RegExp('users'));
// Returns true if current route's path contains 'users'.
RouterHelpers.path(/\/edit$/i);
// Returns true if current route's path ends with '/edit', matching is
// case-insensitive

RouterHelpers.pathFor('/post/:id', {id: '12345'});

RouterHelpers.configure({
  activeClass: 'active',
  caseSensitive: true,
  disabledClass: 'disabled',
  regex: 'false'
});
```