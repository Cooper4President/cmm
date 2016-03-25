define([
	'jquery', 
	'lodash', 
	'menu/receiver', 
	'messenger/chat',
	'messenger/chatSockets',
	'menu/menu',
	], function($, _, receiver, chat, chatSockets, menu){
	//main function
	return function(){
        //send authentication token to server
        chatSockets.sendAuthToken();
		//add messenger handler
		menu.initAddMessenger();

		//receiver handler
		receiver();

		//hover handler
		menu.initHoverEvents();

		//init menu button
		menu.initMenu();
	}
});