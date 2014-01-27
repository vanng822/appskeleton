var methods = ['GET', 'POST', 'HEAD', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];

var Base = function(app) {
	this.route = null;
	this.setup(app);
	this.routeSetup(app);
};

Base.prototype = {
	setup : function(app) {
		throw new Error('Please implement setup');
	},
	routeSetup: function(app) {
		var self = this, supportedMethods = [];
		if (self.route) {
			methods.forEach(function(method) {
				var lMethod = method.toLowerCase();
				if (typeof self[method] === 'function') {
					app[lMethod](self.route, self[method].bind(self));
					supportedMethods.push(method);
				} else if (typeof self[lMethod] === 'function') {
					app[lMethod](self.route, self[lMethod].bind(self));
					supportedMethods.push(method);
				}
			});
			
			if (supportedMethods.length < 1) {
				console.log(self.route, 'specified as route but no match for any method: ', methods.join(', '));
			} else {
				if (supportedMethods.indexOf('OPTIONS') == -1) {
					app['options'](self.route, function(req, res, next) {
						res.header('Allow', supportedMethods.join(', '));
						return res.send(200, {});
					});
				}
			}
		}
	}
};

module.exports = Base;
