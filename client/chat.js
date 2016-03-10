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
			rec: Array of recievers the the messenger will be sending to.
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

// call this in the console to get log of chat window id's paired with messeges history for that window
var chatLog = [];

//call this in console to get the current number of messengers on screen
var messengerCount = 0;

//username stored as global for later use
var user = "Oliver"

//main function
$(document).ready(function(){
	
	//send authentication token to server
	sendAuthToken();

	$(".reciever").keyup(function(e) {
 		console.log(e.keyCode);
	    if (e.keyCode == 13) {
	    	e.preventDefault();
	    	//pulls reciever value and tests if valid
	    	var rec = $('.reciever').val();
			var noErr = appendMessenger(parseReciever(rec)); //note: focus diverts to new chat
			if(noErr) hideRecieverField();
	    }
	    //esc out of reciever window
	    else if(e.keyCode == 27){
	    	e.preventDefault();
	    	hideRecieverField();
	    }
 	}).autogrow();

	//initializes sortable chat windows
	$('.messenger-container').sortable({axis:'x'});

	//adds reciever input
    $(".add-messenger").on("click",function(clickEvent){
    	showRecieverField();
	});

    //delgate for menu hover
    $(".menu").mouseenter(function(event){
    	$(this).switchClass("menu-unhover", "menu-hover");
    });

	//delegates menu option enter
	$(".menu").on("click", function(event){
		showOptions();
	});

	//delegates menu optino escape
	$(".messenger-container").mouseenter(function(event){
		hideOptions();
	});

	//updates chat windows on resize
	$(window).on("resize", function(event){
		if(event.target === window) refreshChats();
	});
});

//shows options menu
function showOptions(){
	var margin = $(".option-container").width();
	$(".menu").animate({
		top: -$(this).height()
	});
	$(".option-container").animate({
		left: 0
	});
}

//hides options menu
function hideOptions(){
    $(".menu").switchClass("menu-hover", "menu-unhover");
	var margin = $(".option-container").width();
	$(".menu").animate({
		top: 0
	});		
	$(".option-container").animate({
		left: -margin
	});
	hideRecieverField();
}

//parses raw text of reciever field
function parseReciever(recRaw){
	if(recRaw === "") return null;
	var recList = _.map(_.split(recRaw, ","), function(n){return _.trim(n)});
	var found = false
	_(recList).each(function(entry){
		if(_.includes(entry, " ") || _.includes(entry, "\n"))found = true;
		if(entry === "") found = true;
	});
	_(chatLog).each(function(entry){
		var rec = $("#"+entry.id).data().recievers;
		if(checkIfEqual(rec, recList)) found = true;
	});

	if(found) return null;
	else return recList.sort();
}

//shows reciever field
function showRecieverField(){
 	$(".reciever").animate({
 		top: 20
 	}, 500).focus();

}

//hides reciever field
function hideRecieverField(){
	$(".messenger-container").css('cursor','auto')
	$(".reciever").animate({
		top: -$(this).height()
	}, 1000).val("");

}

//checks if two arrays are equal
function checkIfEqual(arr1, arr2){
	arr1.sort(); arr2.sort();
	if(arr1.length != arr2.length) return false;
	for(i=0;i<arr1.length;i++) if(arr1[i] !== arr2[i]) return false;
	return true;
}	

//updates chatlog, adds new entry if reciever not found
function updateChatLog(chatId, mess){

	//finds reciever and updates messages
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
}

//refreshes the chat for style bugs
function refreshChats(){
	$('.messenger-container').css({
		'width': $(window).width()
	})
	$('.chat').css({
		'width': $(window).width()/messengerCount
	});
}

//initializes the resize event
function initResizableChat(chatId){
	//fixes width bug
	refreshChats();

	//initializes resizable chat
	var container;
	$("#"+chatId).resizable({
		handles: 'e',
		minWidth: 250,
		start: function(event, ui){
			container = ui.element.width() + ui.element.next().outerWidth();
		},
		resize: function(event, ui){
			ui.element.next().width(container - ui.element.width());	
		}
	});
}



//injects messenger on addition
function appendMessenger(rec){
	//compiling space seperated list of recievers

	if(rec){
		messengerCount++;

		var chatId = "chat-" + messengerCount;

		//formats recievers for chat head title
		var recFormated = _.join(rec, ', ');

		var recList = _.join(rec,' ');

		//pulling precompiled handlebars template
		var context = {id : chatId, formated: recFormated};
		var html = $(Handlebars.templates['client/messenger-template.handlebars'](context));

		//appending to message container of body
		$('.messenger-container').prepend(html);


		//append data to chat box

		$("#"+chatId).data("recievers", rec);

		//update chatLog
		updateChatLog(chatId);

		//reverts
		//revertMessengerButton();
		html.find('.cmd').focus().autogrow();

		initResizableChat(chatId);

		//handles close button
		html.find(".remove-messenger").on("click",function(clickEvent){
			html.remove()
			_.remove(chatLog, function(n){return n.id === chatId})
			messengerCount--;
			refreshChats();
		});

		//keydown fucntions for command line
	    html.find('.cmd').keydown(function(e) {
	    	//enter key submit
		    if (e.keyCode === 13) {
				e.preventDefault();
				var chatId = $(this).closest('.chat').attr('id'); 
				submit(chatId);
		    }

		    //up arrow to go through chat log
		    if(e.keyCode === 38){
		    	e.preventDefault();
				var chatId = $(this).closest('.chat').attr('id');
				_(chatLog).each(function(entry){
					if(entry.id === chatId){
						var cmd = $("#"+entry.id).find('.cmd');
						var index = entry.currentMessage;
						if(index < entry.messages.length-1){
							cmd.val(entry.messages[index+1]);
							entry.currentMessage++;
						}
					}
				}); 
		    }

		    //down arrow to go through chat log
		    if(e.keyCode === 40){
		    	e.preventDefault();
		    	var chatId = $(this).closest('.chat').attr('id');
				_(chatLog).each(function(entry){
					if(entry.id === chatId){
						var cmd = $("#"+entry.id).find('.cmd');
						var index = entry.currentMessage;
						if(index > -1){
							cmd.val(entry.messages[index-1]);
							entry.currentMessage--;
						}
					}
				}); 
		    }
		});
		return chatId;
	}else{ 
		alert('a username is invalid or this chat window already exsists');
		return null;
	}
	
}




//update chat function
function updateChat(chatId, value){
	var container = $("#"+chatId).find('.chat-container');
	var chat = "<div>"+user + ": " + value + "</div>"
	container.append(chat);
	checkScrollbar(chatId);
}

//checks if chat box is overflowed
function checkScrollbar(chatId){
	var container = $("#"+chatId).find('.chat-container');
	var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
	if(hasOverflow) container.scrollTop(container[0].scrollHeight);
}

//client side submit function
function submit(id, inp){
	var chatId = "#"+id;
	var container = $(chatId).find('.chat-container');
	var cmd = $(chatId).find('.cmd');
	if(inp === undefined) var inp = cmd.val();
	if(inp != ""){
		updateChatLog(id, inp);
		parseCommand(id, inp);
		cmd.val("");
	}
	cmd.focus();
}

//help text handler
function getHelp(chatId){
	//ajax call gets help info from help.txt
	$.ajax({
		url: 'help.txt',
		dataType: 'text',
		success: function(data){
			data = data.replace(/\n/g, '<br />');
			updateChat(chatId, data);
		},
		error: function(data){
			console.log("Error with help");
		}
	});
}

//parses today's date
function getTodaysDate(){
	var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10)dd='0'+dd
    if(mm<10)mm='0'+mm
    var today = mm+'/'+dd+'/'+yyyy;
    return today;
}

