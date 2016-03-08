var chatLog = [];

//main function
$(document).ready(function(){
	
	//send authentication token to server
	sendAuthToken();
	$('.messenger-container').sortable({axis:'x'});
    $(".add-messenger").on("click",function(clickEvent){
     	addRecieverField();
	});
});

//parses raw text of reciever field
function parseReciever(recRaw){
	var recList = _.map(_.split(recRaw, ","), function(n){return _.trim(n)});
	var found = false
	_(recList).forEach(function(entry){
		if(_.includes(entry, " "))found = true;
	});
	_(chatLog).forEach(function(entry){
		if(checkIfEqual(entry.reciever, recList)) found = true;
	});

	if(found) return null;
	else return recList.sort();
}

//replaces add messenger button with reciever field
function addRecieverField(){

	//adds reciever field and focuses cursor
	$(".add-messenger").text("").append("<div class='error'></div><textarea type='text' class='reciever' placeHolder='Press Enter to submit'></textarea>");
     	$(".reciever").focus().autogrow(); //scroll at certain height?

     	//keydown function for reciever input
     	$(".reciever").keydown(function(e) {
		    if (e.keyCode == 13) {
		    	e.preventDefault();
		    	//pulls reciever value and tests if valid
		    	var rec = $('.reciever').val();
				appendMessenger(parseReciever(rec));
		    }
		    //esc out of reciever window
		    else if(e.keyCode == 27){
		    	e.preventDefault();
		    	revertMessengerButton();
		    }
     	});
}

//checks if two arrays are equal
function checkIfEqual(arr1, arr2){
	arr1.sort(); arr2.sort();
	var match;
	if(arr1.length != arr2.length){
		return false;
	}
	for(i=0;i<arr1.length;i++){
		if(arr1[i] !== arr2[i]){
			return false;
		}
	}
	return true;
}	

//updates chatlog, adds new entry if reciever not found
function updateChatLog(rec, mess){

	//finds reciever and updates messages
	var found = false;
	_(chatLog).forEach(function(entry){
		if(checkIfEqual(entry.reciever, rec)){
			found = true;
			if(mess) entry.messages.unshift(mess);
		};
	});

	//creates new chat log entry if not reciever found
	if(!found){ 
		if(mess) chatLog.push({reciever:rec, messages:[mess], currentMessage:-1});
		else chatLog.push({reciever:rec, messages:[], currentMessage:-1});
	}	
}

function initResizableChat(){
	var container;
	$('.chat').resizable({
		handles: 'e',
		start: function (event, ui){
			container = ui.originalSize.width + ui.element.next().width();
		},
		resize: function (event, ui){
			ui.element.next().width(container - ui.size.width);
		}
	});
}

//injects messenger on addition
function appendMessenger(rec){
	//compiling space seperated list of recievers

	if(rec){
		updateChatLog(rec);

		//formats recievers for chat head title
		var recFormated = _.join(rec, ', ');

		var recList = _.join(rec,' ');

		//base class for chat box input
		var chatId = chatLog.length;

		//pulling precompiled handlebars template
		var context = {id : 'chat-' + chatId, formated: recFormated};
		var html = $(Handlebars.templates['client/messenger-template.handlebars'](context));

		//appending to message container of body
		$('.messenger-container').prepend(html);

		//reverts
		revertMessengerButton();
		html.find('.cmd').focus().autogrow();

		initResizableChat();


		//handles close button
		html.find(".remove-messenger").on("click",function(clickEvent){
	     	html.remove()
	    });

		//keydown fucntions for command line
	    $('.cmd').keydown(function(e) {
	    	//enter key submit
		    if (e.keyCode === 13) {
				e.preventDefault();
				//$(this).closest('.chat-container').attr('id')); use closest attribute for chat-container appending
				/*
				$.ajax({
					url: "user.txt",
					dataType: "text",
					success: function(user){
						submit(user, rec);
					},
					error: function(){
						console.log('could not read user file');
					}
				});
				*/

		    }

		    //up arrow to go through chat log
		    if(e.keyCode === 38){
		    	e.preventDefault();
		    	var rec = getRecieverClass(this);
		    	for(i=0;i<chatLog.length;i++){
		    		if(chatLog[i].reciever == rec){
		    			var index = chatLog[i].currentMessage;
		    			if(index > -1){
		    				if(index < chatLog[i].messages.length-1) {
		    					$(this).val(chatLog[i].messages[index+1]);
		    					chatLog[i].currentMessage++;
		    				}
		    			}else{
		    				$(this).val(chatLog[i].messages[0]);
		    				chatLog[i].currentMessage=0;
		    			}
		    		}
		    	}
		    }

		    //down arrow to go through chat log
		    if(e.keyCode === 40){
		    	e.preventDefault();
		    	var rec = getRecieverClass(this);
		    	for(i=0;i<chatLog.length;i++){
		    		if(chatLog[i].reciever == rec){
		    			var index = chatLog[i].currentMessage;
		    			if(index == 0){
		    				$(this).val("");
		    				chatLog[i].currentMessage = -1;
		    			}else if((index > -1)){
		    				if(index < chatLog[i].messages.length){
		    					$(this).val(chatLog[i].messages[index-1]);
		    					chatLog[i].currentMessage--;
		    				}
		    			}
		    		}
		    	}
		    }
		});
	}else alert('a username is invalid or this chat window already exsists');
	
}


//reverts messenger add button to original state
function revertMessengerButton(){
	$('.reciever').remove();
	$('.add-messenger').text("+");
}

//update chat function
function updateChat(prompt, rec, value){
	var thisClass = "[class = 'chat-container "+rec+"']";
	$(thisClass).append("<div>"+prompt + ": " + value + "</div>");
	checkScrollbar(thisClass);
}

//checks if chat box is overflowed
function checkScrollbar(thisClass){
	var elt, hasOverflow = (elt = $(thisClass)).innerWidth() > elt[0].scrollWidth;
	if(hasOverflow){
		$(thisClass).scrollTop($(thisClass)[0].scrollHeight);
	}
}

//client side submit function
function submit(user, rec){
	var thisClass = "[class = 'cmd "+rec+"']";
	var inp = $(thisClass).val();
	if(inp != ""){
		updateChatLog(rec, inp);
		parseCommand(user, rec, inp);
		$(thisClass).val("");
	}
	$(thisClass).focus();
}

//help text handler
function getHelp(rec){
	//ajax call gets help info from help.txt
	$.ajax({
		url: 'help.txt',
		dataType: 'text',
		success: function(data){
			data = data.replace(/\n/g, '<br />');
			updateChat("HELP", rec, data);
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
    if(dd<10){
        dd='0'+dd
    }
    if(mm<10){
        mm='0'+mm
    }
    var today = mm+'/'+dd+'/'+yyyy;
    return today;
}
