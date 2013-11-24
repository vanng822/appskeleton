var pstarter = require('pstarter');
var worker = function() {
	var config = require('./config');
	var express = require('express');
	var app = express();
	var http = require('http');
	var server = http.createServer(app);
	var bootstrap = require('./app/bootstrap.js');
	bootstrap.setupApp(app, __dirname);
	bootstrap.bootstrap(app);
	bootstrap.postrun();
	server.listen(config.http.port, config.http.host);
	return server;
};

/* run only one single process and worker for debug */
if('worker' in process.env) {
	var server = worker();
} else {
	pstarter.startMaster(__dirname + '/config', {}, function() {
		var config = require('./config');
		pstarter.statServer(config.http.statPort, config.http.statHost);
		if(process.env['NODE_ENV'] && process.env['NODE_ENV'] === 'development') {
			pstarter.startWatch(__dirname, [__dirname + '/node_modules'], ['.js', '.json', '.html', '.css']);
		}

	}).startWorker(function() {
		var server = worker();
		/* Counting request */
		server.on('request', function(req, res) {
			process.send({
				cmd : pstarter.cmd.requestCount
			});
		});
	});
}