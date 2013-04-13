var util = require('util');
var Base = require('./base.js');

var IndexBootstrap = module.exports = function(app) {
	Base.call(this, app);
};

util.inherits(IndexBootstrap, Base);

IndexBootstrap.prototype.setup = function(app) {
	var self = this;
	app.get('/', function(req, res) {
		self.indexAction(req, res);
	});
	app.get('/robots.txt', function(req, res) {
		self.robotstxtAction(req, res);
	});
};

IndexBootstrap.prototype.robotstxtAction = function(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.render('index/robotstxt.html', {
		layout : false,
		eatspace : false
	});
};

IndexBootstrap.prototype.indexAction = function(req, res) {
	var result = {};
	res.render('index/index.html', {
		layout : 'layouts/layout.html',
		result : result
	});
};
