### `isNotActiveRoute` Template Helper

Template helper to check if the supplied route name doesn't match the currently active route's name.

Returns either a configurable `String`, which defaults to `'disabled'`, or `false`.

```handlebars
<li class="{{isNotActiveRoute 'home'}}">...</li>
<li class="{{isNotActiveRoute name='home'}}">...</li>
<li class="{{isNotActiveRoute regex='home|dashboard'}}">...</li>
{{#if isNotActiveRoute 'home'}}
  <span>Show only if 'home' isn't the current route's name</span>
{{/if}}
{{#if isNotActiveRoute regex='^products'}}
  <span>
    Show only if the current route's name doesn't begin with 'products'
  </span>
{{/if}}

<li class="{{isNotActiveRoute class='is-disabled' name='home'}}">...</li>
<li class="{{isNotActiveRoute 'home' class='is-disabled'}}">...</li>
```

#### Arguments
The following can be used by as arguments in `isNotActivePath`, `isNotActiveRoute`, `isActivePath` and `isActiveRoute` helpers.

 - Data context, Optional. `String` or `Object` with `name`, `path` or `regex`
 - `name` {*String*} - Only available for `isActiveRoute` and `isNotActiveRoute`
 - `path` {*String*} - Only available for `isActivePath` and `isNotActivePath`
 - `regex` {*String|RegExp*}
