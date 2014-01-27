var pstarter = require('pstarter');
var appRequire = require('app-require');
var worker = require('./api/worker.js');
/* run only one single process and worker for debug */
if('worker' in process.env) {
	var server = worker();
} else {
	pstarter.startMaster(__dirname + '/config', {}, function() {
		if(process.env['NODE_ENV'] && process.env['NODE_ENV'] === 'development') {
			pstarter.startWatch(__dirname, [__dirname + '/node_modules'], ['.js', '.json']);
		}
	}).startWorker(function() {
		var server = worker();
	});
}