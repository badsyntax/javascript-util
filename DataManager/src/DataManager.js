/**
 * A data manager that supports nested objects
 * https://github.com/badsyntax/javascript-util
 */
(function (exports) {

  var DataManager = {
    get: function (data, key) {
      if (key === undefined) {
        return data;
      }
      var parts = key.split('.');
      var obj = data;
      for (var i = 0, l = parts.length; i < l; i++) {
        if (obj === undefined) {
          return undefined;
        }
        obj = obj[parts[i]];
      }
      return obj;
    },
    set: function (data, key, val) {
      if (typeof key === 'object' && val === undefined) {
        $.extend(data, key);
      } else {
        var obj = data;
        var parts = key.split('.');
        key = parts.pop();

        for (var i = 0, l = parts.length; i < l; i++) {
          if (obj[parts[i]] === undefined) {
            obj[parts[i]] = {};
          }
          obj = obj[parts[i]];
        }

        if (typeof obj[key] === 'object' && typeof val === 'object') {
          $.extend(obj[key], val);
        } else {
          obj[key] = val;
        }
      }
    },
    remove: function (data, key) {
      if (key !== undefined) {
        delete data[key];
      } else {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            delete data[key];
          }
        }
      }
    }
  };

  exports.DataManager = DataManager;

}(this));
