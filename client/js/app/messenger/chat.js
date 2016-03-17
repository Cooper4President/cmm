/*
	chat.js houses all the cmm website's interactive elements, such as chat windows, menu options, etc...
	Here is a quick guide to some useful globals and methods


######################~GLOBALS~######################

	chatInfo.log: holds all messages of each chat window

	messagengerCount: number of chat windows on the screen currently

	var user: user of current client

######################~METHODS~######################

	function appendMessenger(rec)
		Description: appends a messenger to the messenger container
			rec: Array of receivers the the messenger will be sending to.
			return: id of the new chat window (no # attatched);

	function updateChat(chatId, value)
		Description: updates chat container of associated chat window
			chatId: id of the chat window you are posting to (no # attatched)
			value: string of message you are posting

	function updateChatLog(chatId[, value])
		Description: updates the chat log (chatInfo.log) with the chatId if it is not currently in the log, if you want to
		update the messeges, simply supply the chatId and the message you want to append. If the chatInfo.log was found, it will
		append the message (if any) and return the object at the chat id.
			chatId: chat id of log entry (no # attatched)
			value: (optional) message you wish to append to log entry
			return: object associated with chatId

	function submit(chatId, value)
		Description: like updateChat, but also updates the Log and parses the value as a command instead of a raw string
			chatId: id of the chat window you are posting to (no # attatched)
			value: string of message you are posting

	function getHelp(chatId)
		Description: posts the help document on chat window
			chatId: id of chat window you want to post to (no # attatched)

	function getTodaysDate()
		Description: returns today's date

*/



define([
	'jquery', 
	'lodash', 
	'misc/user', 
	'hbs!./messenger-template', 
	'./chat-sockets',
	'./commands',
	'./chat-info',
	'autogrow'
], function($, _, user, messengerTemplate, chatSocket, command, chatInfo){
	return {
		
		//simple get receivers function
		getReceivers: function(id){
			return $("#"+id).data().receivers;
		},
		//handles down arrow functionality
		downArrowHandler: function(chatId){
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
		},

		//handles up arrow functionality
		upArrowHandler: function(chatId){
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
		},
		//handles enter key functionality
		enterKeyHandler: function(chatId){
			this.submit(chatId);
			_(chatInfo.log).each(function(entry){
				if(entry.id === chatId) {
					entry.currentMessage = -1;
					return;
				}
			});
		},

		//checks if chat box is overflowed
		checkScrollbar: function(chatId){
			var container = $("#"+chatId).find('.chat-container');
			var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
			if(hasOverflow) container.scrollTop(container[0].scrollHeight);
		},
		//refreshes the chat for style bugs
		refreshChats: function(){
			$('.messenger-container').css({
				'width': $(window).width()
			})
			$('.chat').css({
				'width': $(window).width()/chatInfo.count
			});
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
				this.initResizableChat(chatId);

				//handles close button
				html.find(".remove-messenger").on("click",function(clickEvent){
					html.remove()
					_.remove(chatInfo.log, function(n){return n.id === chatId})
					chatInfo.count--;
					curr.refreshChats();
				});

				//keydown fucntions for command line
				var saveCmd;
			    html.find('.cmd').keydown(function(e) {
					var chatId = $(this).closest('.chat').attr('id');
					//enter key submit
				    if (e.keyCode === 13) {
						e.preventDefault();
						curr.enterKeyHandler(chatId); 
				    }

				    //up arrow to go through chat log
				    if(e.keyCode === 38){
				    	e.preventDefault();
						curr.upArrowHandler(chatId);
				    }

				    //down arrow to go through chat log
				    if(e.keyCode === 40){
				    	e.preventDefault();
		 				curr.downArrowHandler(chatId);
				    }
				});
				return chatId;
			}else{
				alert('a username is invalid or this chat window already exsists');
				return null;
			}
		},

		//update chat function
		updateChat: function(chatId, value){
			var container = $("#"+chatId).find('.chat-container');
			if(value !== undefined)var chat = "<div>" + user.name + ": " + value + "</div>";
			container.append(chat);
			this.checkScrollbar(chatId);
		},

		//client side submit function
		submit: function(id, inp){
			var chatId = "#"+id;
			var container = $(chatId).find('.chat-container');
			var cmd = $(chatId).find('.cmd');
			if(inp === undefined) var inp = cmd.val();
			if(inp != ""){
				chatInfo.updateChatLog(id, inp);
				//send the message to the server
				//TEMPORARY: the array of receiving usernames is currently set to null
				var testing = this.getReceivers(id);
				chatSocket.sendChatMsg(id, testing, inp);

				this.updateChat(id, command(id, inp));
				cmd.val("");
			}
			cmd.focus();
		},

			//initializes the resize event
		initResizableChat: function(chatId){
			//fixes width bug
			this.refreshChats();

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
				}
			});
		}
	}

});
