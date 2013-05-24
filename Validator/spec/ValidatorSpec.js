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
        message: 'failed',
        tester: test
      });

      validator.rule('test', test);

      expect(validator.rules[1]).toEqual({
        key: 'test',
        message: 'invalid',
        tester: test
      });
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
  });

  describe('Default tests', function() {

    describe('notEmpty', function() {

      it('Correctly checks for empty or falsy values', function() {

        function runTest(val) {
          var validator = new Validator({
            test: val
          });
          validator.rule('test', 'notEmpty', 'failed');
          var errors = validator.check();
          expect(typeof (errors || {}).test).not.toBe('undefined');
        }

        runTest(null);
        runTest(false);
        runTest('');
      });
    });

    describe('isemail', function() {

      it('Correctly checks for valid email strings', function() {

        function runFailTest(val) {
          var validator = new Validator({
            test: val
          });
          validator.rule('test', 'isEmail', 'failed');
          var errors = validator.check();
          expect(typeof (errors || {}).test).not.toBe('undefined');
        }

        function runSuccessTest(val) {
          var validator = new Validator({
            test: val
          });
          validator.rule('test', 'isEmail', 'failed');
          var errors = validator.check();
          expect(typeof (errors || {}).test).toBe('undefined');
        }

        runFailTest('test');
        runFailTest('test@');
        runFailTest('');
        runFailTest('@s.com');

        runSuccessTest('test@test.com');
        runSuccessTest('test@test');
        runSuccessTest('i@i.i.i.icom');
      });
    });
  });
});