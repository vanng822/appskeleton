var restify = require('restify');
var fs = require('fs');
var path = require('path');

var Base = require('./routehandlers/base.js');

var handlers = [];

var isHandler = function(Handler) {
	var handler = Handler;
	if (handler) {
		while(handler.super_) {
			handler = handler.super_;
		}
		if (handler === Base) {
			return true;
		}
	}
	return false;
};

var scanHandlers = function(app, dir) {
	var dir = path.normalize(dir);
	var files = fs.readdirSync(dir);
	
	files.forEach(function(filename) {
		if (filename === 'base.js') {
			return;
		}
		var stat = fs.statSync(dir + '/'+ filename);
		
		if (stat.isDirectory()) {
			return scanHandlers(app, dir + '/'+ filename);
		}
		
		try {
			var Handler = require(dir + '/' + filename);
			if (Object.keys(Handler).length !== 1) {
				throw new Error('Please have one handler in each file');
			}
			if (isHandler(Handler)) {
				handlers.push(new Handler(app));
			} else {
				console.warn('Implementation is not a handle in filename', filename, 'They should inherits from Base. Use util.inherits');
			}
		} catch (e) {
			console.error(e);
		}
	});
};



module.exports.setupApp = function(app, basedir) {
	app.use(restify.acceptParser(app.acceptable));
	app.use(restify.dateParser());
	app.use(restify.queryParser());
	app.use(restify.jsonp());
	app.use(restify.bodyParser());
	/* patch for http verbs */
	app['delete'] = app['del'];
	app['options'] = app['opts'];
};

module.exports.bootstrap = function(appl) {
	scanHandlers(appl, __dirname + '/routehandlers');
}; 

