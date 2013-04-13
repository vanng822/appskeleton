var pstarter = require('pstarter');
var config = require('./config');

pstarter.startMaster(config).startWorker(function() {
	var express = require('express');
	var app = express();
	
	var http = require('http');
	var server = http.createServer(app);
	var bootstrap = require('./app/bootstrap.js');
	bootstrap.setupApp(app, __dirname);
	bootstrap.bootstrap(app);
	server.listen(config.http.port, function() {
		bootstrap.postrun();
	});
});