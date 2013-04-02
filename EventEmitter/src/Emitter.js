/**
* Basic event emitter object.
* https://github.com/badsyntax/javascript-util
*
* It does *not* support the following:
* - Namespaced events
* - Emitting events a certain number of times
*
* Usage:
* function MyObj() {
*   Emitter.call(this);
* }
* MyObj.prototype = Object.create(Emitter.prototype);
* var obj = new MyObj();
* obj.on('myevent', function(data){
*   alert(data);
* });
* obj.emit('myevent', 'hello');
* obj.off('myevent');
*
* See tests for more usage examples.
*/

(function(exports) {

  function Emitter() {
    this.events = {};
  }

  Emitter.prototype.on = function(type, handler) {

    var events = this.events;

    if (!events[type]) {
      events[type] = [];
    }

    events[type].push(handler);

    return this;
  };

  Emitter.prototype.off = function(type, handler) {

    var events = this.events[type];

    if (events) {

      if (!handler) {
        // Remove all event handlers
        events = [];
      } else {
        // Remove a specific event handler
        events.splice(events.indexOf(handler), 1);
      }

      // If this event handler group is empty then remove it
      if (!events.length) {
        delete this.events[type];
      }
    }

    return this;
  };

  Emitter.prototype.emit = function(type, data) {

    var event;
    var events = (this.events[type] || []).slice();

    if (events.length) {
      while (event = events.shift()) {
        event.call(this, data);
      }
    }
    return this;
  }

  exports.Emitter = Emitter;

}(this));

