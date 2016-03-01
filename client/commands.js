//parses command for functionality
function parseCommand(cmd){
	command = cmd.replace('--','');

	//NOTE: might want to impliment jump table later
	if(command == "help"){
		printHelp();
	}
	else if(command == "date"){ //date command
		var date = getTodaysDate();
		updateChat("DATE", date)
	}
	else if(command == "clear"){ //clear command
		$(".chat-container").empty(); 
	}
	else if(/\w*\s*--color=\s*\w*/.test(cmd)){
		changeColor(cmd);
	}
	else{
		updateChat("ERROR", "Command not found. Type --help for help")
	}
}