module.exports = {
	contentTypes : {
		'json' : 'application/json; charset=utf-8',
		'kml' : 'application/vnd.google-earth.kml+xml; charset=utf-8',
		'xml' : 'text/xml; charset=utf-8',
		'mobile' : 'text/html; charset=utf-8',
		'html' : 'text/html; charset=utf-8'
	},
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
