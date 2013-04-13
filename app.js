var pstarter = require('pstarter');

pstarter.startMaster(__dirname + '/config').startWorker(function() {
	var config = require('./config');
	var express = require('express');
	var app = express();
	var http = require('http');
	var server = http.createServer(app);
	var bootstrap = require('./app/bootstrap.js');
	bootstrap.setupApp(app, __dirname);
	bootstrap.bootstrap(app);
	server.listen(config.http.port, config.http.host, function() {
		bootstrap.postrun();
	});
});