# Agent notes: `ostrio:flow-router-extra`

Use when **editing this repo**, **shipping Atmosphere releases**, or **implementing / debugging routing** in modern Meteor (including TS-first apps importing `meteor/ostrio:flow-router-extra`). Canonical long-form API: repo **`docs/`** (not bundled — see **`.meteorignore`**). This file is the **single agent-oriented** surface: patterns, gotchas, and where logic lives in source.

---

## Package identity

- **Atmosphere name:** `ostrio:flow-router-extra` (not legacy `kadira:flow-router`; tests sometimes alias `Package['kadira:flow-router']` for compatibility).
- **Version:** **`package.js`** → keep **README “Compatibility”** and siblings (`ostrio:flow-router-meta`, `ostrio:flow-router-title`) aligned on release.
- **Npm:** only **`qs`** — path/query handling (`lib/router-base.js`, client).

---

## `package.js` surface

| Item | Detail |
|------|--------|
| **Meteor** | `api.versionsFrom(['1.4', '2.8.0', '3.0.1', '3.4'])` |
| **Core deps** | `modules`, `ecmascript`, `promise`, `tracker`, `reactive-dict`, `reactive-var`, `ejson`, `check` both archs |
| **Weak TS** | `zodern:types@1.0.13`, `typescript` (weak) |
| **Weak Blaze** | `templating`, `blaze@2.0.0 \|\| 3.0.0` **client only** |
| **Entry** | `api.mainModule('client/_init.js', 'client')`, `api.mainModule('server/_init.js', 'server')` |
| **Types** | `api.addAssets('index.d.ts', ['client', 'server'])` + **`package-types.json`** (`typesEntry`) |

---

## Public exports

**Client** (`client/_init.js`):

```js
import {
  FlowRouter,
  Router,
  Route,
  Group,
  Triggers,
  BlazeRenderer,
  RouterHelpers,
} from 'meteor/ostrio:flow-router-extra';
```

**Server** (`server/_init.js`): same minus **`RouterHelpers`**. **`Triggers`** and **`BlazeRenderer`** are **empty stubs** — do not use them on the server.

**Singleton:** `FlowRouter` is a **`Router`** instance with **`FlowRouter.Router`** / **`FlowRouter.Route`** attached (companion packages, e.g. `ostrio:flow-router-meta`).

---

## TypeScript

- Types: **`index.d.ts`** + **`package-types.json`**. Apps: **`meteor add zodern:types`**, [Meteor TS guide](https://docs.meteor.com/guide/typescript.html), generate types so `meteor/ostrio:flow-router-extra` resolves.
- **Isomorphic imports:** gate **`RouterHelpers`** (and client-only APIs) with **`Meteor.isClient`** or split modules — server bundle does not export `RouterHelpers`.
- **`index.test-d.ts`:** keep in sync whenever **`index.d.ts`**, **`package.js`**, or public exports (`client/_init.js`, `server/_init.js`) change — extend assertions so **`tsd`** stays green.
- **Run type tests** from package root: **`meteor tsd`** (or **`npx tsd`**; same **`index.test-d.ts`** vs **`index.d.ts`**).

---

## Routes registration

- **API:** `FlowRouter.route(pathDef, options?)` → **`Route`** instance. Paths must start with **`/`**, except the catch-all **`'*'`** (see below).
- **Named routes:** set **`options.name`**. Use name or path fragment in **`FlowRouter.path(nameOrPathDef, params, queryParams)`** / **`FlowRouter.url(...)`**.
- **Isomorphic:** register the same table on **client** (navigation) and **server** (SSR / `matchPath`, meta packages). **`import { FlowRouter } from 'meteor/ostrio:flow-router-extra'`** in both; server has no `go` / DOM.

**Minimal:**

```js
FlowRouter.route('/', {
  name: 'home',
  action() {
    // Blaze: this.render(...); React/other: mount here
  },
});
```

**With param:**

```js
FlowRouter.route('/post/:id', {
  name: 'post',
  action(params) {
    // params.id
  },
});
```

**Implementation refs:** `client/router.js` (`route`, `_updateCallbacks`), `client/route.js` (hooks, Blaze `this.render`).

---

## Route groups registration

- **API:** `FlowRouter.group({ name, prefix, ...options })` → **`Group`**. Nested groups: **`group.group({ ... })`** (`lib/group-base.js`).
- **`prefix`:** must start with **`/`**; nested prefixes **concatenate**.
- **Merge rules:** child routes get **`triggersEnter` / `triggersExit`** merged (group first, then route). **`waitOn`** from group becomes **`waitFor`** chain on the route.
- **Omitted from group→route merge** (stay on route / group for addons): among others **`meta`**, **`link`**, **`script`**, **`title`**, **`titlePrefix`** — see **`lib/group-base.js`** `omit` list.

```js
const app = FlowRouter.group({
  name: 'app',
  prefix: '/app',
  triggersEnter: [/* shared enter */],
});

app.route('/dashboard', {
  name: 'dashboard',
  action() { /* matches /app/dashboard */ },
});

const admin = app.group({ name: 'admin', prefix: '/admin' });
admin.route('/users', { name: 'adminUsers' }); // /app/admin/users
```

**Tests / examples:** `test/client/group.spec.js`, `test/common/group.spec.js`.

---

## Wildcard (404 / not-found) route

- **Preferred:** `FlowRouter.route('*', { name: '__notFound', action() { ... } })` (or any name). Registered **last** internally so it does not shadow concrete routes (`client/router.js` `_updateCallbacks`).
- **Deprecated:** **`FlowRouter.notFound = { ... }`** — logs deprecation, rewrites to `route('*', ...)` with default name **`__notFound`** (`client/router.js`).

```js
FlowRouter.route('*', {
  name: 'notFound',
  action() {
    // 404 UI
  },
});
```

Companion packages (`ostrio:flow-router-title`, `ostrio:flow-router-meta`) document both styles.

---

## Global options (`FlowRouter` instance)

| Surface | Role |
|---------|------|
| **`FlowRouter.globals`** | **`Array`**: **`push({ waitOn, waitOnResources, ... })`** — merged into every route’s wait pipeline (see `client/route.js` / `docs/hooks/waitOnResources.md`). |
| **`FlowRouter.subscriptions`** | **Function** run as global subscription hook on the internal **`_globalRoute`** (`client/router.js` `_buildTracker`). |
| **`FlowRouter.decodeQueryParamsOnce`** | **`boolean`** — set **`true`** for new apps (fixes double-decode; default **`false`** for legacy). See **`docs/api/decodeQueryParamsOnce.md`**. |
| **`FlowRouter.triggers.enter` / `.exit`** | Register **global** triggers with optional **`{ only: ['routeName'] }`** or **`{ except: [...] }`** (`client/router.js` `_initTriggersAPI`, `client/triggers.js`). |
| **`FlowRouter.env`** | **`replaceState`**, **`reload`**, **`trailingSlash`** `Meteor.EnvironmentVariable`s — **`withReplaceState`**, **`reload`**, **`withTrailingSlash`** helpers on client. |
| **`FlowRouter.wait()`** | Defers default **`Meteor.startup`** **`initialize()`** until you call **`FlowRouter.initialize(options)`** (custom boot order). |
| **`FlowRouter.initialize(options)`** | **Once.** Calls **`MicroRouter.start`**: **`click`** (default `true`), **`popstate`** (default `true`). **Note:** some markdown in **`docs/api/initialize.md`** mentions `page.click`; **implementation** uses **top-level** `options.click` / `options.popstate` (`client/router.js`). |
| **`FlowRouter.onRouteRegister(cb)`** | Fires when a route is registered; payload strips heavy hooks (**`onRouteRegister`** / **`_triggerRouteRegister`** in `client/router.js` / `lib/router-base.js`). |

```js
FlowRouter.decodeQueryParamsOnce = true;

FlowRouter.globals.push({
  waitOnResources() {
    return { images: ['/logo.png'] };
  },
});

FlowRouter.subscriptions = function() {
  // this.register(name, handle) on global route
};

FlowRouter.triggers.enter([(context, redirect) => {
  if (!Meteor.userId()) redirect('/login');
}]);
```

---

## Hooks (execution order)

Order matches **`docs/hooks/README.md`**:

1. **`whileWaiting`**
2. **`waitOn`**
3. **`waitOnResources`**
4. **`endWaiting`**
5. **`data`**
6. **`onNoData`**
7. **`triggersEnter`** (after global **`FlowRouter.triggers.enter`** concatenation)
8. **`action`**
9. **`triggersExit`**

**Per-file docs:** `docs/hooks/*.md`. **Implementation:** `client/route.js` (`waitOn`, `callAction`, etc.).

**Add-on keys** on route/group options (**`title`**, **`meta`**, **`link`**, **`script`**, …) are for **`ostrio:flow-router-title`** / **`ostrio:flow-router-meta`**, not core router logic.

**Tracker rule:** do not use reactive globals (**`Session`**, etc.) inside **`.subscriptions`** in a way that trips **`safeToRun`** — error from **`_buildTracker`** in `client/router.js`.

---

## Global triggers API (`Triggers` + `FlowRouter.triggers`)

- **`FlowRouter.triggers.enter(triggers, filter?)`** / **`exit(...)`** — **`filter`**: **`{ only: ['routeName', ...] }`** OR **`{ except: [...] }`**, not both (`client/triggers.js` **`applyFilters`**).
- **Route-level:** **`triggersEnter`**, **`triggersExit`** on **`FlowRouter.route`** / group **`route`**.
- **Signature (conceptually):** `(context, redirect, stop, data)` — **`redirect(url, params?, query?)`** must be synchronous; **`stop()`** aborts chain (see `client/triggers.js` **`runTriggers`**).
- **`Triggers` export:** helpers like **`applyFilters`**, **`createRouteBoundTriggers`**, **`runTriggers`** — used internally; server **`Triggers`** is `{}`.

---

## RouterHelpers (client)

**Source:** `client/active.route.js` (initialized in `client/_init.js` with **`RouterHelpers = helpersInit(FlowRouter)`**).

**Programmatic (no Blaze):** use **`RouterHelpers`** methods directly:

| Method | Purpose |
|--------|---------|
| **`RouterHelpers.name(pattern)`** | Current route **name** matches **string** / **RegExp** (optional params for building path to compare). |
| **`RouterHelpers.path(pattern)`** | Current **path** matches **string** / **RegExp**. |
| **`RouterHelpers.pathFor(pathDef, params)`** | Build path string (like Blaze **`pathFor`**). |
| **`RouterHelpers.configure({ activeClass, caseSensitive, disabledClass, regex })`** | Active-route styling defaults. |

**With Blaze** (`templating` present): global helpers registered — **`pathFor`**, **`urlFor`**, **`param`**, **`queryParam`**, **`currentRouteName`**, **`subsReady`**, **`isSubReady`**, **`currentRouteOption`**, plus **active-route** style: **`isActiveRoute`**, **`isActivePath`**, **`isNotActiveRoute`**, **`isNotActivePath`**.

**Server:** only **`pathFor`**-ish subset per **`active.route.js`** (`pathFor`, `urlFor` on server object) — not full client helper set.

**Conflicts:** built-in replaces **`zimme:active-route`** and **`arillo:flow-router-helpers`** (`client/_init.js` warns if those packages exist).

---

## Repo layout (implementation map)

| Path | Role |
|------|------|
| **`client/_init.js`** | Singletons, exports, deprecated-package warnings |
| **`client/router.js`** | Client **`Router`**: **`MicroRouter`**, **`go`**, triggers, **`initialize`/`wait`**, **`_updateCallbacks`** (`'*'` last) |
| **`client/route.js`** | **`waitOn`**, **`data`**, **`action`**, Blaze, **`subscriptions`** |
| **`client/group.js`** | Group extends **`lib/group-base.js`** |
| **`client/triggers.js`** | **`Triggers.runTriggers`**, filters |
| **`client/active.route.js`** | **`RouterHelpers`** |
| **`lib/router-base.js`** | **`RouterBase`**: **`path`/`url`**, **`globals`**, **`group`**, **`onRouteRegister`** |
| **`lib/micro-router.js`** | History, **`pathToRegExp`** / **`matchPath`** (shared with server) |
| **`lib/group-base.js`** | Nested groups, prefix merge, **`route()`** option merge |
| **`server/router.js`** | **`matchPath`**, no navigation |
| **`server/plugins/fast-render.js`** | Fast render — see **`docs/fast-render-integration.md`** |

---

## Architecture (short)

1. **`RouterBase`** — shared route table, **`path`/`url`**, **`globals`**, **`group()`**.
2. **Client** — **`MicroRouter`** → **`_actionHandle`** → **`waitOn`** → **`Triggers.runTriggers`** (global + route) → Tracker → **`subscriptions`** + **`action`**.
3. **Server** — same registration for **matching**; **`matchPath`** uses **`lib/micro-router.js`**.

---

## Tips and tricks

- **Base path:** app served under **`ROOT_URL_PATH_PREFIX`** — router strips/adds base when talking to **`MicroRouter`** (`client/router.js` **`_stripBase`**).
- **Idempotent navigation:** **`go`** no-ops if path unchanged unless **`reload`** env forces redo (`client/router.js` **`go`**).
- **Named subs:** **`FlowRouter.subsReady('name')`** resolves handles registered with **`this.register('name', sub)`** inside **`subscriptions`** (route + global).
- **External redirect:** triggers cannot redirect off-origin HTTP(S); use **`window.location`** (`client/router.js` **`_redirectFn`**).
- **Avoid duplicate community packages** listed in **`client/_init.js`** (deprecated **`meteorhacks:*`**, etc.).

---

## Debugging

- **Console:** many paths log with prefix **`[ostrio:flow-router-extra]`** (`Meteor._debug`) — e.g. **`lib/_helpers.js`**, **`client/route.js`** (promise/wait errors).
- **Initialization:** **`FlowRouter.initialize()`** throws if called twice; **`wait()`** throws if called after init (`client/router.js`).
- **Triggers:** **`already redirected`** / **`redirect needs to be done in sync`** from **`client/triggers.js`** — async redirect misuse.
- **Tests:** **`meteor test-packages ./`** from repo root; helpers set **`decodeQueryParamsOnce = true`** in **`test/client/_helpers.js`** / **`test/server/_helpers.js`**.
- **Bundle:** **`docs/`**, **`test/`**, **`AGENTS.md`** excluded from app bundle via **`.meteorignore`** — edits do not affect Meteor client weight.

---

## Conventions (do not regress)

- **404:** prefer **`route('*', ...)`**; **`notFound` setter** deprecated.
- **Query strings:** **`FlowRouter.decodeQueryParamsOnce = true`** for new apps.
- **`underscore`:** not a runtime dependency (tests only if needed).

---

## Testing

- **`meteor test-packages ./`**, **`package.js` `onTest`** lists **`test/client/*.spec.js`**, **`test/common/*.spec.js`**.
- Meteor 3: **`package.js`** notes on fast-render test compatibility — verify before re-enabling.

---

## Ecosystem

Often released together: **`ostrio:flow-router-extra`**, **`ostrio:flow-router-title`**, **`ostrio:flow-router-meta`**, **`Flow-Router-Demos`**. After route table exists: **`new FlowRouterMeta(FlowRouter)`**, **`new FlowRouterTitle(FlowRouter)`** (client).

---

## Dev workflow

- Clean env: after **`meteor reset`** / removing **`node_modules`**, **`meteor npm install`** before **`meteor run`**.

---

## Learned User Preferences

- Prefer **`import`/`export`** over globals.
- Prefer **`async`/`await`** in **`Meteor.startup`** when wiring initialization.

## Learned Workspace Facts

- Blaze **`client/renderer.js`** / **`client/modules.js`** use **`requestAnimationFrame`** to chunk queued route renders and defer attaching in-memory layout to the live DOM; still appropriate (not deprecated); trimming legacy `webkit`/`moz` rAF prefixes is optional cleanup.
- **`ostrio:flow-router-meta`** and **`ostrio:flow-router-title`** hook private **`router._notfoundRoute`** / **`router._current`** and **`notFound`** / **`notfound`** option shape; changes to 404 or not-found internals in **`client/router.js`** must stay compatible with those integrations.
