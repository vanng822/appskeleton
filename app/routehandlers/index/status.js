var util = require('util');
var Base = require('../base.js');

var Handler = module.exports = function(app) {
	Base.call(this, app);
};

util.inherits(Handler, Base);

Handler.prototype.setup = function(app) {
	this.route = '/status';
};

Handler.prototype.GET = function(req, res) {
	return res.json({status:'OK'});
};

Handler.prototype.HEAD = function(req, res) {
	return res.json({status:'OK'});
};