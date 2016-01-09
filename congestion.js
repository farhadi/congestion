/*
* congestion v0.1.0
* Generator-based congestion control
*
* Copyright 2016, Ali Farhadi
* Released under the MIT license.
*/
'use strict';

var Emitter = require('events').EventEmitter,
	Promise = require('pinkie-promise'),
	inherits = require('util').inherits;
	
function Congestion(capacity) {
	Emitter.call(this);
	this.capacity = capacity || 100;
	this.current = 0;
	this.full = false;
}

inherits(Congestion, Emitter);

Congestion.prototype.inc = function(value) {
	if (value && typeof value.then == 'function') {
		this.current++;
		value.then(this.dec.bind(this), this.dec.bind(this));
	} else {
		this.current += value || 1;
	}
	if (this.current >= this.capacity && !this.full) {
		this.full = true;
		this.emit('full');
	}
}

Congestion.prototype.dec = function(value) {
	this.current -= value || 1;
	if (this.current < this.capacity && this.full) {
		this.full = false;
		this.emit('free');
	}
}

Congestion.prototype.wait = function(value) {
	if (value) {
		this.inc(value);
	}
	if (!this.full) {
		return Promise.resolve();
	}
	return new Promise(function(resolve) {
		this.once('free', resolve);
	}.bind(this));
}

module.exports = function(i) {
	return new Congestion(i);
};

module.exports.Congestion = Congestion;
