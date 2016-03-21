define([
	'jquery', 
	'lodash', 
	'misc/user', 
	'hbs!templates/messenger', 
	'./chat-sockets',
	'./chat-info',
	'./send',
	'autogrow'
], function($, _, user, messengerTemplate, chatSocket, chatInfo, send){
	var api = {
		//refreshes the chat for style bugs
		refreshChats: function(){
			$('.messenger-container').css({
				'width': $(window).width()
			});
			$('.chat').css({
				'width': $(window).width()/chatInfo.count
			});
			$('.img').width(0.8*$(window).width()/chatInfo.count);
		},

		//injects messenger on addition
		appendMessenger: function(rec){
			if(chatInfo.count === 3){
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
				var html = $(messengerTemplate(context));

				//appending messenger to message container of body
				$('.messenger-container').prepend(html);


				//append data to chat box

				$("#"+chatId).data("receivers", rec);

				//update chatInfo.log
				chatInfo.updateChatLog(chatId);

				//focus on new chat window
				html.find('.cmd').focus().autogrow();

				//initializes resize event
				initResizableChat(chatId);

				//handles close button
				html.find(".remove-messenger").on("click",function(clickEvent){
					html.remove()
					_.remove(chatInfo.log, function(n){return n.id === chatId})
					chatInfo.count--;
					curr.refreshChats();
				});

				//keydown fucntions for command line
			    html.find('.cmd').keydown(function(e) {
					var chatId = $(this).closest('.chat').attr('id');
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

	//initializes the resize event
	function initResizableChat(chatId){
		//fixes width bug
		api.refreshChats();

		//initializes resizable chat
		var container;
		$("#"+chatId).resizable({
			handles: 'e',
			minWidth: 250,
			start: function(event, ui){
				container = ui.element.width() + ui.element.next().width();
			},
			resize: function(event, ui){
				ui.element.next().width(container - ui.element.width());
				$('.img').width(0.8*$('.img').closest('.chat-container').width());
			}
		});
	}

	return api;
});
