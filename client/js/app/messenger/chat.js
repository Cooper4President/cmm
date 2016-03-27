define([
	'jquery', 
	'lodash', 
	'misc/user', 
	'hbs!templates/messenger', 
	'./chatInfo',
	'./send',
	'./resize',
	'./sort',
	'./queueMessenger',
	//jquery plug-ins
	'autogrow'
	], function($, _, user, messenger, chatInfo, send, resize, sort, queueMessenger){
	//refreshes the chat for style bugs
	function refreshChats(){
		$('.messenger-container').width($(window).width());
		$('.chat-element').each(function(){
			var left;
			if($(this).prev().length > 0)left = parseInt($(this).prev().css('left')) + $(this).prev().width();
			else left = 0;
			$(this).css({
				'width': $(window).width()/chatInfo.count,
				'left': left
			});
		});
		$('.img').width(0.8*$(window).width()/chatInfo.count);
	}


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

	//injects messenger on addition
	return function(rec){
		if(chatInfo.count === chatInfo.chatsPerWindow){
			alert("max number of windows")
			return null;
		}

		if(rec){
			var curr = this;
			//update messenger count
			chatInfo.count++;

			var chatId = "chat-" + chatInfo.count;

			//formats receivers for chat head title
			var recFormated = _.join(rec, ', ');

			var recList = _.join(rec,' ');

			//pulling precompiled handlebars template
			var context = {id : chatId, formated: recFormated};
			var html = $(messenger(context));

			//appending messenger to message container of body
			$('.messenger-container').prepend(html);
			refreshChats()
			if(chatInfo.count === 1){
				$(window).on("resize", function(event){
					if(event.target === window) refreshChats();
				});
			}

			//append data to chat box

			$("#"+chatId).data("receivers", rec);

			//update chatInfo.log
			chatInfo.updateChatLog(chatId);

			//focus on new chat window
			html.find('.cmd').focus().autogrow();

			//initializes resize event
			//initResizableChat(chatId);
			resize(chatId);
			sort(chatId);
			queueMessenger(chatId);

			//handles close button
			html.find(".remove-messenger").on("click",function(clickEvent){
				html.remove()
				_.remove(chatInfo.log, function(n){return n.id === chatId})
				chatInfo.count--;
				refreshChats();
			});

			//keydown fucntions for command line
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
			return chatId;
		}else{
			alert('a username is invalid or this chat window already exsists');
			return null;
		}
	}
});
