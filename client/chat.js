//main function
$(document).ready(function(){
     $(".add-messenger").on("click",function(clickEvent){
     	$(".add-messenger").text("").append("<input type='text' class='reciever' placeHolder='Press Enter to submit'>");
     	$(".reciever").focus();
     });
});

function appendMessenger(rec){
	var context = {reciever : rec};
	var html = $(Handlebars.templates['messenger-template'](context));
	$('.messenger-container').append(html);
	$('.reciever').remove();
	$('.add-messenger').text("+");
	$('.cmd.'+rec).focus();
	html.find(".remove-messenger").on("click",function(clickEvent){
     	html.remove()
     });
}


//update chat function
function updateChat(prompt, rec, value){
	console.log(rec);
	$(".chat-container."+rec).append("<div>" +prompt+": "+value+ "</div>");
}

//checks input for command dilimiter
function commandCheck(val){
	if(/\w*\s*--\s*\w*/.test(val)){
		return true;
	}else return false;
}

function getUser(){
	var cookie = document.cookie.split(';');
	var login = cookie[0].split('=');
	if(login[0] == 'login') return login[1];
	else return null;
}

function getReciever(obj){
	var cl = $(obj).attr('class').split(" ");
	return cl[1];
}

//Enter key functionality for submitting messages
$(document).delegate('input.cmd','keypress',function(e) {
    if (e.which === 13) {
		e.preventDefault();
		var user = getUser();
		var reciever = getReciever(this);
		submit(user, reciever);
    };
});

//Enter key functionality for submitting chat windows
$(document).delegate('input.reciever','keypress',function(e) {
    if (e.which === 13) {
		e.preventDefault();
		if($('.reciever').val() != "")appendMessenger($('.reciever').val());
    }
});

//client side submit function
function submit(user, rec){
	var inp = $(".cmd."+rec).val();
	if(inp != ""){
		if(!commandCheck(inp)){ //checks if command
			//uses cookie for username Note: should store in database once implimented
			updateChat(user, rec, inp);
		}else{
			parseCommand(inp, rec);
		}
		$(".cmd."+rec).val("");		
	}
	$(".cmd."+rec).focus();
};

//prints help
function printHelp(rec){
	$.ajax({
		url: "help.txt",
		dataType: "text",
		success: function (data){
			data = data.replace(/\n/g, "<br />");
			updateChat("HELP", rec, data);
		},
		error: function(){
			updateChat("ERROR","Server is down");
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