var appRequire = require('app-require');
var worker = module.exports = function() {
	var config = appRequire.requireConfig();
	var express = require('express');
	var app = express();
	var http = require('http');
	var server = http.createServer(app);
	var bootstrap = require('./bootstrap.js');
	bootstrap.setupApp(app, __dirname);
	bootstrap.bootstrap(app);
	bootstrap.postrun();
	server.listen(config.http.port, config.http.host);
	return server;
};
