var pstarter = require('pstarter');
var appRequire = require('app-require');
var worker = require('./app/worker.js');
/* run only one single process and worker for debug */
if('worker' in process.env) {
	var server = worker();
} else {
	pstarter.startMaster(__dirname + '/config', {}, function() {
		var config = appRequire.requireConfig();
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