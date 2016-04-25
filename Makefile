all:
	npm install && bower install && node server-main.js
		
run: server-main.js
	node server-main.js
