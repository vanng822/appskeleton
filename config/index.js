
var Config = require('vnfconfig').Config;

var configs = {
	production : function() {
		return new Config(['all.js', 'production.js'], __dirname);
	},
	development : function() {
		return new Config(['all.js', 'development.js'], __dirname);
	}
};

module.exports = configs[process.env['NODE_ENV']]();
