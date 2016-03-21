define([
	'jquery' , 
	'lodash', 
	'./chat-info', 
	'hbs!templates/message', 
	'./commands', //dependency that runs commands
	'./chat-sockets'
], function($, _, chatInfo, message, command , socket){ //command first refrenced as argument to this module
	//define private function outside of return like this

	//simple get receivers function
	function getReceivers(id){
		return $("#"+id).data().receivers;
	}
	//checks if chat box is overflowed
	function checkScrollbar(chatId){ 
		var container = $("#"+chatId).find('.chat-container');
		var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
		if(hasOverflow) container.scrollTop(container[0].scrollHeight);
	}

	//public functions of the module must be returned. 
	//Send only has one public function so we can just return the function itself
	return function(id, inp){
		var chatId = "#"+id;
		var container = $(chatId).find('.chat-container');
		var cmd = $(chatId).find('.cmd');
		if(inp === undefined) var inp = cmd.val();
		if(inp != ""){
			chatInfo.updateChatLog(id, inp);
			//send the message to the server
			//TEMPORARY: the array of receiving usernames is currently set to null
			var testing = getReceivers(id);
			//send chat message to server
			socket.sendChatMsg(id, testing, inp);
			container.append(message(command(id, inp))); //since the command module only returns a function 
			checkScrollbar(id);							//we can call it like this
			cmd.val("");
		}
		cmd.focus();
	}
});