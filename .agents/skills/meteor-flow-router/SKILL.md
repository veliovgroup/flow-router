---
name: meteor-flow-router
description: Guides Meteor routing with ostrio:flow-router-extra plus head/title companions ostrio:flow-router-meta and ostrio:flow-router-title — registration, hooks, globals, triggers, RouterHelpers, document.title, and meta/link/script merge rules. Use when editing Flow Router ecosystem packages, wiring Meteor client routes, SEO head tags, JSON-LD, 404 routes, TypeScript imports, or debugging navigation and head sync.
---

# Meteor Flow Router (ostrio stack)

## When this applies

- Implementing or debugging **client** routing in Meteor with **`ostrio:flow-router-extra`** (not legacy `kadira:flow-router`).
- **`ostrio:flow-router-meta`**: `<head>` **`meta` / `link` / `script`** from route/group/globals options.
- **`ostrio:flow-router-title`**: **`document.title`** from **`title` / `titlePrefix`** on routes, groups, globals, and not-found flows.
- Isomorphic **path/url** registration (client + server); navigation and DOM only on **client**.

Longer file maps and maintainer detail: [reference.md](reference.md) (links to canonical **`AGENTS.md`** per repo).

---

## Stack overview

| Package | Atmosphere | Arch | Role |
|---------|--------------|------|------|
| Core router | `ostrio:flow-router-extra` | client + server | Routes, groups, hooks, `matchPath`, `RouterHelpers` (client) |
| Head tags | `ostrio:flow-router-meta` | **client only** | `meta`, `link`, `script`; implies **`ostrio:flow-router-title`** and re-exports **`FlowRouterTitle`** |
| Title | `ostrio:flow-router-title` | **client only** | `title`, `titlePrefix` → `document.title` |

**Peer versions (align on release):** router **`package.js`** / README “Compatibility”; meta README pins **`ostrio:flow-router-extra@3.13.0+`** and implies **`ostrio:flow-router-title@3.5.0`**.

---

## `ostrio:flow-router-extra` — identity

- **Singleton:** **`FlowRouter`** is a **`Router`** instance with **`FlowRouter.Router`** / **`FlowRouter.Route`** attached.
- **Types:** **`index.d.ts`** + **`package-types.json`** (`typesEntry`). Apps: **`meteor add zodern:types`**, [Meteor TS guide](https://docs.meteor.com/guide/typescript.html); gate **`RouterHelpers`** and other client-only APIs with **`Meteor.isClient`** or split modules — server bundle does not export **`RouterHelpers`**.
- **Canonical API narrative:** repo **`docs/`** (often excluded from app bundle via **`.meteorignore`**).

### Public exports

**Client** (`meteor/ostrio:flow-router-extra`):

`FlowRouter`, `Router`, `Route`, `Group`, `Triggers`, `BlazeRenderer`, `RouterHelpers`.

**Server:** same minus **`RouterHelpers`**. **`Triggers`** and **`BlazeRenderer`** are **empty stubs** on server — do not use there.

### Routes

- **`FlowRouter.route(pathDef, options?)`** → **`Route`**. Paths start with **`/`**, except catch-all **`'*'`** (register **last** internally so it does not shadow concrete routes).
- **Named routes:** **`options.name`**; use in **`FlowRouter.path` / `FlowRouter.url`**.
- **Isomorphic:** register same table on **client** and **server** (SSR / `matchPath` / meta packages). Server has no **`go`** / DOM.

### Groups

- **`FlowRouter.group({ name, prefix, ... })`**. **`prefix`** starts with **`/`**; nested prefixes **concatenate**.
- **Merge:** child routes get **`triggersEnter` / `triggersExit`** merged (group first, then route). Group **`waitOn`** becomes **`waitFor`** chain on route.
- **Not merged** from group→route for addons (stay on route/group): among others **`meta`**, **`link`**, **`script`**, **`title`**, **`titlePrefix`** — see **`lib/group-base.js`** `omit` list.

### Wildcard / 404

- **Preferred:** **`FlowRouter.route('*', { name: '…', action() { … } })`** (any name; e.g. **`__notFound`**).
- **Deprecated:** **`FlowRouter.notFound = { … }`** — logs deprecation, rewrites to **`route('*', …)`**. Companion title/meta packages still support legacy not-found shape via **`_notfoundRoute`** wrapping.

### Globals and router instance

| Surface | Role |
|---------|------|
| **`FlowRouter.globals`** | **`Array`**: **`push({ waitOn, waitOnResources, … })`** merged into every route’s wait pipeline |
| **`FlowRouter.subscriptions`** | Global subscription hook on internal **`_globalRoute`** |
| **`FlowRouter.decodeQueryParamsOnce`** | Set **`true`** in new apps (fixes double-decode; default **`false`** legacy) |
| **`FlowRouter.triggers.enter` / `.exit`** | Global triggers; optional **`{ only: ['routeName'] }`** or **`{ except: […] }`** |
| **`FlowRouter.env`** | **`replaceState`**, **`reload`**, **`trailingSlash`** helpers |
| **`FlowRouter.wait()`** / **`FlowRouter.initialize(options)`** | Defer / start **`MicroRouter`** (**`click`**, **`popstate`** defaults). **`initialize`** **once** — throws if twice. Optional **`options.maxWaitFor`** (ms) sets **`FlowRouter.maxWaitFor`** (default **`120000`**, same as **`MAX_WAIT_FOR_MS`** export). |
| **`FlowRouter.maxWaitFor`** | Default max time (ms) for each route’s **`waitOn`** promise phase and subscription **`ready()`** wait; override per route with **`route({ maxWaitFor, … })`**. When time is exceeded, **`action`** still runs; **navigating away** aborts **`waitOn`** and skips **`action`** for the route being left. |
| **`FlowRouter.onRouteRegister(cb)`** | Fires on route registration (payload strips heavy hooks) |

### Hook order (core)

1. **`whileWaiting`** → **`waitOn`** → **`waitOnResources`** → **`endWaiting`**
2. **`data`** → **`onNoData`**
3. **`triggersEnter`** (after global **`FlowRouter.triggers.enter`**)
4. **`action`**
5. **`triggersExit`**

**Add-on keys** **`title`**, **`meta`**, **`link`**, **`script`** are consumed by **title/meta** packages, not core router execution.

**Tracker:** avoid reactive globals inside **`.subscriptions`** in ways that break **`safeToRun`** (see router **`_buildTracker`**).

### Triggers

- **`FlowRouter.triggers.enter(triggers, filter?)`** / **`exit`** — **`filter`**: **`only`** OR **`except`**, not both.
- **Signature (conceptual):** **`(context, redirect, stop, data)`** — **`redirect`** must be **synchronous**; **`stop()`** aborts chain.

### RouterHelpers (client)

From **`meteor/ostrio:flow-router-extra`**: **`name`**, **`path`**, **`pathFor`**, **`configure`**, etc. With Blaze: **`pathFor`**, **`urlFor`**, **`param`**, **`queryParam`**, **`currentRouteName`**, **`subsReady`**, active-route helpers. **Server:** subset (e.g. **`pathFor`** / **`urlFor`**), not full client helper set.

### Implementation map (core)

| Area | Paths (typical) |
|------|------------------|
| Client router | **`client/router.js`**, **`client/route.js`**, **`client/group.js`**, **`client/triggers.js`** |
| Shared | **`lib/router-base.js`**, **`lib/micro-router.js`**, **`lib/group-base.js`** |
| Server | **`server/router.js`** (`matchPath`), **`server/plugins/fast-render.js`** |

### Tips

- **`ROOT_URL_PATH_PREFIX`**: base path strip/add in client router.
- **Idempotent `go`:** no-op if path unchanged unless **`reload`** env forces redo.
- **Named subs:** **`FlowRouter.subsReady('name')`** for **`this.register('name', sub)`** in **`subscriptions`**.
- **External redirect:** triggers cannot redirect off-origin HTTP(S); use **`window.location`**.
- **Debugging:** logs prefixed **`[ostrio:flow-router-extra]`**; common errors: double **`initialize`**, async **`redirect`** misuse, **`wait()`** after init.

### Testing (router package)

**`meteor test-packages ./`** from package root; **`meteor npm run test:tsd`** or **`meteor npm exec tsd`** against **`index.test-d.ts`** — update **`index.test-d.ts`** when **`index.d.ts`** / package exports change.

---

## `ostrio:flow-router-meta` — identity

- **Client-only** — **`api.mainModule(..., 'client')`**; no SSR head injection from this package.
- **Implies** **`ostrio:flow-router-title`** — import **`FlowRouterMeta`** and **`FlowRouterTitle`** from **`meteor/ostrio:flow-router-meta`** if you want one import line.

### Wiring

```js
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// After all FlowRouter.route / group / globals (including `*` 404 if used):
new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);
```

- **`new FlowRouterMeta(router)`** — registers **`router.triggers.enter`** with **`metaHandler`**; wraps **`router._notfoundRoute`** so 404 still syncs head.
- Does **not** monkey-patch **`route` / `group`** — reads **`context.route.options`**, **`context.route.group`**, **`router.globals`** at enter time.
- **`metaHandler`** receives **`data`** from route **`data()`** (fourth arg to enter triggers). **Debounce:** **5ms** timer coalesces rapid navigations.

### Allowed option keys

On **`FlowRouter.route`**, **`FlowRouter.group`**, and objects in **`FlowRouter.globals.push`**:

- **`meta`**, **`link`**, **`script`** — plain object, **`(params, queryParams, data) => object`**, or nested functions resolved by **`_getValue`**.
- **`null`** / empty resolved value **removes** that logical key’s DOM node. Keys **absent** from merged result are **not** auto-removed on navigation — use **`null`** to unset stale logical names.

### Merge order (`_setTags`)

1. **`FlowRouter.globals`** — iterated **last index → 0**; **`Object.assign`** so **earlier `push` wins** over later for same logical key.
2. **Groups** — walk **`group.parent`**: **innermost group that defines that tag type** (`meta` / `link` / `script`) supplies the group branch (not a deep merge of every ancestor’s separate objects).
3. **Route** — merged **last** (**route wins** over globals + group for same logical keys).

**Logical names** = object keys under `meta` / `link` / `script`; DOM uses **`data-name="<key>"`**.

### Attribute shorthand

- **`meta`:** string → **`name="<key>"`**, **`content="<string>"`**; object spreads attrs.
- **`link`:** string → **`rel="<key>"`**, **`href="…"`**.
- **`script`:** string → **`src="…"`**; object as-is for attrs.
- **`innerHTML`:** special-cased (e.g. **`application/ld+json`**). Non-string attr values skipped.

**Loaded CSS/JS** stay in memory when tags removed — cannot fully “unload” global side effects.

---

## `ostrio:flow-router-title` — identity

- **Peer:** app must add **`ostrio:flow-router-extra@3.13.0+`**.
- **Do not import from server bundles.**

### Wiring

1. Define routes / groups / globals (including **`FlowRouter.route('*', …)`** if used).
2. **`new FlowRouterTitle(FlowRouter)`** after routes (typically end of client router module).
3. **`FlowRouter.initialize()`** when app ready.

### API

- Registers **`triggers.enter`** / **`triggers.exit`**; wraps **`_notfoundRoute`** for legacy **`FlowRouter.notFound`** / not-found options.
- **`instance.set(string): boolean`** — sets **`document.title`** (reactive internal **`ReactiveVar`** + **`setTimeout(0)`**).

### Options

| Option | Notes |
|--------|--------|
| **`title`** | string or **`(params, queryParams, data) => string`** — route wins over group; functions can run in **`Tracker.autorun`** |
| **`titlePrefix`** | On groups; nested: **parent prefixes first**, concatenated |
| **`FlowRouter.globals`** | First object with **`title`** seeds **default** when route has no **`title`** |

**Priority (high → low):** explicit route **`title`** (with prefix rules) → group **`title`** / prefixes → **`globals`** default → initial HTML **`document.title`**.

**404:** supports catch-all **`*`** and legacy **`FlowRouter.notFound`** (see package README).

---

## Conventions (do not regress)

- Prefer **`FlowRouter.route('*', …)`** over deprecated **`FlowRouter.notFound`** setter.
- Set **`FlowRouter.decodeQueryParamsOnce = true`** for new apps.
- **`underscore`:** not a runtime dependency of core router.
- **Ecosystem releases:** often ship **router + meta + title + demos** together.

---

## Companion init (typical client entry)

```js
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FlowRouterMeta, FlowRouterTitle } from 'meteor/ostrio:flow-router-meta';

// … define routes, groups, globals …

new FlowRouterMeta(FlowRouter);
new FlowRouterTitle(FlowRouter);

Meteor.startup(() => {
  FlowRouter.initialize();
});
```

If you only need title (no meta/link/script), import **`FlowRouterTitle`** from **`meteor/ostrio:flow-router-title`** instead.
