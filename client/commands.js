//parses command for functionality
function parseCommand(cmd, rec){
	command = cmd.replace('--','');

	//NOTE: might want to impliment jump table later
	if(command == "help"){
		printHelp(rec);
	}
	else if(command == "date"){ //date command
		var date = getTodaysDate();
		updateChat("DATE", rec, date)
	}
	else if(command == "clear"){ //clear command
		$(".chat-container."+rec).empty(); 
	}
	else{
		updateChat("ERROR", "Command not found. Type --help for help")
	}
}