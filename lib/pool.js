
var config = require('../config');
var redis = require('redis');
var generic_pool = require('generic-pool');


module.exports.redis = generic_pool.Pool({
	name : 'redis',
	max : 100,
	create : function(callback) {
		var rclient = redis.createClient();
		callback(null, rclient);
	},
	destroy : function(rclient) {
		rclient.quit();
	}
});