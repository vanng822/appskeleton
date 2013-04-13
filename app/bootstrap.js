var express = require('express');
var staticHandler = require('jcash');
var Index = require('./index.js');
var ejs = require('ejs');
var config = require('../config');
var mobile = require('../lib/mobile.js');
var template = require('../lib/template.js');

module.exports.setupApp = function(app, basedir) {
	var jsManager, cssManager, block, location;
	
	app.configure('development', 'production', function() {
		app.engine('html', ejs.__express);
		app.set('view engine', 'html');
		app.set('views', basedir + '/views');
		app.use(express.favicon());
		app.use(express.bodyParser());
		app.use(mobile.detect());
		staticHandler.globalSettings({
			active : true,
			inmemory : true,
			pathJs : basedir + '/public/js',
			pathCss:  basedir + '/public/css',
			maxAgeCss : config.http.static.maxAge,
			maxAgeJs : config.http.static.maxAge
		});
		app.use(staticHandler.jcash());
		app.use(express.static(basedir + '/public', {
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
	imageManager = staticHandler.getImageManager({path : basedir + '/public/img', hasGm : true});
};

module.exports.bootstrap = function(appl) {
	new Index(appl);
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