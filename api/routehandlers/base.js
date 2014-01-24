var methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'TRACE', 'CONNECT', 'OPTIONS', 'ALL'];

var Base = function(app) {
	this.route = null;
	this.setup(app);
	this.routeSetup(app);
};
Base.METATAGS_VARNAME = 'metaTags';
Base.prototype = {
	setup : function(app) {
		throw new Error('Please implement setup');
	},
	routeSetup: function(app) {
		var self = this, count = 0;
		if (self.route) {
			methods.forEach(function(method) {
				var lMethod = method.toLowerCase();
				if (typeof self[method] === 'function') {
					app[lMethod](self.route, self[method].bind(self));
					count++;
				} else if (typeof self[lMethod] === 'function') {
					app[lMethod](self.route, self[lMethod].bind(self));
					count++;
				}
			});
			if (count < 1) {
				console.log(self.route, 'specified as route but no match for any method: ', methods.join(', '));
			}
		}
	}
};

module.exports = Base;
