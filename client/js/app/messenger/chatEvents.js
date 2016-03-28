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
	    html.find('.cmd').keydown(function(e) {
			var chatId = $(this).closest('.chat-element').attr('id');
			//enter key submit
		    if (e.keyCode === 13) {
				e.preventDefault();
				enterKeyHandler(chatId); 
		    }

		    //up arrow to go through chat log
		    if(e.keyCode === 38){
		    	e.preventDefault();
				upArrowHandler(chatId);
		    }

		    //down arrow to go through chat log
		    if(e.keyCode === 40){
		    	e.preventDefault();
 				downArrowHandler(chatId);
		    }
		});
	}
});