define([
	'menu/receiver', 
	'messenger/chatSockets',
	'menu/menu',
	'misc/checkWindow',
	'messenger/shifter',
	'menu/friendsList'
	], function(receiver, chatSockets, menu, checkWindow, shifter, friendsList){
	//main function
	return function(){

        //send authentication token to server
        chatSockets.sendAuthToken();

		//receiver handler
		receiver();

		//menu button handler
		menu.init();

		//resizes chat(s) on window resize
		checkWindow();

		//initializes chat shifter
		shifter.init();

		friendsList();

	}
});