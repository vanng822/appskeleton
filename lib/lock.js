var pool = require('./pool.js');

var noop = function() {
};
var Lock = module.exports.Lock = function(key) {
	this.key = key;
	this.retries = 0;
	this.maxRetries = 20;
	this.retryDelay = 100;
	this._locked = false;
};

Lock.prototype = {
	retry : function(delay, callback) {
		var self = this;
		if(self.retries > self.maxRetries) {
			return callback(null, null);
		}
		setTimeout(function() {
			self.acquire(callback);
		}, delay);
		this.retries++;
	},
	acquire : function(callback) {
		var self = this;
		acquire(this.key, {}, function(err, done) {
			if(err) {
				return callback(err, null);
			}
			if(done === null) {
				return self.retry(self.retryDelay, callback);
			}
			self._locked = true;
			return callback(null, function(callback) {
				self.release(callback);
			});
		});
	},
	release : function(callback) {
		var cb = callback || noop, self = this;
		if (this._locked) {
			release(this.key, function(err, ok) {
				if (err) {
					return cb(err, null);
				}
				self._locked = false;
				cb(null, ok);
			});
		} else {
			cb(new Error('Not own the lock'), null);		
		}
	}
};

var acquire = module.exports.acquire = function(key, options, callback) {
	var options = options || {};
	pool.redis.acquire(function(err, rclient) {
		var timeout = (options.timeout ? parseInt(options.timeout) : 3600);
		var expire = Date.now() + timeout;
		if(err) {
			return callback(err, null);
		}
		rclient.get(key, function(err, result) {
			if(err) {
				pool.redis.release(rclient);
				return callback(err, null);
			}

			if(result) {
				pool.redis.release(rclient);
				return callback(null, null);
			}

			rclient.setnx(key, expire, function(err, ok) {
				if(err) {
					pool.redis.release(rclient);
					return callback(err, null);
				}
				if(!ok) {
					pool.redis.release(rclient);
					return callback(null, null);
				}
				rclient.expire(key, timeout, function(err, ok) {
					pool.redis.release(rclient);
					if (err) {
						release(key, noop);
						return callback(err, null);
					}
					return callback(null, function(callback) {
						release(key, callback);
					});
				});
			});
		});
	});
};
var release = module.exports.release = function(key, callback) {
	pool.redis.acquire(function(err, rclient) {
		if(err) {
			return callback(err, null);
		}
		rclient.del(key, function(err, result) {
			pool.redis.release(rclient);
			if(err) {
				return callback(err, null);
			}
			return callback(null, result);
		});
	});
};
