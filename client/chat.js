var chatLog = [];

//main function
$(document).ready(function(){
	$('.messenger-container').sortable({axis:'x'});
    $(".add-messenger").on("click",function(clickEvent){
     	$(".add-messenger").text("").append("<input type='text' class='reciever' placeHolder='Press Enter to submit'>");
     	$(".reciever").focus();
     	//keydown function for reciever input
     	$(".reciever").keydown(function(e) {
		    if (e.keyCode == 13) {
		    	e.preventDefault();
				if($('.reciever').val() != "")appendMessenger($('.reciever').val());
		    }
		    else if(e.keyCode == 27){
		    	e.preventDefault();
		    	revertMessengerButton();
		    }
     	});
	});
});

//updates chatlog, adds new entry if reciever not found
function updateChatLog(rec, mess){
	var found = false;
	for(i=0; i<chatLog.length;i++){
		if(chatLog[i].reciever == rec){
			chatLog[i].currentMessage = -1;
			var size = chatLog[i].messages.length;
			chatLog[i].messages.unshift(mess);
			found = true;
		}
	}
	if(!found){ //create new chat log entry
		chatLog.push({reciever:rec, messages:[mess], currentMessage:-1});
	}
}

//injects messenger on addition
function appendMessenger(rec){
	if(/\s+/g.test(rec)){
		alert("username cannot have spaces");
		return;
	}
	if(!$('.chat-container').hasClass(rec)){
		var thisClass = '.cmd.'+rec;
		var context = {reciever : rec};
		var html = $(Handlebars.templates['messenger-template'](context));
		$('.messenger-container').append(html);
		revertMessengerButton();
		$(thisClass).focus().autogrow();
		html.find(".remove-messenger").on("click",function(clickEvent){
	     	html.remove()
	    });
	    //keydown function for chat input
	    $(thisClass).keydown(function(e) {
	    	//enter key submit
		    if (e.keyCode == 13) {
				e.preventDefault();
				var rec = getReciever(this);
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
		    //up and down arrows to go through chat log
		    if(e.keyCode == 38){
		    	e.preventDefault();
		    	var rec = getReciever(this);
		    	for(i=0;i<chatLog.length;i++){
		    		if(chatLog[i].reciever == rec){
		    			var index = chatLog[i].currentMessage;
		    			if(index > -1){
		    				if(index < chatLog[i].messages.length-1) $(this).val(chatLog[i].messages[index+1]);
		    			}else{
		    				$(this).val(chatLog[i].messages[0]);
		    			}
	    				chatLog[i].currentMessage++;
		    		}
		    	}
		    }
		    if(e.keyCode == 40){
		    	e.preventDefault();
		    	var rec = getReciever(this);
		    	for(i=0;i<chatLog.length;i++){
		    		if(chatLog[i].reciever == rec){
		    			var index = chatLog[i].currentMessage;
		    			if(index == 0){
		    				$(this).val("");
		    			}else if((index > -1)){
		    				if(index < chatLog[i].messages.length) $(this).val(chatLog[i].messages[index-1]);
		    			}
	    				chatLog[i].currentMessage--;
		    		}
		    	}		    
		    }
		});
	}else{
		alert("chat box already open for that username");
	}
}

	
//reverts messenger add button to original state
function revertMessengerButton(){
	$('.reciever').remove();
	$('.add-messenger').text("+");
}

//update chat function
function updateChat(prompt, rec, value){
	var thisClass = ".chat-container."+rec;
	$(thisClass).prepend("<div>"+prompt + ": " + value + "</div>");
}

//gets reciever of current chat window
function getReciever(obj){
	var cl = $(obj).attr('class').split(" ");
	return cl[1];
}

//client side submit function
function submit(user, rec){
	var thisClass = ".cmd."+rec;
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