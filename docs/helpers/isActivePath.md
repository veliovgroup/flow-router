### `isActivePath` Template Helper

Template helper to check if the supplied path matches the currently active route's path.

Returns either a configurable `String`, which defaults to `'active'`, or `false`.

```handlebars
<li class="{{isActivePath '/home'}}">...</li>
<li class="{{isActivePath path='/home'}}">...</li>
<li class="{{isActivePath regex='home|dashboard'}}">...</li>
{{#if isActivePath '/home'}}
  <span>Show only if '/home' is the current route's path</span>
{{/if}}
{{#if isActivePath regex='^\\/products'}}
  <span>Show only if current route's path begins with '/products'</span>
{{/if}}

<li class="{{isActivePath class='is-selected' path='/home'}}">...</li>
<li class="{{isActivePath '/home' class='is-selected'}}">...</li>
```

#### Arguments
The following can be used by as arguments in `isNotActivePath`, `isNotActiveRoute`, `isActivePath` and `isActiveRoute` helpers.

 - Data context, Optional. `String` or `Object` with `name`, `path` or `regex`
 - `name` {*String*} - Only available for `isActiveRoute` and `isNotActiveRoute`
 - `path` {*String*} - Only available for `isActivePath` and `isNotActivePath`
 - `regex` {*String|RegExp*}
