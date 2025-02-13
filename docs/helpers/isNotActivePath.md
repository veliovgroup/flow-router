### `isNotActivePath` Template Helper

Template helper to check if the supplied path doesn't match the currently active route's path.

Returns either a configurable `String`, which defaults to `'disabled'`, or `false`.

```handlebars
<li class="{{isNotActivePath '/home'}}">...</li>
<li class="{{isNotActivePath path='/home'}}">...</li>
<li class="{{isNotActivePath regex='home|dashboard'}}">...</li>
{{#if isNotActivePath '/home'}}
  <span>Show only if '/home' isn't the current route's path</span>
{{/if}}
{{#if isNotActivePath regex='^\\/products'}}
  <span>Show only if current route's path doesn't begin with '/products'</span>
{{/if}}

<li class="{{isNotActivePath class='is-disabled' path='/home'}}">...</li>
<li class="{{isNotActivePath '/home' class='is-disabled'}}">...</li>
```

#### Arguments
The following can be used by as arguments in `isNotActivePath`, `isNotActiveRoute`, `isActivePath` and `isActiveRoute` helpers.

 - Data context, Optional. `String` or `Object` with `name`, `path` or `regex`
 - `name` {*String*} - Only available for `isActiveRoute` and `isNotActiveRoute`
 - `path` {*String*} - Only available for `isActivePath` and `isNotActivePath`
 - `regex` {*String|RegExp*}
