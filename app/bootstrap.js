var express = require('express');
var staticHandler = require('jcash');
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');
var appRequire = require('app-require');
var config = appRequire.requireConfig();
var libs = appRequire.requireLib();
var mobile = libs.mobile;
var template = libs.template;
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
				console.log('Implementation is not a handle in filename', filename, 'They should inherits from Base. Use util.inherits');
			}
		} catch (e) {
			console.error(e);
		}
	});
};



module.exports.setupApp = function(app, basedir) {
	var jsManager, cssManager, block, location;
	var basedir = path.normalize(basedir);
	app.configure('development', 'production', function() {
		app.engine('html', ejs.__express);
		app.set('view engine', 'html');
		app.set('views', basedir + '/app/views');
		app.use(express.favicon());
		app.use(express.bodyParser());
		app.use(mobile.detect());
		staticHandler.globalSettings({
			active : true,
			inmemory : true,
			pathJs : basedir + '/app/public/js',
			pathCss:  basedir + '/app/public/css',
			maxAgeCss : config.http.static.maxAge,
			maxAgeJs : config.http.static.maxAge
		});
		app.use(staticHandler.jcash());
		app.use(express.static(basedir + '/app/public', {
			maxAge : config.http.static.maxAge
		}));
		
	});

	app.configure('development', function() {
		app.use(express.errorHandler({
			dumpExceptions : true,
			showStack : true
		}));
	});

	app.configure('production', function() {
		app.use(express.errorHandler());
		app.enable('view cache');
	});
	/* template helpers */
	template.addDynamicHelpers(app);
	
	staticHandler.addTemplateHelpers(app);
	jsManager = staticHandler.getJsManager();
	cssManager = staticHandler.getCssManager();
	jsManager.parseConfig(config.js);
	cssManager.parseConfig(config.css);
	imageManager = staticHandler.getImageManager({path : basedir + '/app/public/img', hasGm : false});
};

module.exports.bootstrap = function(appl) {
	scanHandlers(appl, __dirname + '/routehandlers')
}; 

module.exports.postrun = function() {
	var jsManager, cssManager, imageManager;
	jsManager = staticHandler.getJsManager();
	cssManager = staticHandler.getCssManager();
	imageManager = staticHandler.getImageManager();
	
	jsManager.preRenderAll();
	cssManager.preRenderAll();
	imageManager.fetchFiles();
};