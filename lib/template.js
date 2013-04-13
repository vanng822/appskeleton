
var breadcrumb = require('./breadcrumb.js').breadcrumb;

var templateHelpers = {
	addMetaTag : function(req, res) {
		if(!res.locals.hasOwnProperty('metaTags')) {
			res.locals['metaTags'] = [];
		}
		return function(tag) {
			res.locals['metaTags'].push(tag);
		};
	}
};

module.exports.addDynamicHelpers = function(app) {
	var methods = Object.keys(templateHelpers);
	app.use(function(req, res, next) {
		var i, len = methods.length;
		for( i = 0; i < len; i++) {
			res.locals[methods[i]] = templateHelpers[methods[i]](req, res);
		}
		next();
	});
};

module.exports.funcs = {
	breadcrumb : breadcrumb
};
