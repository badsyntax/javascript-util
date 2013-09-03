# EventEmitter

A small EventEmitter object.

## Features

* Can be inherited or mixed in.
* Familiar API (on, one, off, emit).
* Supports namespaced events.
* Only public properties are added to EventEmitter prototype.
* Add multiple handlers for a single event (eg: `obj.on('event', [ handler1, handler2 ])`).
* Well tested and well documented with jsdoc3 style comments.
* MIT licensed

## TODO

* Multiple event support (eg: obj.on('event1 event2', handler))