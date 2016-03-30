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

		//receiver handler
		receiver();

		//menu button handler
		menu();

		//resizes chat(s) on window resize
		checkWindow();

		//initializes chat shifter
		shifter.init();

	}
});