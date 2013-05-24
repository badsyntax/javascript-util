describe('Inherits', function() {

  function getObjects() {

    var _Super = function(prop) {
      this.prop = prop;
    };
    _Super.prototype.getProp = function() {
      return this.prop;
    };

    var _Sub = function() {
      _Super.apply(this, arguments);
    };
    _Sub.inherits(_Super);

    return {
      _Super: _Super,
      _Sub: _Sub
    };
  }

  it('Provides a new \'inherits\' method', function() {
    expect(typeof Function.prototype.inherits).toBe('function');
  });

  it('Gives the provided sub object the exact features of the provided super object', function() {

    var objs = getObjects();

    expect(objs._Sub.prototype.constructor).toBe(objs._Sub);
    expect(objs._Sub.prototype).toEqual(objs._Super.prototype);
  });

  it('Creates the sub object with the super constructor prototype in its prototype chain', function() {

    var objs = getObjects();
    var sub = new objs._Sub('moggie');

    expect(sub instanceof objs._Super).toBe(true);
    expect(sub instanceof objs._Sub).toBe(true);
  });

  it('Adds any new features of the super object to any sub objects created at any time', function() {

    var objs = getObjects();
    objs._Super.prototype.foo = 'bar';

    expect(objs._Sub.prototype).toEqual(objs._Super.prototype);
  });

  it('Does not add any new features of the sub objects to the super object after performing the inheritance', function() {

    var objs = getObjects();
    objs._Sub.prototype.foo = 'bar';

    expect(objs._Super.prototype.foo).not.toBeDefined();
  });

  // it('Mixins an object into the sub objects\' prototype', function() {

  //   var objs = getObjects();

  //   var MyObj = function() {};

  //   MyObj.inherits(objs._Sub, {
  //     drink: function() {},
  //     meh: true
  //   });

  //   var obj = new MyObj('meh');

  //   expect(typeof obj.drink).toBe('function');
  //   expect(obj.meh).toBe(true);
  //   expect(obj instanceof objs._Super).toBe(true);
  //   expect(obj instanceof objs._Sub).toBe(true);
  //   expect(obj instanceof MyObj).toBe(true);
  // });
});
