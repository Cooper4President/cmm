/*
	chat.js houses all the cmm website's interactive elements, such as chat windows, menu options, etc...
	Here is a quick guide to some useful globals and methods


######################~GLOBALS~######################

	chatLog: holds all messages of each chat window

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
		Description: updates the chat log (chatLog) with the chatId if it is not currently in the log, if you want to
		update the messeges, simply supply the chatId and the message you want to append. If the chatLog was found, it will
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
	'hbs!../../../messenger-template', 
	'./chat-events', 
	'./chat-sockets',
	'./commands',
	'autogrow'
], function($, _, user, messengerTemplate, chatEvent, chatSocket, command){
	return {
		// call this in the console to get log of chat window id's paired with messeges history for that window
		chatLog: [],

		//call this in console to get the current number of messengers on screen
		messengerCount: 0,
		
		//simple get receivers function
		getReceivers: function(id){
			return $("#"+id).data().receivers;
		},

		//updates chatlog, adds new entry if receiver not found
		updateChatLog: function(chatId, mess){

			//finds receiver and updates messages
			var found = false;
			var retVar;
			_(chatLog).each(function(entry){
				if(entry.id === chatId){
					found = true;
					if(mess !== undefined) entry.messages.unshift(mess);
					retVar = entry;
				}
			});

			//if not found make a new entry
			if(!found){
				if(mess !== undefined) chatLog.push({id:chatId, messages:[mess], currentMessage:-1});
				else chatLog.push({id:chatId, messages:[], currentMessage:-1});
				retVar = _.last(chatLog);
			}

			return retVar;
		},

		//refreshes the chat for style bugs
		refreshChats: function(){
			$('.messenger-container').css({
				'width': $(window).width()
			})
			$('.chat').css({
				'width': $(window).width()
			});
		},

		//injects messenger on addition
		appendMessenger: function(rec){
			if(messengerCount === 3){
				alert("max number of windows")
				return null;
			}

			if(rec){
				//update messenger count
				this.messengerCount++;

				var chatId = "chat-" + this.messengerCount;

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

				//update chatLog
				this.updateChatLog(chatId);

				//focus on new chat window
				html.find('.cmd').focus().autogrow();

				//initializes resize event
				initResizableChat(chatId);

				//handles close button
				html.find(".remove-messenger").on("click",function(clickEvent){
					html.remove()
					_.remove(chatLog, function(n){return n.id === chatId})
					this.messengerCount--;
					this.refreshChats();
				});

				//keydown fucntions for command line
				var saveCmd;
			    html.find('.cmd').keydown(function(e) {
					var chatId = $(this).closest('.chat').attr('id');
					//enter key submit
				    if (e.keyCode === 13) {
						e.preventDefault();
						chatEvent.enterKeyHandler(chatId); 
				    }

				    //up arrow to go through chat log
				    if(e.keyCode === 38){
				    	e.preventDefault();
						chatEvent.upArrowHandler(chatId);
				    }

				    //down arrow to go through chat log
				    if(e.keyCode === 40){
				    	e.preventDefault();
		 				chatEvent.downArrowHandler(chatId);
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
			var chat = "<div>" + user.name + ": " + value + "</div>";
			container.append(chat);
			chatEvent.checkScrollbar(chatId);
		},

		//client side submit function
		submit: function(id, inp){
			var chatId = "#"+id;
			var container = $(chatId).find('.chat-container');
			var cmd = $(chatId).find('.cmd');
			if(inp === undefined) var inp = cmd.val();
			if(inp != ""){
				this.updateChatLog(id, inp);

				//send the message to the server
				//TEMPORARY: the array of receiving usernames is currently set to null
				var testing = this.getReceivers(id);
				chatSocket.sendChatMsg(id, testing, inp);

				command(id, inp);
				cmd.val("");
			}
			cmd.focus();
		}
	}

});
