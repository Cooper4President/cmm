define([
	//'menu/receiver', 
	'messenger/chatSockets',
	'menu/menu',
	'misc/checkWindow',
	'messenger/shifter',
	'menu/addMessenger'	
	], function(chatSockets, menu, checkWindow, shifter, addMessenger){
	//main function
	return function(){

        //send authentication token to server
        chatSockets.sendAuthToken();

		//menu button handler
		menu.init();

		//resizes chat(s) on window resize
		checkWindow();

		//initializes chat shifter
		shifter.init();

		//add messenger button handler
		addMessenger();
	}
});