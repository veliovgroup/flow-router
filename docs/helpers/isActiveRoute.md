### `isActiveRoute` Template Helper

Template helper to check if the supplied route name matches the currently active route's name.

Returns either a configurable `String`, which defaults to `'active'`, or `false`.

```handlebars
<li class="{{isActiveRoute 'home'}}">...</li>
<li class="{{isActiveRoute name='home'}}">...</li>
<li class="{{isActiveRoute regex='home|dashboard'}}">...</li>
{{#if isActiveRoute 'home'}}
  <span>Show only if 'home' is the current route's name</span>
{{/if}}
{{#if isActiveRoute regex='^products'}}
  <span>Show only if the current route's name begins with 'products'</span>
{{/if}}

<li class="{{isActiveRoute class='is-selected' name='home'}}">...</li>
<li class="{{isActiveRoute 'home' class='is-selected'}}">...</li>
```

#### Arguments
The following can be used by as arguments in `isNotActivePath`, `isNotActiveRoute`, `isActivePath` and `isActiveRoute` helpers.

 - Data context, Optional. `String` or `Object` with `name`, `path` or `regex`
 - `name` {*String*} - Only available for `isActiveRoute` and `isNotActiveRoute`
 - `path` {*String*} - Only available for `isActivePath` and `isNotActivePath`
 - `regex` {*String|RegExp*}
