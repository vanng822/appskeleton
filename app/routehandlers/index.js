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
};

IndexBootstrap.prototype.indexAction = function(req, res) {
	var result = {};
	res.render('index/index.html', {
		layout : 'layouts/layout.html',
		result : result
	});
};
