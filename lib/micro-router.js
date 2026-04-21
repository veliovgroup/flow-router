/**
 * MicroRouter — A minimal client-side router replacing page.js.
 *
 * Features:
 * - Path matching via path-to-regexp style patterns
 * - History API integration (pushState, replaceState, popstate)
 * - Click interception on <a> elements
 * - Base path support
 * - No double-decoding bugs
 *
 * This module is client-only.
 */

// --- Path matching engine ---

/**
 * Parse a path definition like '/users/:id/posts/:postId'
 * into a regex and a list of parameter names.
 *
 * Supports:
 * - :param — named parameter
 * - :param? — optional parameter
 * - :param* — zero or more segments
 * - :param+ — one or more segments
 * - * — catch-all
 * - :param(\\d+) — parameter with custom regex constraint
 */
function pathToRegExp(pathDef) {
  if (pathDef === '*') {
    return { regexp: /^(.*)$/, keys: [] };
  }

  const keys = [];

  // Single-pass replacement to preserve parameter order.
  // Matches all param styles: :name(regex), :name*, :name+, :name?, :name
  const pattern = pathDef.replace(/:(\w+)(?:\(([^)]+)\)|([+*?]))?/g, (_, name, customRegex, modifier) => {
    keys.push(name);
    if (customRegex) {
      return `(${customRegex})`;
    }
    switch (modifier) {
      case '*': return '(.*)';
      case '+': return '(.+)';
      case '?': return '(?:([^/]+))?';
      default:  return '([^/]+)';
    }
  });

  // Make trailing slash optional so /posts/ matches /posts and vice versa
  const regexp = new RegExp(`^${pattern.replace(/\/+$/, '')}\\/?$`);
  return { regexp, keys };
}

/**
 * Match a path against a compiled route pattern.
 * Returns params object or null if no match.
 */
function matchPath(compiledRoute, path) {
  const match = compiledRoute.regexp.exec(path);
  if (!match) return null;

  const params = {};
  for (let i = 0; i < compiledRoute.keys.length; i++) {
    const key = compiledRoute.keys[i];
    const val = match[i + 1];
    params[key] = val ? decodeURIComponent(val) : undefined;
  }
  return params;
}


// --- MicroRouter class ---

class MicroRouter {
  constructor() {
    this._routes = [];
    this._exits = [];
    this._basePath = '';
    this._running = false;
    this._currentContext = null;
    this._isRedirecting = false;
    this._onPopState = this._onPopState.bind(this);
    this._onClick = this._onClick.bind(this);
    this._options = {};
  }

  /**
   * Set the base path prefix.
   */
  base(path) {
    this._basePath = (path || '').replace(/\/+$/, '');
  }

  /**
   * Register a route handler.
   */
  route(pathDef, handler) {
    const compiled = pathToRegExp(pathDef);
    this._routes.push({ pathDef, compiled, handler });
  }

  /**
   * Register an exit handler for a path.
   */
  exit(pathDef, handler) {
    const compiled = pathToRegExp(pathDef);
    this._exits.push({ pathDef, compiled, handler });
  }

  /**
   * Clear all registered routes and exits.
   */
  reset() {
    this._routes = [];
    this._exits = [];
  }

  /**
   * Start the router — listen to popstate and intercept clicks.
   */
  start(options = {}) {
    if (this._running) return;

    this._options = options;
    this._running = true;

    if (options.popstate !== false) {
      window.addEventListener('popstate', this._onPopState);
    }

    if (options.click !== false) {
      document.addEventListener('click', this._onClick);
    }

    // Dispatch the current URL
    if (options.dispatch !== false) {
      this.show(this._getPath(), null, true, false);
    }
  }

  /**
   * Stop the router.
   */
  stop() {
    if (!this._running) return;
    this._running = false;
    window.removeEventListener('popstate', this._onPopState);
    document.removeEventListener('click', this._onClick);
  }

  /**
   * Navigate to a path using pushState.
   */
  show(path, state, dispatch, push) {
    if (!path) return;

    const ctx = this._createContext(path);

    // Run exit triggers for the current route
    this._runExits(ctx, () => {
      if (push !== false) {
        this._pushState(ctx, state);
      }

      if (dispatch !== false) {
        this._dispatch(ctx);
      }
    });
  }

  /**
   * Navigate using replaceState instead of pushState.
   */
  replace(path, state, dispatch) {
    if (!path) return;

    const ctx = this._createContext(path);

    this._runExits(ctx, () => {
      this._replaceState(ctx, state);

      if (dispatch !== false) {
        this._dispatch(ctx);
      }
    });
  }

  /**
   * Redirect — replaceState + dispatch.
   * Sets _isRedirecting to prevent exit triggers from re-running
   * for the current route when redirect() is called from within an exit trigger.
   */
  redirect(path) {
    this._isRedirecting = true;
    this.replace(path);
    this._isRedirecting = false;
  }

  // --- Internal methods ---

  _getPath() {
    const { pathname, search, hash } = window.location;
    let path = pathname + search + hash;

    // Strip base path
    if (this._basePath && path.startsWith(this._basePath)) {
      path = path.slice(this._basePath.length) || '/';
    }

    return path;
  }

  _createContext(fullPath) {
    // Split path and querystring
    const [pathPart, ...qsParts] = fullPath.split('?');
    const path = pathPart || '/';
    const querystring = qsParts.join('?');

    return {
      path: fullPath,
      pathname: path,
      querystring,
      params: {},
      state: null
    };
  }

  _dispatch(ctx) {
    const pathname = ctx.pathname;

    for (const route of this._routes) {
      const params = matchPath(route.compiled, pathname);
      if (params) {
        ctx.params = params;
        this._currentContext = ctx;
        route.handler(ctx);
        return;
      }
    }

    // No match — check for catch-all
    this._currentContext = ctx;
  }

  _runExits(newCtx, callback) {
    if (!this._currentContext || this._isRedirecting) {
      callback();
      return;
    }

    const oldPathname = this._currentContext.pathname;
    let index = 0;

    const next = () => {
      if (index >= this._exits.length) {
        callback();
        return;
      }

      const exitRoute = this._exits[index++];
      const params = matchPath(exitRoute.compiled, oldPathname);
      if (params) {
        exitRoute.handler(this._currentContext, next);
      } else {
        next();
      }
    };

    next();
  }

  _pushState(ctx, state) {
    const url = this._basePath + ctx.path;
    try {
      window.history.pushState(state || {}, '', url);
    } catch (e) {
      window.location.href = url;
    }
  }

  _replaceState(ctx, state) {
    const url = this._basePath + ctx.path;
    try {
      window.history.replaceState(state || {}, '', url);
    } catch (e) {
      window.location.href = url;
    }
  }

  _onPopState() {
    if (!this._running) return;
    const path = this._getPath();
    this.show(path, null, true, false);
  }

  _onClick(event) {
    // Only handle left clicks without modifiers
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    // Find the closest <a> element
    let el = event.target;
    while (el && el.nodeName !== 'A') {
      el = el.parentNode;
    }
    if (!el || el.nodeName !== 'A') return;

    // Skip links with specific attributes
    if (el.hasAttribute('download')) return;
    if (el.hasAttribute('target') && el.target !== '_self') return;
    if (el.getAttribute('rel') === 'external') return;

    // Only handle same-origin links
    const href = el.getAttribute('href');
    if (!href) return;
    if (/^(mailto:|tel:|javascript:)/.test(href)) return;

    // Check same origin
    try {
      const linkUrl = new URL(href, window.location.origin);
      if (linkUrl.origin !== window.location.origin) return;

      let path = linkUrl.pathname + linkUrl.search + linkUrl.hash;

      // Strip base path
      if (this._basePath && path.startsWith(this._basePath)) {
        path = path.slice(this._basePath.length) || '/';
      }

      event.preventDefault();
      this.show(path);
    } catch (e) {
      // Invalid URL, let browser handle it
    }
  }
}

export { MicroRouter, pathToRegExp, matchPath };
