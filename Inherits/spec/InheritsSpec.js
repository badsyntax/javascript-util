describe('Inherits', function() {

  it('Provides a new \'inherits\' method', function() {
    expect(typeof Function.prototype.inherits).toBe('function');
  });

  it('Extends a super class instance with a sub class', function() {

    var Animal = function(prop) {
        this.prop = prop;
    };
    Animal.prototype.eat = function(){};

    var Cat = function() {
        Animal.apply(this, arguments);
    };

    Cat.inherits(Animal);

    Cat.prototype.drink = function() {};

    var myCat = new Cat('meh');

    expect(myCat instanceof Animal).toBe(true);
    expect(myCat instanceof Cat).toBe(true);
    expect(typeof myCat.eat).toBe('function');
    expect(typeof myCat.drink).toBe('function');
    expect(myCat.prop).toBe('meh');
  });


  it('Mixin a class', function() {

    var Animal = function(prop) {
        this.prop = prop;
    };
    Animal.prototype.eat = function(){};

    var Cat = function() {
        Animal.apply(this, arguments);
    };

    Cat.inherits(Animal, {
      drink: function() {},
      meh: true
    });

    var myCat = new Cat('meh');

    expect(typeof myCat.drink).toBe('function');
    expect(myCat.meh).toBe(true);
  });
});