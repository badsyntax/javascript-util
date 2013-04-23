/**
 * ECMAScript 5 prototypal inheritance helper
 * https://github.com/badsyntax/javascript-util
 *
 * ECMAScript 5 compatibility table:
 * http://kangax.github.io/es5-compat-table/
 *
 * Useful links:
 * https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Object/defineProperty
 * https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
 * https://developer.mozilla.org/en/docs/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
 *
 * Basic usage:
 * var Animal = function(){};
 * var Cat = function(){};
 * Cat.inherits(Animal);
 * Cat.prototype.purr = function(){};
 * var Dog = function(){};
 * Dog.inherits(Animal, { bark: function() {} });
 */

Object.defineProperty(Object.prototype, 'mixin', {
  value: function(obj) {
    Object.getOwnPropertyNames(obj).forEach(function(prop) {
      Object.defineProperty(this, prop, Object.getOwnPropertyDescriptor(obj, prop))
    }.bind(this));
  }
});

Object.defineProperty(Function.prototype, 'inherits', {
  value: function(_super, _mixin) {
    this.prototype = Object.create(_super.prototype);
    this.prototype.constructor = this;
    if (_mixin instanceof Object) {
      this.prototype.mixin(_mixin);
    }
    return this;
  }
});
