module.exports = {
	js : {
		files : {
			'APP_NAME' : ['APP_NAME.js']
		},
		urls : {
			'jQuery' : ['http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js']
		},
		locationMap : {
			'*' : ['jQuery', 'APP_NAME']
		}
	},
	css : {
		files : {
			'APP_NAME' : ['APP_NAME.css']
		},
		urls : {
			
		},
		locationMap : {
			'*' : ['APP_NAME']
		}
	},
};
