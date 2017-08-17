import { _ }        from 'meteor/underscore';
import { Blaze }    from 'meteor/blaze';
import { Meteor }   from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { requestAnimFrame } from './modules.js';

class BlazeRenderer {
  constructor(opts = {}) {
    this.rootElement  = opts.rootElement || function () {
      return document.body;
    };

    const self        = this;
    this.isRendering  = false;
    this.queue        = [];
    this.yield        = null;
    this.cache        = {};
    this.old          = this.newState();
    this.old.materialized = true;

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

    Template.yield = new Template('yield', function () {});

    Template.yield.onCreated(function () {
      self.yield = this;
    });

    Template.yield.onRendered(function () {
      self.yield = this;
      self.materialize(self.old);
    });

    Template.yield.onDestroyed(function () {
      if (self.old.template.view) {
        Blaze.remove(self.old.template.view);
        self.old.template.view = null;
        self.old.materialized = false;
      }
      self.yield = null;
    });
  }

  render(__layout, __template = false, __data = {}, __callback) {
    this.queue.push([__layout, __template, __data, __callback]);
    this.startQueue();
  }

  startQueue() {
    if (this.queue.length) {
      if (!this.isRendering) {
        this.isRendering = true;
        const task = this.queue.shift();
        this.proceed.apply(this, task);
        if (this.queue.length) {
          requestAnimFrame(this.startQueue.bind(this));
        }
      } else {
        requestAnimFrame(this.startQueue.bind(this));
      }
    }
  }

  proceed(__layout, __template = false, __data = {}, __callback) {
    let data      = __data;
    let layout    = __layout;
    let _layout   = false;
    let template  = __template;
    let _template = false;
    let callback  = __callback || function () {};

    if (_.isString(template)) {
      _template = typeof Template !== 'undefined' && Template !== null ? Template[template] : void 0;
    } else if (template instanceof Blaze.Template) {
      _template = template;
      template  = template.viewName.replace('Template.', '');
    } else if (_.isObject(template)) {
      data     = template;
      template = false;
    } else if (_.isFunction(template)) {
      callback = template;
      template = false;
    }

    if (_.isFunction(data)) {
      callback = data;
      data     = {};
    }

    if (_.isString(layout)) {
      _layout = typeof Template !== 'undefined' && Template !== null ? Template[layout] : void 0;
    } else if (layout instanceof Blaze.Template) {
      _layout = layout;
      layout  = layout.viewName.replace('Template.', '');
    }

    if (!_layout) {
      this.old.materialized = true;
      this.isRendering = false;
      throw new Meteor.Error(404, 'No such layout: ' + layout);
    }

    const current    = this.newState(layout, template);
    current.data     = data;
    current.callback = callback;

    let updateTemplate = true;

    if (this.old.template.name !== template) {
      current.template.name  = template;
      current.template.blaze = _template;
      this.newElement('template', current);
      if (this.old.template.view) {
        Blaze.remove(this.old.template.view);
        this.old.template.view = null;
        this.old.materialized = false;
      }

      updateTemplate = false;
    } else {
      current.template = this.old.template;
    }

    if (this.old.layout.name !== layout) {
      current.layout.name    = layout;
      current.layout.blaze   = _layout;
      current.template.name  = template;
      current.template.blaze = _template;
      this.newElement('layout', current);

      if (this.old.layout.view) {
        Blaze.remove(this.old.layout.view);
        this.old.layout.view = null;
      }

      this._render(current);
    } else if (template) {
      current.layout         = this.old.layout;
      current.template.name  = template;
      current.template.blaze = _template;
      this._load(updateTemplate, true, current);
    } else {
      current.layout = this.old.layout;
      this.isRendering = false;
      current.materialized = true;
      current.callback();
      current.callback = () => {};
    }

    this.old = current;
  }

  _render(current) {
    const getData = () => {
      return current.data;
    };

    const rootElement = this.rootElement();
    if (!rootElement) {
      throw new Meteor.Error(400, 'BlazeRenderer can\'t find root element!');
    }

    if (this.inMemoryRendering) {
      current.layout.view = Blaze.renderWithData(current.layout.blaze, getData, current.layout.element);
      requestAnimFrame(() => {
        rootElement.appendChild(current.layout.element);
        this._load(false, false, current);
      });
    } else {
      requestAnimFrame(() => {
        current.layout.view = Blaze.renderWithData(current.layout.blaze, getData, rootElement);
        this._load(false, false, current);
      });
    }
  }

  _load(updateTemplate, updateLayout, current) {
    if (updateLayout && current.layout.view) {
      current.layout.view.dataVar.set(current.data);
    }

    if (current.template.view && updateTemplate) {
      current.template.view.dataVar.set(current.data);
      this.isRendering = false;
      current.materialized = true;
      current.callback();
      current.callback = () => {};
    } else if (!current.template.name) {
      this.isRendering = false;
      current.materialized = true;
      current.callback();
      current.callback = () => {};
    } else if (current.template.name && !this.yield) {
      this.isRendering = false;
      current.materialized = false;
      current.callback();
      current.callback = () => {};
    } else if (current.template.name && this.yield) {
      this.materialize(current);
    }
  }

  newElement(type, current) {
    if (!this.inMemoryRendering) {
      return;
    }

    current[type].parent  = current[type].parent ? current[type].parent : document.createElement('div');
    if (!current[type].element) {
      current[type].element = this.getMemoryElement();
      current[type].parent.appendChild(current[type].element);
      current[type].element._parentElement = current[type].parent;
    }
  }

  newState(layout = false, template = false) {
    const base = {
      materialized: false,
      data: null,
      callback: function () {},
      layout: {
        view: null,
        name: '',
        blaze: null,
        parent: null,
        element: null
      },
      template: {
        view: null,
        name: '',
        blaze: null,
        parent: null,
        element: null
      }
    };

    if (!this.inMemoryRendering || (!layout && !template)) {
      return base;
    }

    if (layout && this.cache[layout]) {
      base.layout = this.cache[layout];
    }

    if (template && this.cache[template]) {
      base.template = this.cache[template];
    }

    this.cache[template] = base;
    return base;
  }

  materialize(current) {
    if (current.template.name && !current.materialized) {
      const getData = () => {
        return current.data;
      };

      if (!this.yield) {
        current.materialized = false;
        return;
      }

      current.materialized = true;
      if (this.inMemoryRendering) {
        current.template.view = Blaze.renderWithData(current.template.blaze, getData, current.template.element, this.yield.view);
        requestAnimFrame(() => {
          if (this.yield) {
            this.yield.view._domrange.parentElement.appendChild(current.template.element);
            this.isRendering = false;
            current.materialized = true;
            current.callback();
            current.callback = () => {};
          } else {
            current.materialized = false;
          }
        });
      } else {
        requestAnimFrame(() => {
          if (this.yield) {
            current.template.view = Blaze.renderWithData(current.template.blaze, getData, this.yield.view._domrange.parentElement, this.yield.view);
            this.isRendering = false;
            current.materialized = true;
            current.callback();
            current.callback = () => {};
          } else {
            current.materialized = false;
          }
        });
      }
    }
  }
}

export default BlazeRenderer;
