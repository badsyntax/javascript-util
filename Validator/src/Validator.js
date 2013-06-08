/**
 * @file Basic validator <https://github.com/badsyntax/javascript-util>
 * @author Richard Willis <willis.rh@gmail.com>
 * @copyright Richard Willis 2013
 * @license MIT

 * @example
 * var validator = new Validator(data);
 * validator.rule('name', 'notEmpty', 'Name must not be empty');
 * validator.rule('name', 'minLength', 'Name must be 4 characters', 4);
 * validator.rule('name', 'maxLength', 'Name must be less than 12 characters', 12);
 * validator.rule('email', 'isEmail', 'Email must be a valid email');
 * validator.rule('date', 'isDate', 'Date must be valid');
 * var errors = validator.check();
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.Validator = factory();
  }
}(this, function factory() {

  "use strict";

  /**
   * Rule tests
   */
  var Tests = {
      /**
       * Checks if a value is empty. Can be any falsy value, eg: '', null, false.
       * @returns {boolean}
       */
      notEmpty: function (val) {
        return !!val;
      },
      /**
       * Checks if a value is a valid RFC822 email string.
       * Created by Ross Kendall - http://goo.gl/bNP6l
       * @returns {boolean}
       */
      isEmail: function (val) {
        return (/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/).test(val);
      },
      /**
       * Checks if a value is a valid ISO 8601 DateTime string.
       * Created by Dean Thrasher - http://goo.gl/G2bT2
       * @returns {boolean}
       */
      isDate: function (val) {
        return (/^([\+\-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+\-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/).test(val);
      }
  };

  /**
   * Validator
   * @name Validator
   * @constructor
   * @param {object} data - The data object to validate against,
   *  in the format of { prop: 'value' }
   */
  function Validator(data) {
    this.data = data || {};
    this.rules = [];
  }

  /**
   * Adds a new rule for a specified key to test against.
   * @name Validator#rule
   * @method
   * @param {string} key - The data key.
   * @param {string|function} tester - The tester key or function.
   * @param {string} message - The validation message.
   * @param [...] Zero or more rule options.
   */
  Validator.prototype.rule = function (key, tester, message) {

    // Get the rule tester from the default rules
    if (typeof tester === 'string') {
      if ((tester = Tests[tester]) === undefined) {
        return;
      }
    }
    // Invalid rule tester
    if (typeof tester !== 'function') {
      return;
    }

    this.rules.push({
      key: key,
      tester: tester,
      message: message || 'Invalid!',
      options: Array.prototype.slice.call(arguments, 3)
    });
  };

  /**
   * Runs the rule tests against the data set.
   * @name Validator#check
   * @method
   * @returns {null|Object}
   */
  Validator.prototype.check = function () {

    var errors = null;
    var i = 0;
    var j = this.rules.length;

    for(; i<j; i++) {

      var rule = this.rules[i];

      // Execute the rule test
      if (rule.tester(this.data[rule.key], rule.options)) {
        continue;
      }

      // Test failed, store the first error message for this key
      if (!errors) {
        errors = {};
      }
      if (!errors[rule.key]) {
        errors[rule.key] = rule.message;
      }
    }

    return errors;
  };

  return Validator;
}));