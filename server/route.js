class Route {
  constructor(router, pathDef, options = {}) {
    this.options = options;
    this.name = options.name;
    this.pathDef = pathDef;

    // Route.path is deprecated and will be removed in 3.0
    this.path = pathDef;

    this.action = options.action || Function.prototype;
    this.subscriptions = options.subscriptions || Function.prototype;
    this._subsMap = {};
  }


  register(name, sub) {
    this._subsMap[name] = sub;
  }


  subscription(name) {
    return this._subsMap[name];
  }


  middleware() {
    // ?
  }
}

export default Route;
