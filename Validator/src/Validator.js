/**
 * Basic validator
 * Copyright (c) 2013 Richard Willis; Licensed MIT
 * https://github.com/badsyntax/javascript-util
 *
 * Usage:
 * var validator = new Validator(data);
 * validator.rule('name', 'notEmpty', 'Name must not be empty');
 * validator.rule('email', 'isEmail', 'Email must be a valid email');
 * validator.rule('date', 'isDate', 'Date must be valid');
 * var errors = validator.check();
 */
(function (root, factory) {
  if (typeof exports === 'object') {
    // CommonJS
    factory(exports);
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports'], factory);
  } else {
    // Browser globals
    factory(root);
  }
}(this, function (exports) {

  var Rules = (function () {
    return {
      notEmpty: function (val) {
        return !!val;
      },
      isEmail: function (val) {
        // RFC822 - Based on code written by Ross Kendall - http://goo.gl/bNP6l
        return (/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/).test(val);
      },
      isDate: function (val) {
        // ISO8601 - http://goo.gl/G2bT2
        return (/^([\+\-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+\-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/).test(val);
      }
    };
  })();

  function Validator(data) {
    this.data = data || {};
    this.rules = [];
  }

  Validator.prototype.rule = function (key, tester, message) {

    // Get the rule tester from the default rules
    if (typeof tester === 'string') {
      if ((tester = Rules[tester]) === undefined) {
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
      message: message || 'Invalid!'
    });
  };

  Validator.prototype.check = function () {

    var errors = null, i = 0, j = this.rules.length;

    for(; i<j; i++) {

      var rule = this.rules[i];

      if (rule.tester(this.data[rule.key])) {
        continue;
      }

      errors = errors || {};
      errors[rule.key] = errors[rule.key] || rule.message;
    }

    return errors;
  };

  exports.Validator = Validator;
}));