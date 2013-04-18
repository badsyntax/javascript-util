describe('Data manager', function() {

  var data = {};

  afterEach(function() {
    DataManager.remove(data);
  });

  it('Has \'set\', \'get\' and \'remove\' methods', function() {
    expect(typeof DataManager.get).toBe('function');
    expect(typeof DataManager.set).toBe('function');
    expect(typeof DataManager.remove).toBe('function');
  });

  it('Sets and gets a data value with a non-namespaced key', function() {
    var key = 'foo';
    var val = 'bar';
    DataManager.set(data, key, val);
    expect(DataManager.get(data, key)).toBe(val);
  });

  it('Sets the data with an object', function() {
    DataManager.set(data, {
      'foo': 'bar'
    });
    expect(DataManager.get(data, 'foo')).toBe('bar');
  });

  it('Merges a data value object when setting a value with an object', function() {
    DataManager.set(data, 'foo', {
      bar: 'hello'
    });
    DataManager.set(data, 'foo', {
      foo: 'goodbye'
    });
    expect(DataManager.get(data, 'foo')).toEqual({
      bar: 'hello',
      foo: 'goodbye'
    });
  });

  it('Mixin\'s object data, breaking object reference', function() {

    var newData = {
      hello: 'there'
    };

    DataManager.set(data, newData);

    expect(DataManager.get(data)).not.toBe(newData); // this is our reference check
    expect(DataManager.get(data)).toEqual(newData);
  });

  it('Does a deep-nested merge of object data', function() {

    var newData = {
      level1: {
        foo: true,
        level2: {
          bar: false,
          level3: {
            cat: 'meow'
          }
        }
      }
    };

    DataManager.set(data, newData);

    expect(DataManager.get(data)).toEqual(newData);

    DataManager.set(data, {
      hello: 'word',
      level1: {
        bar: false,
        level2: {
          foo: false,
          level3: {
            cat: 'cute'
          }
        }
      }
    });

    expect(DataManager.get(data)).toEqual({
      hello: 'word',
      level1: {
        bar: false,
        foo: true,
        level2: {
          bar: false,
          foo: false,
          level3: {
            cat: 'cute'
          }
        }
      }
    });
  });

  it('Merges the data data when setting the data with an object', function() {
    DataManager.set(data, 'foo', 'bar');
    DataManager.set(data, {
      'foo2': 'bar'
    });
    expect(DataManager.get(data, 'foo')).toBe('bar');
    expect(DataManager.get(data, 'foo2')).toBe('bar');
  });

  it('Sets and gets a data value with a namespaced key', function() {
    var key = 'i.am.a.namespace';
    var val = false;
    DataManager.set(data, key, val);
    expect(DataManager.get(data, key)).toBe(val);
    expect(DataManager.get(data, 'i.am.a')).toEqual({
      namespace: false
    });
  });

  it('Overwrites any existing value if the value to be overwritten is not an object or if the value passed in is not an object', function() {
    DataManager.set(data, 'foo.test.hello', 'bar');
    DataManager.set(data, 'foo.test.hello2', {
      foo: 'bar'
    });
    DataManager.set(data, 'foo.test.hello', 'bar2');
    DataManager.set(data, 'foo.test.hello2', 'bar2');
    expect(DataManager.get(data, 'foo.test.hello')).toBe('bar2');
    expect(DataManager.get(data, 'foo.test.hello2')).toBe('bar2');
  });

  it('Gets all the data if no key is specified', function() {
    DataManager.set(data, 'foo', 'bar');
    expect(DataManager.get(data)).toEqual({
      foo: 'bar'
    });
  });

  it('Does not throw an error when trying to access a value from an undefined object', function() {
    var error = false;
    try {
      DataManager.get(data, 'does.not.exist');
    } catch (e) {
      error = true;
    }
    expect(error).toBe(false);
  });
});