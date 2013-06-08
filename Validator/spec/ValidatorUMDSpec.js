(function (root, factory) {
  if (typeof exports === 'object') {
    // Node/CommonJS
    factory(
      require('../src/Validator')
    );
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      '../src/Validator'
    ], factory);
  } else {
    // Browser globals
    factory(root.Validator);
  }
}(this, function factory(Validator) {

  describe('Validator', function() {

    describe('Construction and object definition', function() {

      it('Sets the data and rules on constuction', function() {

        var data = {
          email: 'test@test.com'
        };

        var validator = new Validator(data);
        expect(typeof validator.data).not.toBe('undefined');
        expect(typeof validator.rules).not.toBe('undefined');
        expect(validator.data).toBe(data);
      });

      it('Sets an empty data object if no data is passed in on construction', function() {
        var validator = new Validator();
        expect(validator.data).toEqual({});
      });

      it('Has \'rule\' and \'check\' public API methods', function() {

        var validator = new Validator();
        expect(typeof validator.rule).toBe('function');
        expect(typeof validator.check).toBe('function');
      });
    });

    describe('Setting rules', function() {

      it('Sets mulitple rules with custom tests for a given key', function() {

        var validator = new Validator();
        var test = function() {};

        validator.rule('test', test, 'failed');
        validator.rule('test', test, 'failed');

        expect(validator.rules.length).toBe(2);
        expect(validator.rules[0].tester).toBe(test);
      });

      it('Sets mulitple rules with default tests for a given key', function() {

        var validator = new Validator();

        validator.rule('test', 'notEmpty', 'failed');
        validator.rule('test', 'isEmail', 'failed');

        expect(validator.rules.length).toBe(2);
        expect(typeof validator.rules[0].tester).toBe('function');
        expect(typeof validator.rules[1].tester).toBe('function');
      });

      it('Sets rules with a custom or default message', function() {

        var validator = new Validator();
        var test = function() {};

        validator.rule('test', test, 'failed');

        expect(validator.rules[0]).toEqual({
          key: 'test',
          tester: test,
          message: 'failed',
          options: []
        });

        validator.rule('test', test, 'failed');

        expect(validator.rules[1]).toEqual({
          key: 'test',
          tester: test,
          message: 'failed',
          options: []
        });
      });

      it('Sets rules with custom options', function() {
          /** @TODO */
      });

      it('Does not set a rule if the default test does not exist, or if a custom test has not been specified', function() {
        var validator = new Validator();
        validator.rule('test', 'somethingThatDoesntExist', 'failed');
        expect(validator.rules.length).toBe(0);
        validator.rule('test', null, 'failed');
        expect(validator.rules.length).toBe(0);
      });

      it('Does not set a rule if the default test does not exist, or if a custom test has not been specified', function() {
        var validator = new Validator();
        validator.rule('test', 'somethingThatDoesntExist', 'failed');
        expect(validator.rules.length).toBe(0);
        validator.rule('test', null, 'failed');
        expect(validator.rules.length).toBe(0);
      });
    });

    describe('Checking rules', function() {

      it('Runs all the tests against the data set, and returns and object of errors', function() {

        var validator = new Validator();
        var test = function() {
          return false;
        };

        validator.rule('test', test, 'failed');
        validator.rule('test', test, 'failed');

        var errors = validator.check();

        expect(typeof errors).toBe('object');
        expect(typeof errors.test).not.toBe('undefined');
        expect(errors.test).toBe('failed');
      });

      it('Runs the tests, and returns null if there are no errors', function() {

        var validator = new Validator();
        var test = function() {
          return true;
        };

        validator.rule('test', test, 'failed');

        var errors = validator.check();

        expect(errors).toBe(null);
      });


      it('Runs the tests, and only stores the first failed validation error message for a key', function() {

        var validator = new Validator();
        var test = function() {
          return false;
        };

        validator.rule('test', test, 'failed1');
        validator.rule('test', test, 'failed2');

        var errors = validator.check();

        expect(errors.test).toBe('failed1');
      });
    });

    describe('Default tests', function() {

      function runTest(test, val, not) {

        var validator = new Validator({ key: val });
        validator.rule('key', test, 'failed');
        var errors = validator.check();

        var expectation = expect(typeof (errors || {}).key);

        if (not) {
          expectation = expectation.not;
        }
        expectation.toBe('undefined');
      }

      describe('notEmpty', function() {

        it('Correctly checks for empty or falsy values', function() {
          runTest('notEmpty', null, true);
          runTest('notEmpty', false, true);
          runTest('notEmpty', '', true);
        });
      });

      describe('isEmail', function() {

        it('Correctly checks for valid email strings', function() {

          runTest('isEmail', 'test', true);
          runTest('isEmail', 'test@', true);
          runTest('isEmail', '', true);
          runTest('isEmail', '@s.com', true);

          runTest('isEmail', 'test@test.com');
          runTest('isEmail', 'test@test');
          runTest('isEmail', 'i@i.i.i.icom');
        });
      });

      describe('isDate', function() {

        it('Correctly checks for valid ISO 8601 date strings', function() {
          // http://www.w3.org/TR/NOTE-datetime
          runTest('isDate', '1994-11-05T13:15:30Z');
          runTest('isDate', '1994-11-05T08:15:30-05:00');
          runTest('isDate', '1997-07-16T19:20:30.45+01:00');
          runTest('isDate', '1997-07-16T19:20:30+01:00');
          runTest('isDate', '1997-07-16T19:20+01:00');
          runTest('isDate', '1997-07-16');
          runTest('isDate', '1997-07');
          runTest('isDate', '1997');
        });
      });
    });
  });
}));