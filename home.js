//main function
$(document).ready(function(){
     $(".sub").on("click", function(cEvent){
     	submit();
     });
});

//checks input for command dilimiter
function commandCheck(val){
	if(/^--/.test(val)){
		return true;
	}else return false;
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
	if(inp != ""){
		if(!commandCheck(inp)){ //checks if command
			$(".chat-container").append("<div> USER: " + inp + "</div>");
		}else{
			parseCommand(inp);
		}
		$(".cmd").val("");
	}
};

//parses command for functionality
function parseCommand(cmd){
	command = cmd.replace('--','');
	if(command == "date"){
		var date = getTodaysDate();
		$(".chat-container").append("<div> COMMAND: Current Date: " + date + "</div>");
	}
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