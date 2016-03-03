var chatLog = [];

//main function
$(document).ready(function(){
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
				var reciever = getReciever(this);
				$.ajax({
					url: "user.txt",
					dataType: "text",
					success: function(user){
						chatLog.unshift($(thisClass).val());
						submit(user, reciever);
					},
					error: function(){
						console.log('could not read user file');
					}
				});
		    }
		    //up and down arrows to go through chat log
		    if(e.keyCode == 38){
	    		var index = chatLog.indexOf($(thisClass).val());
	    		console.log(index);
				if(index > -1){
					if(index < chatLog.length-1) $(thisClass).val(chatLog[index+1]);
				}else{
					$(thisClass).val(chatLog[0]);
				}
		    }
		    if(e.keyCode == 40){
		    	var index = chatLog.indexOf($(thisClass).val());
		    	console.log(index);
				if(index > -1){
					if(index < chatLog.length) $(thisClass).val(chatLog[index-1]);
				}else{
					$(thisClass).val("");
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

//checks input for command dilimiter
function commandCheck(val){
	if(/\w*\s*--\s*\w*/.test(val)){
		return true;
	}else return false;
}

//gets reciever of current chat window
function getReciever(obj){
	var cl = $(obj).attr('class').split(" ");
	return cl[1];
}

//Enter key functionality for submitting messages


//Enter key functionality for submitting chat windows


//client side submit function
function submit(user, rec){
	var thisClass = ".cmd."+rec;
	var inp = $(thisClass).val();
	if(inp != ""){
		if(!commandCheck(inp)){ //checks if command
			//uses cookie for username Note: should store in database once implimented
			updateChat(user, rec, inp);
		}else{
			parseCommand(user, rec, inp);
		}
		$(thisClass).val("");		
	}
	$(thisClass).focus();
}

//prints help
function printHelp(rec){
	console.log("call");
	$.ajax({
		url: "help.txt",
		dataType: "text",
		success: function (data){
			data = data.replace(/\n/g, "<br />");
			console.log(data);
			updateChat("HELP", rec, data);
		},
		error: function(){
			updateChat("ERROR",rec,"Server is down");
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