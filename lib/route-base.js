class RouteBase {
  constructor(router, pathDef, options = {}, group) {
    this.options      = options;
    this.pathDef      = pathDef;
    // Route.path is deprecated and will be removed in a future version
    this.path         = pathDef;
    this.name         = options.name;
    this.conf         = options.conf || {};
    this.group        = group;
    this._router      = router;
    this._action      = options.action || Function.prototype;
    this._subsMap     = {};
    this._subscriptions = options.subscriptions || Function.prototype;
  }

  clearSubscriptions() {
    this._subsMap = {};
  }

  register(name, sub) {
    this._subsMap[name] = sub;
  }

  getSubscription(name) {
    return this._subsMap[name];
  }

  getAllSubscriptions() {
    return this._subsMap;
  }

  callSubscriptions(current) {
    this.clearSubscriptions();
    if (this.group) {
      this.group.callSubscriptions(current);
    }
    this._subscriptions(current.params, current.queryParams);
  }
}

export default RouteBase;
