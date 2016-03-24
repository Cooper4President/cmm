define([
	'jquery', 
	'lodash', 
	'menu/receiver', 
	'messenger/chat',
	'messenger/chat-sockets',
	'menu/menu',
], function($, _, receiver, chat, chatSocket, menu){
	//main function
	return function(){
        //send authentication token to server
        chatSocket.sendAuthToken();
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