import { _ }           from 'meteor/underscore';
import { Blaze }       from 'meteor/blaze';
import { Meteor }      from 'meteor/meteor';
import { Template }    from 'meteor/templating';
import './yield.html';

const requestAnimFrame = (() => {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60);
  };
})();

class BlazeRenderer {
  constructor(opts = {}) {
    this.cacheElement = document.createElement('div');
    this.rootElement  = opts.rootElement || function () {
      return document.body;
    };

    const self    = this;
    this.layout   = null;
    this.yield    = null;
    this.template = null;
    this.key      = null;
    this.current  = {
      layout: null,
      template: null
    };
    this.inMemoryCache     = {};
    this.inMemoryRendering = opts.inMemoryRendering || false;
    this.getMemoryElement  = opts.getMemoryElement || function () {
      return document.createElement('div');
    };

    if (!this.getMemoryElement || !_.isFunction(this.getMemoryElement)) {
      throw new Meteor.Error(400, '{getMemoryElement} must be a function, which returns new DOM element');
    }

    if (!this.rootElement || !_.isFunction(this.rootElement)) {
      throw new Meteor.Error(400, 'You must pass function into BlazeRenderer constructor, which returns DOM element');
    }

    Template.yield.onCreated(function () {
      self.yield = this;
    });

    Template.yield.onRendered(function () {
      self.yield = this;
    });

    Template.yield.onDestroyed(() => {
      self.yield = null;
    });
  }

  render(__layout, __template, data = {}) {
    let layout    = __layout;
    let _layout   = false;
    let template  = __template;
    let _template = false;

    if (_.isString(template)) {
      _template = typeof Template !== 'undefined' && Template !== null ? Template[template] : void 0;
    } else if (template instanceof Blaze.Template) {
      _template = template;
      template  = template.viewName.replace('Template.', '');
    }

    if (_.isString(layout)) {
      _layout = typeof Template !== 'undefined' && Template !== null ? Template[layout] : void 0;
    } else if (layout instanceof Blaze.Template) {
      _layout = layout;
      layout  = layout.viewName.replace('Template.', '');
    }

    if (!_template) {
      throw new Meteor.Error(404, 'No such template: ' + template);
    }

    if (!_layout) {
      throw new Meteor.Error(404, 'No such layout: ' + layout);
    }

    if (this.inMemoryRendering) {
      this.key = '__key__' + layout + '__' +  template;

      if (!this.inMemoryCache['__layout__' + layout]) {
        this.inMemoryCache['__layout__' + layout] = this.getMemoryElement();
        this.cacheElement.appendChild(this.inMemoryCache['__layout__' + layout]);
        this.inMemoryCache['__layout__' + layout]._parentElement = this.cacheElement;
      }

      if (!this.inMemoryCache['__template__' + template]) {
        this.inMemoryCache['__template__' + template] = this.getMemoryElement();
        this.cacheElement.appendChild(this.inMemoryCache['__template__' + template]);
        this.inMemoryCache['__template__' + template]._parentElement = this.cacheElement;
      }

      if (!this.inMemoryCache[this.key]) {
        this.inMemoryCache[this.key] = {
          layout: this.inMemoryCache['__layout__' + layout],
          template: this.inMemoryCache['__template__' + template]
        };
      }
    }

    let updateTemplate = true;
    if (this.current.template !== template) {
      if (this.template) {
        Blaze.remove(this.template);
        this.template = null;
      }
      updateTemplate = false;
    }

    if (this.current.layout !== layout) {
      this.current.layout   = layout;
      this.current.template = template;
      if (this.layout) {
        Blaze.remove(this.layout);
        this.layout = null;
        this._render(_template, data, _layout);
      } else {
        this._render(_template, data, _layout);
      }
    } else {
      this.current.template = template;
      this._load(updateTemplate, true, _template, data);
    }
  }

  _render(_template, data, _layout) {
    const getData = () => {
      return data;
    };

    const rootElement = this.rootElement();
    if (!rootElement) {
      throw new Meteor.Error(400, 'BlazeRenderer can\'t find root element!');
    }

    if (this.inMemoryRendering) {
      this.inMemoryCache[this.key].layout._parentElement = rootElement;
      this.layout = Blaze.renderWithData(_layout, getData, this.inMemoryCache[this.key].layout);
      requestAnimFrame(() => {
        rootElement.appendChild(this.inMemoryCache[this.key].layout);
        this._load(false, false, _template, data);
      });
    } else {
      requestAnimFrame(() => {
        this.layout = Blaze.renderWithData(_layout, getData, rootElement);
        this._load(false, false, _template, data);
      });
    }
  }

  _load(updateTemplate, updateLayout, _template, data) {
    if (updateLayout) {
      this.layout.dataVar.set(data);
    }

    if (updateTemplate) {
      this.template.dataVar.set(data);
    } else {
      const getData = () => {
        return data;
      };

      if (!this.yield) {
        throw new Meteor.Error(400, 'Yield template is not found!');
      }

      if (this.inMemoryRendering) {
        this.inMemoryCache[this.key].template._parentElement = this.yield.view._domrange.parentElement;
        this.template = Blaze.renderWithData(_template, getData, this.inMemoryCache[this.key].template, this.yield.view);
        requestAnimFrame(() => {
          this.yield.view._domrange.parentElement.appendChild(this.inMemoryCache[this.key].template, this.layout);
        });
      } else {
        requestAnimFrame(() => {
          this.template = Blaze.renderWithData(_template, getData, this.yield.view._domrange.parentElement, this.yield.view);
        });
      }
    }
  }
}

export default BlazeRenderer;
