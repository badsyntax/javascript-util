(function (root, factory) {
  if (typeof exports === 'object') {
    // Node/CommonJS
    factory(
      require('../src/Emitter')
    );
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([
      '../src/Emitter'
    ], factory);
  } else {
    // Browser globals
    factory(root.Emitter);
  }
}(this, function factory(Emitter) {

  describe('Event Emitter', function() {

    var emitter;

    beforeEach(function() {
      emitter = new Emitter();
    });

    describe('Adding event handlers', function() {

      it('Stores a handler for a given event', function() {

        var handler = function() {};

        emitter.on('myevent', handler);

        var events = emitter._events.myevent;

        expect(events.length).toBe(1);
        expect(events[0]).toBe(handler);
      });

      it('Stores multiple handlers for the same event', function() {

        emitter.on('myevent', function() {});
        emitter.on('myevent', function() {});

        var events = emitter._events.myevent;

        expect(events.length).toBe(2);
        expect(events[0]).not.toBe(events[1]);
      });

      it('Store a handler for a namespaced event', function() {

        var handler = function() {};

        emitter.on('namespace.myevent', handler);

        var events = emitter._events['namespace.myevent'];

        expect(events.length).toBe(1);
        expect(events[0]).toBe(handler);
      });
    });

    describe('Emitting events', function() {

      it('Executes all handlers when emitting a given event', function() {

        var handler1 = jasmine.createSpy();
        var handler2 = jasmine.createSpy();

        emitter.on('myevent', handler1);
        emitter.on('myevent', handler2);
        emitter.emit('myevent');

        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();
      });

      it('Executes handlers multiple times', function() {

        var handler = jasmine.createSpy();

        emitter.on('myevent', handler);
        emitter.emit('myevent');
        emitter.emit('myevent');
        emitter.emit('myevent');

        expect(handler.callCount).toBe(3);
      });

      it('Executes the handlers with data passed in as the first function argument', function() {

        var handler = jasmine.createSpy();
        var data = {
          foo: 'bar'
        };

        emitter.on('myevent', handler);
        emitter.emit('myevent', data);

        expect(handler).toHaveBeenCalledWith(data);
      });

      it('Executes a handler only once', function() {

        var handler = jasmine.createSpy();

        emitter.one('myevent', handler);
        emitter.emit('myevent');
        emitter.emit('myevent');

        expect(handler).toHaveBeenCalled();
        expect(handler.callCount).toBe(1);
      });

      it('Executes a handler only once, and does not remove other events in the same namespace', function() {
        var handler1 = jasmine.createSpy();
        var handler2 = jasmine.createSpy();

        emitter.on('myevent.test', handler1);
        emitter.one('myevent', handler2);
        emitter.emit('myevent');
        emitter.emit('myevent');

        expect(handler1.callCount).toBe(2);
        expect(handler2.callCount).toBe(1);
      });

      it('Executes a namespaced event', function() {

        var handler1 = jasmine.createSpy();

        emitter.on('namespace.myevent', handler1);
        emitter.emit('namespace.myevent');

        expect(handler1).toHaveBeenCalled();
      });

      it('Executes all handlers in an event namespace', function() {

        var handler1;
        var handler2;
        var handler3;

        function resetHandlers() {
          handler1 = jasmine.createSpy();
          handler2 = jasmine.createSpy();
          handler3 = jasmine.createSpy();
        }

        resetHandlers();
        emitter.on('namespace.myevent', handler1);
        emitter.on('namespace.myevent', handler2);
        emitter.on('namespace.myevent.action', handler3);
        emitter.emit('namespace');

        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();
        expect(handler3).toHaveBeenCalled();

        resetHandlers();
        emitter.on('namespace2.myevent', handler1);
        emitter.on('namespace2.myevent', handler2);
        emitter.on('namespace2.myevent.action', handler3);
        emitter.emit('namespace2.myevent');

        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();
        expect(handler3).toHaveBeenCalled();

        resetHandlers();
        emitter.on('namespace3.myevent', handler1);
        emitter.on('namespace3.myevent', handler2);
        emitter.on('namespace3.myevent.action', handler3);
        emitter.emit('namespace3.myevent.action');

        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).not.toHaveBeenCalled();
        expect(handler3).toHaveBeenCalled();

        resetHandlers();
        emitter.on('namespace4.myevent', handler1);
        emitter.on('namespace4.myevent', handler2);
        emitter.on('namespace4.myevent.action', handler3);
        emitter.emit('myevent.action');

        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).not.toHaveBeenCalled();
        expect(handler3).not.toHaveBeenCalled();
      });

      it('Executes all handlers in an event namespace that contains some special characters', function() {

        var handler1 = jasmine.createSpy();
        var handler2 = jasmine.createSpy();

        emitter.on('namespace.my-event', handler1);
        emitter.on('namespace.my[event', handler2);
        emitter.emit('namespace');

        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();
      });

      it('Does not execute a handler in an event namespace if the namespace does not match', function() {

        var handler1 = jasmine.createSpy();
        var handler2 = jasmine.createSpy();

        emitter.on('namespace.myevent', handler1);
        emitter.on('namespace.myevent', handler2);
        emitter.emit('myevent');
        emitter.emit('namespac');
        emitter.emit('name');

        expect(handler1).not.toHaveBeenCalled();
        expect(handler2).not.toHaveBeenCalled();
      });
    });

    describe('Removing handlers', function() {

      it('Removes all handlers for a given event', function() {
        emitter.on('myevent', function() {});
        emitter.off('myevent');
        expect(emitter._events.myevent).toEqual([]);
      });

      it('Removes specific handlers for a given event', function() {

        var handler1 = function() {};
        var handler2 = function() {};

        emitter.on('myevent', handler1);
        emitter.on('myevent', handler2);
        emitter.off('myevent', handler1);

        expect(emitter._events.myevent.length).toBe(1);
        expect(emitter._events.myevent[0]).toBe(handler2);

        emitter.off('myevent', handler2);

        expect(emitter._events.myevent).toEqual([]);
      });
    });
  });
}));