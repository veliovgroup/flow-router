### render method

`this.render()` method is available only [inside hooks](https://github.com/VeliovGroup/flow-router/tree/master/docs#hooks-in-execution-order).

#### With Layout
`this.render(layout, template [, data, callback])`
 - `layout` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of layout template (*which has* `yield`)
 - `template` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of template (*which will be rendered into yield*)
 - `data` {*Object*} - [Optional] Object of data context to use in template. Will be passed to both `layout` and `template`
 - `callback` {*Function*} - [Optional] Callback triggered after template is rendered and placed into DOM. This callback has no context

#### Without Layout
`this.render(template [, data, callback])`
 - `template` {*String*|*Blaze.Template*} - *Blaze.Template* instance or a name of template (*which will be rendered into* `body` *element, or element defined in* `FlowRouter.Renderer.rootElement`)
 - `data` {*Object*} - [Optional] Object of data context to use in template
 - `callback` {*Function*} - [Optional] Callback triggered after template is rendered and placed into DOM. This callback has no context

#### Features:
 - Made with animation performance in mind, all DOM interactions are wrapped into `requestAnimationFrame`
 - In-memory rendering (*a.k.a. off-screen rendering, virtual DOM*), disabled by default, can be activated with `FlowRouter.Renderer.inMemoryRendering = true;`

#### Settings (*Experimental!*):
 - Settings below is experimental, targeted to reduce on-screen DOM layout reflow, speed up rendering on slower devices and Phones in first place, by moving DOM computation to off-screen (*a.k.a. In-Memory DOM, Virtual DOM*)
 - `FlowRouter.Renderer.rootElement` {*Function*} - Function which returns root DOM element where layout will be rendered, default: `document.body`
 - `FlowRouter.Renderer.inMemoryRendering` {*Boolean*} - Enable/Disable in-memory rendering, default: `false`
 - `FlowRouter.Renderer.getMemoryElement` {*Function*} - Function which returns default in-memory element, default: `document.createElement('div')`. Use `document.createDocumentFragment()` to avoid extra parent elements
     * The default `document.createElement('div')` will cause extra wrapping `div` element
     * `document.createDocumentFragment()` won't cause extra wrapping `div` element but may lead to exceptions in Blaze engine, depends from your app implementation

#### Further reading
 - [Templating](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating.md)
 - [Templating with "Regions"](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-regions.md)
 - [Templating with Data](https://github.com/VeliovGroup/flow-router/blob/master/docs/templating-with-data.md)
