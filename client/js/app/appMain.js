define([
	'menu/receiver', 
	'messenger/chatSockets',
	'menu/menu',
	'misc/checkWindow',
	'messenger/shifter'
	], function(receiver, chatSockets, menu, checkWindow, shifter){
	//main function
	return function(){

        //send authentication token to server
        chatSockets.sendAuthToken();

		//add messenger handler
		menu.initAddMessenger();

		//receiver handler
		receiver();

		//init menu button
		menu.initMenu();

		//resizes chat(s) on window resize
		checkWindow();

		//initializes chat shifter
		shifter.init();

	}
});