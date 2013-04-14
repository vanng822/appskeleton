## Why
I do this every time and get tired of it. 

## Usage
	cd TO_APP_SKELETON
	chmod u+x skeleton.sh
	./skeleton.sh /path/to/your_app_name your_app_name
	## adding files to git as well
	./skeleton.sh /path/to/your_app_name your_app_name add-git
	## To run
	cd /path/to/your_app_name
	node your_app_name.js NODE_ENV=development
	#node your_app_name.js NODE_ENV=production
	
	## open in webbrowser http://127.0.0.1:3000/
	
## Issues/Notes
* Need to create img/dist, css/dist js/dist and give permissions to user that runs application, ie ww-data
* Need to configure etc/init.d/APP_NAME for production if using linux such as Ubuntu. See https://github.com/vanng822/pstarter#start-with-init-script-on-ubuntu