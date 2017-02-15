Router.prototype.url = function() {
  // We need to remove the leading base path, or "/", as it will be inserted
  // automatically by `Meteor.absoluteUrl` as documented in:
  // http://docs.meteor.com/#/full/meteor_absoluteurl
  return Meteor.absoluteUrl(pathWithoutBase = this.path.apply(this, arguments).replace(new RegExp('^' + (this._basePath || '/')), ''));
};

Meteor.startup(() => {
  Package['kadira:flow-router'] = Package['ostrio:flow-router-extra'];
});
