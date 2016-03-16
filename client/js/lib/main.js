define([
	'jquery', 
	'lodash', 
	'menu/menu-events', 
	'menu/receiver', 
	'messenger/chat',
	'messenger/chat-sockets',
	'menu/menu'
], function($, _, menuEvent, receiver, chat, chatSocket, menu){
	return function(){
			//main function
	        $(document).ready(function(){
	            //send authentication token to server
	            chatSocket.sendAuthToken();
	        }); 
			//add messenger handler
			menu.initAddMessenger();

			menuEvent.hoverEvent(menu.menuOptions);

			//receiver handler
			receiver.initReceiver();

			//init menu button
			menu.initMenu();

			//updates chat windows on resize
			$(window).on("resize", function(event){
				if(event.target === window) chat.refreshChats();
			});
		}
});