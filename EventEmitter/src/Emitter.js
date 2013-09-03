/**
 * Event Emitter
 * Copyright (c) 2013 Richard Willis; Licensed MIT
 * https://github.com/badsyntax/javascript-util
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
    root.Emitter = factory();
  }
}(this, function factory() {

  /**
   * Event Emitter constructor
   * @name Emitter
   * @depends Function.prototype.bind
   * @constructor
   * @property {object} _events - The collection of events which contain the handlers.
   * @example
   * var component = new EventEmitter();
   * component.on('someEvent', someHandler);
   * component.emit('someEvent');
   */
  function Emitter(target) {
    if (target) {
      return mixin(target, new Emitter());
    }
    this._events = {};
  }
  var EmitterPrototype = Emitter.prototype;

  /**
   * Adds a new handler for a given event.
   * @name Emitter#on
   * @method
   * @public
   * @param {string}    type    - The event type.
   * @param {function}  handler - The callback handler for the event type.
   * @param {mixed}     context - Call the handler in a particular context.
   */
  EmitterPrototype.on = function(type, handler, context) {
    addHandlers(this._events, type, handler, context);
  };

  /**
   * Adds a new handler for a given event. The handler is only executed once.
   * @name Emitter#one
   * @method
   * @public
   * @param {string}    type    - The event type.
   * @param {function}  handler - The callback handler for the event type.
   * @param {mixed}     context - Call the handler in a particular context.
   */
  EmitterPrototype.one = function(type, handler, context) {
    this.on(type, [ handler, function off() {
      this.off(type, [ handler, off ], true);
    }.bind(this)], context);
  };

  /**
   * Remove a specific handler, or all handlers for a given event.
   * @name Emitter#off
   * @method
   * @public
   * @param {string}    type    - The event type.
   * @param {function}  handler - The callback handler to remove for the given
   * @param {function}  exact   - Do an exact event match (no namespace).
   * event (optional)
   */
  EmitterPrototype.off = function(type, handler, exact) {
    eachEvent(this._events, type, exact, function(event, handlers) {
      removeHandlers(handlers, handler);
    });
  };

  /**
   * Executes all handlers for a given event.
   * @name Emitter#emit
   * @method
   * @public
   * @param {string}  type  - The event type.
   * @param {mixed}   data  - Event data to be passed to all the event handlers.
   * @param {string}  exact - Do an exact event match (no namespace).
   */
  EmitterPrototype.emit = function(type, data, exact) {
    eachEvent(this._events, type, exact, function(event, handlers) {
      callHandlers(handlers, data, this);
    }.bind(this));
  };

  /**
   * Mixin object properties into a different object.
   * @name Emitter#mixin
   * @method
   * @public
   * @param {object}  target  - The target object.
   * @param {object}  source  - The source object.
   */
  function mixin(target, source) {
    for(var key in source) {
      if (source.hasOwnProperty(key) || EmitterPrototype.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    return target;
  }

  /**
   * Adds a specific handler to an event set.
   * @name Emitter#_addHandler
   * @private
   * @param {string}  type      - The event type.
   * @param {mixed}   handler   - The callback handler for the event type.
   */
  function addHandlers(events, type, handler, context) {

    if (!events[type]) {
      events[type] = [];
    }

    eachHandler(handler, function(h) {
      events[type].push(context ? h.bind(context) : h);
    });
  }

  /**
   * Removes all handlers, or one handler, from a set of handlers.
   * @name Emitter#_removeHandler
   * @private
   * @param {array}               handlers  - The array of handlers.
   * @param {function|optional}   handler   - The handler function to remove.
   */
  function removeHandlers(handlers, handler) {
    eachHandler(handler, function(h) {
      handlers.splice(
        (h ? handlers.indexOf(h) : 0),
        (h ? 1 : handlers.length)
      );
    });
  }

  /**
   * Executes all handlers in a given set of handlers.
   * @name Emitter#_callHandlers
   * @private
   * @param {array}   handlers  - The array of handlers.
   * @param {mixed}   data      - The event data.
   */
  function callHandlers(handlers, data, context) {
    handlers.forEach(function(handler) {
      callHandler(handler, data, context);
    });
  }

  /**
   * Executes a specified handler.
   * @name Emitter#_callHandler
   * @private
   * @param {array}   handlers  - The array of handlers.
   * @param {mixed}   data      - The event data.
   */
  function callHandler(handler, data, context) {
    handler.call(context, data);
  }

  /**
   * Iterates through the events specified by type. The type may be a namespace.
   * @name Emitter#_eachEvent
   * @private
   * @param {string}    type      - The event type.
   * @param {string}    exact     - Do an exact event match (no namespace).
   * @param {function}  callback  - The callback function to execute for every
   * matched event.
   */
  function eachEvent(events, type, exact, callback) {
    for (var event in events) {
      if (matchesEvent(event, type, exact)) {
        callback(event, events[event]);
      }
    }
  }

  /**
   * Iterates through the handlers.
   * @name Emitter#_eachHandler
   * @private
   * @param {function|array}  handler   - The handler, or array of handlers.
   * @param {function}        callback  - The callback function to execute for each handler.
   * matched event.
   */
  function eachHandler(handler, callback) {
    ( handler instanceof Array ? handler : [ handler ] ).forEach(callback);
  }

  /**
   * Tests if a given event type matches the given event. Type could be a namespace.
   * @name Emitter#_matchesEvent
   * @private
   * @param   {string}    event     - The event.
   * @param   {string}    type      - The event type.
   * @returns {boolean}   exact     - Do an exact event match (no namespace).
   */
  function matchesEvent(event, type, exact) {

    // Bypass the namespace check.
    if (exact) {
      return event === type;
    }

    // Escape special characters.
    type = type.replace(/([.])/g, "\\$1");

    // Test if the namespace matches.
    return new RegExp('^' + type + '(\\.|$)').test(event);
  }

  return Emitter;
}));