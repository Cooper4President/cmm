define([
	'jquery' , 
	'lodash', 
	'./chatInfo', 
	'hbs!templates/message', 
	'./commands', //dependency that runs commands
	'./chatSockets'
	], function($, _, chatInfo, message, commands , chatSockets){ //command first referenced as argument to this module
	//define private function outside of return like this

	//simple get receivers function
	function getReceivers(id){
		return _.filter(chatInfo.log, function(entry){
			if(entry.id === id) return entry;
		})[0].recievers;
	}
	//checks if chat box is overflowed
	function checkScrollbar(chatId){ 
		var container = $("#"+chatId).find('.container');
		var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
		if(hasOverflow) container.scrollTop(container[0].scrollHeight);
	}

	//public functions of the module must be returned. 
	//Send only has one public function so we can just return the function itself
	return function(id, inp){
		var chatId = "#"+id;
		var container = $(chatId).find('.container');
		var cmd = $(chatId).find('.cmd');
		if(inp === undefined) var inp = cmd.val();
		if(inp != ""){
			//update chatlog with new message
			chatInfo.updateChatLog(id, {message: inp});

			//send the message to the server
			var testing = getReceivers(id);
			chatSockets.sendChatMsg(id, testing, inp);

			//run message as a command and post it to respective chat window
			container.append(message(commands(id, inp))); //since the command module only returns a funciton we call it like this
			
			//check scroll bar and clear field
			checkScrollbar(id);							
			cmd.val("");
		}
		cmd.focus();
	}
});