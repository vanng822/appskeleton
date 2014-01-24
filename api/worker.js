var worker = module.exports = function() {
	var appRequire = require('app-require');
	var config = appRequire.requireConfig();
	var restify = require('restify');
	var server = restify.createServer();
	var bootstrap = require('./bootstrap.js');
	bootstrap.setupApp(server, __dirname);
	bootstrap.bootstrap(server);
	// change
	server.listen(config.http.port, config.http.host);
	return server;
};