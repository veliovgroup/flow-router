import { _ }           from 'meteor/underscore';
import { Blaze }       from 'meteor/blaze';
import { Meteor }      from 'meteor/meteor';
import { Template }    from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

const requestAnimFrame = (() => {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60);
  };
})();

class BlazeRenderer {
  constructor(rootEl) {
    this.rootEl = rootEl;
    this.old    = null;
    this.reactTemplate = new ReactiveVar(null);
    this.current = {
      layout: null,
      template: null
    };

    if (!rootEl || !_.isFunction(rootEl)) {
      throw new Meteor.Error(400, 'You must pass function into BlazeRenderer constructor, which returns DOM element');
    }
  }

  render(__layout, __template, data = {}) {
    let layout    = __layout;
    let template  = __template;
    let _template = '';

    if (_.isString(template)) {
      _template = typeof Template !== 'undefined' && Template !== null ? Template[template] : void 0;
    } else if (template instanceof Blaze.Template) {
      _template = template;
      template  = template.viewName.replace('Template.', '');
    } else {
      _template = false;
    }

    let _layout = '';
    if (_.isString(layout)) {
      _layout = typeof Template !== 'undefined' && Template !== null ? Template[layout] : void 0;
    } else if (layout instanceof Blaze.Template) {
      _layout = layout;
      layout  = layout.viewName.replace('Template.', '');
    } else {
      _layout = false;
    }

    if (!_template) {
      throw new Meteor.Error(404, 'No such template: ' + template);
    }

    if (!_layout) {
      throw new Meteor.Error(404, 'No such layout: ' + layout);
    }

    if (_layout) {
      requestAnimFrame(() => {
        let _data = {
          ___content: this.reactTemplate
        };

        if (data) {
          _data = Object.assign({}, _data, data);
        }

        this.reactTemplate.set(null);
        if (this.current.layout !== layout) {
          if (this.old) {
            Blaze.remove(this.old);
            this._render(template, _data, layout, _layout);
          } else {
            this._render(template, _data, layout, _layout);
          }
        } else {
          this._load(true, template, _data, layout);
        }
      });
    }
  }

  _render(template, _data, layout, _layout) {
    const getData = () => {
      return _data;
    };

    this._load(false, template, _data, layout);
    this.old = Blaze.renderWithData(_layout, getData, this.rootEl());
  }

  _load(isOld, template, _data, layout) {
    if (isOld) {
      this.old.dataVar.set(_data);
    }

    this.reactTemplate.set(template);
    this.current.layout = layout;
    this.current.template = template;
  }
}

export default BlazeRenderer;
