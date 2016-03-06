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
				appendMessenger(rec);
		    }
		    //esc out of reciever window
		    else if(e.keyCode == 27){
		    	e.preventDefault();
		    	revertMessengerButton();
		    }
     	});
}

//check if reciever is legit
function checkReciever(rec){
	if($('.chat').length == 0){
		return true;
	}else{
		var recArray = rec.split(' ');
		var found = false;
		chatLog.forEach(function(log){
			var recTemp = log.reciever.split(' ');
			if(checkIfEqual(recArray, recTemp)){
				found = true;
				return;
			}

		});
		if(found) return false;
	}
	return true;
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

	if(mess === undefined){
		chatLog.push({reciever:rec, messages:[], currentMessage:-1});
	}
	//finds reciever and updates messages
	var found = false;
	for(i=0; i<chatLog.length;i++){ 
		if(chatLog[i].reciever == rec){
			chatLog[i].currentMessage = -1;
			var size = chatLog[i].messages.length;
			chatLog[i].messages.unshift(mess);
			found = true;
		}
	}

	//creates new chat log entry if not reciever found
	if(!found){ 
		chatLog.push({reciever:rec, messages:[mess], currentMessage:-1});
	}
}

//injects messenger on addition
function appendMessenger(rec){
	//compiling space seperated list of recievers
	recList = rec.replace(/,/g,' ').replace(/\s*$/, '').replace(/^\s*/, '').replace(/\s+/g,' ');

	if(checkReciever(recList)){
		updateChatLog(recList);

		//formats recievers for chat head title
		var recFormated = rec.replace(/\s*,\s*/g, ', ').replace(/,\s*$/, '').replace(/^\s*,\s*/, '');

		//base class for chat box input
		var cmdClass = "[class = 'cmd " +recList+ "']";

		//pulling precompiled handlebars template
		var context = {reciever : recList, formated: recFormated};
		var html = $(Handlebars.templates['client/messenger-template.handlebars'](context));

		//appending to message container of body
		$('.messenger-container').append(html);

		//reverts
		revertMessengerButton();
		$(cmdClass).focus().autogrow();
		html.find(".remove-messenger").on("click",function(clickEvent){
	     	html.remove()
	    });

		//keydown fucntions for command line
	    $(cmdClass).keydown(function(e) {
	    	//enter key submit
		    if (e.keyCode == 13) {
				e.preventDefault();
				var rec = getRecieverClass(this);
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
		    }

		    //up arrow to go through chat log
		    if(e.keyCode == 38){
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
		    if(e.keyCode == 40){
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
	$(thisClass).prepend("<div>"+prompt + ": " + value + "</div>");
}

//gets reciever of current chat window
function getRecieverClass(obj){
	var cl = $(obj).attr('class').replace('cmd ', '');
	return cl;
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
