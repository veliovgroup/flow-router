var requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    setTimeout(callback, 1000 / 60);
  };
})();
BlazeRenderer = (function() {
  function BlazeRenderer(rootEl) {
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

  BlazeRenderer.prototype.render = function(layout, template, data) {
    var _data, _template, _layout, self = this;

    _template = typeof Template !== "undefined" && Template !== null ? Template[template] : void 0;
    _layout   = typeof Template !== "undefined" && Template !== null ? Template[layout] : void 0;

    if (!_template) {
      throw new Meteor.Error(404, 'No such template: ' + template);
    }

    if (!_layout) {
      throw new Meteor.Error(404, 'No such layout: ' + layout);
    }

    if (_layout) {
      _data = {
        ___content: this.reactTemplate
      };

      if (data) {
        _data = _.extend(_data, data);
      }

      if (this.current.layout !== layout) {
        if (this.old) {
          Blaze.remove(this.old);
        }

        var getData = function getData () {
          return _data;
        };

        this.old = Blaze.renderWithData(_layout, getData, this.rootEl());
      } else {
        this.old.dataVar.set(_data);
      }

      if (this.current.template === template) {
        this.reactTemplate.set(null);
        requestAnimFrame(function updateTemplate () {
          self.reactTemplate.set(template);
        });
      } else {
        this.reactTemplate.set(template);
      }

      this.current.layout = layout;
      this.current.template = template;
    }
  };

  return BlazeRenderer;
})();