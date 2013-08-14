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
  function Emitter() {
    this._events = {};
  }

  /**
   * Adds a new handler for a given event.
   * @name Emitter#on
   * @method
   * @public
   * @param {string}    type    - The event type.
   * @param {function}  handler - The callback handler for the event type.
   */
  Emitter.prototype.on = function(type, handler) {
    this._addHandler(type, handler);
  };

  /**
   * Adds a new handler for a given event. The handler is only executed once.
   * @name Emitter#one
   * @method
   * @public
   * @param {string}    type    - The event type.
   * @param {function}  handler - The callback handler for the event type.
   */
  Emitter.prototype.one = function(type, handler) {
    this.on(type, function(data) {
      this._callHandler(data, handler);
      this.off(type, handler, true);
    }.bind(this));
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
  Emitter.prototype.off = function(type, handler, exact) {
    this._eachEvent(type, exact, function(event, handlers) {
      this._removeHandlers(handlers, handler);
    }.bind(this));
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
  Emitter.prototype.emit = function(type, data, exact) {
    this._eachEvent(type, exact, function(event, handlers) {
      this._callHandlers(handlers, data);
    }.bind(this));
  };

  /**
   * Adds a specific handler to an event set.
   * @name Emitter#_addHandler
   * @method
   * @private
   * @param {string}  type      - The event type.
   * @param {mixed}   handler   - The callback handler for the event type.
   */
  Emitter.prototype._addHandler = function(type, handler) {
    var events = this._events;
    if (!events[type]) {
      events[type] = [];
    }
    events[type].push(handler);
  };

  /**
   * Removes all handlers, or one handler, from a set of handlers.
   * @name Emitter#_removeHandler
   * @method
   * @private
   * @param {array}               handlers  - The array of handlers.
   * @param {function|optional}   handler   - The handler function to remove.
   */
  Emitter.prototype._removeHandlers = function(handlers, handler) {
    handlers.splice(
      (handler ? handlers.indexOf(handler) : 0),
      (handler ? 1 : handlers.length)
    );
  };

  /**
   * Executes all handlers in a given set of handlers.
   * @name Emitter#_callHandlers
   * @method
   * @private
   * @param {array}   handlers  - The array of handlers.
   * @param {mixed}   data      - The event data.
   */
  Emitter.prototype._callHandlers = function(handlers, data) {
    handlers.forEach(this._callHandler.bind(this, data));
  };

  /**
   * Executes a specified handler.
   * @name Emitter#_callHandler
   * @method
   * @private
   * @param {array}   handlers  - The array of handlers.
   * @param {mixed}   data      - The event data.
   */
  Emitter.prototype._callHandler = function(data, handler) {
    handler.call(this, data);
  };

  /**
   * Iterates through the events specified by type. The type may be a namespace.
   * @name Emitter#_eachEvent
   * @method
   * @private
   * @param {string}    type      - The event type.
   * @param {string}    exact     - Do an exact event match (no namespace).
   * @param {function}  callback  - The callback function to execute for every
   * matched event.
   */
  Emitter.prototype._eachEvent = function(type, exact, callback) {
    for (var event in this._events) {
      if (this._matchesEvent(event, type, exact)) {
        callback(event, this._events[event]);
      }
    }
  };

  /**
   * Tests if a given event type matches the given event. Type could be a namespace.
   * @name Emitter#_matchesEvent
   * @method
   * @private
   * @param   {string}    event     - The event.
   * @param   {string}    type      - The event type.
   * @returns {boolean}   exact     - Do an exact event match (no namespace).
   */
  Emitter.prototype._matchesEvent = function(event, type, exact) {

    // Bypass the namespace check.
    if (exact) {
      return event === type;
    }

    // Escape special characters.
    type = type.replace(/([.])/g, "\\$1");

    // Test if the namespace matches.
    return new RegExp('^' + type + '(\\.|$)').test(event);
  };

  return Emitter;
}));