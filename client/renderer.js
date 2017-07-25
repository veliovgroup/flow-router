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
  constructor(rootEl) {
    const self     = this;
    this.rootEl   = rootEl;
    this.layout   = null;
    this.yield    = null;
    this.template = null;
    this.current  = {
      layout: null,
      template: null
    };

    if (!rootEl || !_.isFunction(rootEl)) {
      throw new Meteor.Error(400, 'You must pass function into BlazeRenderer constructor, which returns DOM element');
    }

    Template.yield.onCreated(function () {
      self.yield = this;
    });

    Template.yield.onRendered(function () {
      self.yield = this;
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
        requestAnimFrame(() => {
          Blaze.remove(this.layout);
          this.layout = null;
          this._render(_template, data, _layout);
        });
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

    requestAnimFrame(() => {
      this.layout = Blaze.renderWithData(_layout, getData, this.rootEl());
      this._load(false, false, _template, data);
    })
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
      requestAnimFrame(() => {
        this.template = Blaze.renderWithData(_template, getData, this.yield.view._domrange.parentElement);
      });
    }
  }
}

export default BlazeRenderer;
