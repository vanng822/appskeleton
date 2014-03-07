var util = require('util');
var Base = require('../base.js');

var Handler = module.exports = function(app) {
	Base.call(this, app);
};

util.inherits(Handler, Base);

Handler.prototype.setup = function(app) {
	this.route = '/';
};

Handler.prototype.GET = function(req, res) {
	var result = {};
	res.render('index/index.html', {
		layout : 'layouts/layout.html',
		result : result
	});
};
