#Testing

**Team:**

	Oliver Ehrhardt,
	Cooper Matous,
	Morgan Allen,
	Craig Cornett

**Project Tittle:** Chat-- (cmm)

**Vision:** An enhanced, extensible, and enjoyable web chat experience.

**Automated Tests:**
	For our automated testing we used QUnit (http://qunitjs.com/)
	We tested the output of text manipulation commands to ensure that the output is what the user wants.
	We also tested the account creation to ensure users can create new profiles and can't create
	any duplicates. And We also tested user login to ensure that users can access the chat client.
	There are screen shots of the tests available github (https://github.com/Cooper4President/cmm) in the
	testScreenshots directory, but it is possible to run natively on your machine.
	To run natively you must have Node.js (https://nodejs.org/en/download/) downloaded onto your machine and able 
	to use the 'node' command in the console. Once that is done you can clone this repository 
	(git clone https://github.com/Cooper4President/cmm.git) and the cd into the repository in your console.
	Once done run these commands
	
	npm install -g bower && npm install && bower install
	
	From there you can run the local server by running 'node server-main.js' in the console, then point your
	browser to http://localhost:3000/indexTest.html for account and login testing and http://localhost:3000/chatTest.html
	for command testing. If you wish to look at the source code that generated these tests, 
	look at indexTest.js and chatTest.js. The modules for the chat testing is located in client/app/testing path in the cmm 
	project directory. 

**User Acceptance Tests:**
	Located in the cmmUserAcceptanceTests.pdf file.
	
