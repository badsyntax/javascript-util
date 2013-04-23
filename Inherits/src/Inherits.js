/**
 * ECMAScript 5 prototypal inheritance helper
 * https://github.com/badsyntax/javascript-util
 *
 * ECMAScript 5 compatibility table:
 * http://kangax.github.io/es5-compat-table/
 */

Object.defineProperty(Object.prototype, 'mixin', {
  value: function(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        this[prop] = obj[prop];
      }
    }
  }
});

Object.defineProperty(Function.prototype, 'inherits', {
  value: function(_super, _subProto) {
    this.prototype = Object.create(_super.prototype);
    this.prototype.constructor = this;
    this.prototype.mixin(_subProto);
    return this;
  }
});
