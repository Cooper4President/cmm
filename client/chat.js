//main function
$(document).ready(function(){
     $(".sub").on("click", function(cEvent){
     	submit();
     });
});

//update chat function
function updateChat(prompt, value){
	$(".chat-container").append("<div>" + prompt +": "+ value + "</div>");
}

//Enter key functionality for sumbitting messages
$(document).delegate('input:text','keypress',function(e) {
    if (e.which === 13) {
		e.preventDefault();
		submit();
    };
});

//client side submit function
function submit(){
	var inp = $(".cmd").val();

	//uses cookie for username Note: should store in database once implemented
	var cookie = document.cookie.split(';');
	var login = cookie[0].split('=');
	var user = login[1];

	parseCommand(user, inp);

	$(".cmd").val("");		
	$(".cmd").focus();
}

//prints help
function printHelp(){
	$.ajax({
		url: "help.txt",
		dataType: "text",
		success: function (data){
			data = data.replace(/\n/g, "<br />");
			updateChat("HELP", data);
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