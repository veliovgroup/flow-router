const page = require('page');
const qs   = require('qs');
const requestAnimFrame = (() => {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60);
  };
})();

export { page, qs, requestAnimFrame };
