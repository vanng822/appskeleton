var util = require('util');
var Base = require('../base.js');

var Handler = module.exports = function(app) {
	Base.call(this, app);
};

util.inherits(Handler, Base);

Handler.prototype.setup = function(app) {
	this.route = '/robots.txt';
};

Handler.prototype.GET = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.render('index/robotstxt.html', {
		layout : false,
		eatspace : false
	});
};