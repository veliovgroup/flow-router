import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

const requestAnimFrame = (() => {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
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

  render(layout, template, data) {
    const _template = typeof Template !== 'undefined' && Template !== null ? Template[template] : void 0;
    const _layout   = typeof Template !== 'undefined' && Template !== null ? Template[layout] : void 0;

    if (!_template) {
      throw new Meteor.Error(404, 'No such template: ' + template);
    }

    if (!_layout) {
      throw new Meteor.Error(404, 'No such layout: ' + layout);
    }

    if (_layout) {
      let _data = {
        ___content: this.reactTemplate
      };

      if (data) {
        _data = _.extend(_data, data);
      }

      if (this.current.layout !== layout) {
        if (this.old) {
          Blaze.remove(this.old);
        }

        const getData = () => {
          return _data;
        };

        this.old = Blaze.renderWithData(_layout, getData, this.rootEl());
      } else {
        this.old.dataVar.set(_data);
      }

      if (this.current.template === template) {
        this.reactTemplate.set(null);
        requestAnimFrame(() => {
          this.reactTemplate.set(template);
        });
      } else {
        this.reactTemplate.set(template);
      }

      this.current.layout = layout;
      this.current.template = template;
    }
  }
}

export default BlazeRenderer;

