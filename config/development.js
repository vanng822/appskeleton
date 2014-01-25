module.exports = {
	http : {
		port : 3000,
		host : '127.0.0.1',
		statPort : 3001,
		statHost : '127.0.0.1',
		numWorkers : 2,
		"static" : {
			maxAge : 3600
		},
		apiPort : 3002,
		apiHost : '127.0.0.1'
	},
};
