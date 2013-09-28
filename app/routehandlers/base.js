
var Base = function(app) {
	this.setup(app);
};
Base.METATAGS_VARNAME = 'metaTags';
Base.prototype = {
	setup : function(app) {
		throw new Error('Please implement setup');
	},
	getMetaTags : function(res) {
		var metaTags = res.locals[Base.METATAGS_VARNAME];
		if(!metaTags) {
			metaTags = [];
			res.locals[Base.METATAGS_VARNAME] = metaTags;
		}
		return metaTags;
	},
	addMetaTag : function(res, meta) {
		var metaTags = this.getMetaTags(res);
		metaTags.push(meta);
		return this;
	},
	error404Page : function(req, res) {
		res.statusCode = 404;
		res.render('error/404.html', {
			layout : 'layouts/layout.html',
			result : null
		});
	}
};

module.exports = Base;
