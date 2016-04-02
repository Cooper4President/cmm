define([
	'jquery',
	'lodash',
	'./send',
	'./chatInfo',
	'./enqueueMessenger'

	], function($, _, send, chatInfo, enqueueMessenger){
	var saveCmd;
	//handles down arrow functionality
	function downArrowHandler(chatId){
		_(chatInfo.log).each(function(entry){
			if(entry.id === chatId){
				var cmd = $("#"+entry.id).find('.cmd');
				var index = entry.currentMessage;
				//handles down arrow functionality
				if(index > -1){
					if(index === 0) cmd.val(saveCmd);
					else cmd.val(entry.messages[index-1]);
					entry.currentMessage--;
				}
				return;
			}
		});
	}

	//handles up arrow functionality
	function upArrowHandler(chatId){
		_(chatInfo.log).each(function(entry){
			if(entry.id === chatId){
				var cmd = $("#"+entry.id).find('.cmd');
				var index = entry.currentMessage;
				if(index < entry.messages.length-1){
					if(index === -1) saveCmd = cmd.val();
					cmd.val(entry.messages[index+1]);
					entry.currentMessage++;
				}
				return;
			}
		}); 
	}
	//handles enter key functionality
	function enterKeyHandler(chatId){
		send(chatId);
		_(chatInfo.log).each(function(entry){
			if(entry.id === chatId) {
				entry.currentMessage = -1;
				return;
			}
		});
	}
	return function(html){
		html.find(".remove-messenger").on("click",function(event){
			enqueueMessenger(html);
		});
	    html.find('.cmd').keydown(function(event) {
			var chatId = $(this).closest('.chat-element').attr('id');
			//enter key submit
		    if (event.keyCode === 13) {
				event.preventDefault();
				enterKeyHandler(chatId); 
		    }

		    //up arrow to go through chat log
		    if(event.keyCode === 38){
		    	event.preventDefault();
				upArrowHandler(chatId);
		    }

		    //down arrow to go through chat log
		    if(event.keyCode === 40){
		    	event.preventDefault();
 				downArrowHandler(chatId);
		    }
		});
	}
});