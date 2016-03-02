//parses command for functionality
function parseCommand(inp){
	//match the -- delimiter to find all commands in the input
	var matchList = inp.match(/--\w+/g);

	//remove all the commands from the message, to get just the text
	var msg = inp.replace(/--\w+/g,'');
	var msg = msg.replace(/\s*=\s*\w+/g,'');

	//iterate through the list of matches
	matchList.forEach(function(cmd){
		//parse out the -- delimiter
		cmd = cmd.replace('--','');

		//match the command name, and execute command accordingly
		switch(cmd){
			case "help":
				printHelp();
				break;
			case "date":
				var date = getTodaysDate();
				updateChat("DATE", date)	
				break;
			case "clear":
				$(".chat-container").empty();
				break;
			case "color":
				//find color
				var matchColor = inp.match(/--color\s*=\s*(\w+)\s*/);

				if(color){
					var color = matchColor[1];
					//set color
					msg = msg.fontcolor(color);
				}
				else{
					updateChat("ERROR", "Invalid color");
				}
				break;
			case "fontsize":
				//find font size
				var matchSize = inp.match(/--fontsize\s*=\s*([0-9]+)\s*/);
				if(matchSize){
					var size = matchSize[1];
					//set size
					msg = msg.fontsize(size);
				}
				else{
					updateChat("ERROR", "Invalid font size");
				}
				break;
			case "bold":
				msg = msg.bold();
				break;
			case "italic":
				cmd = "italics";
			case "italics":
				msg = msg.italics();
				break;
			case "big":
				msg = msg.big();
				break;
			case "small":
				msg = msg.small();
				break;
			default:
				updateChat("ERROR", "Command " + cmd.bold() + " not found. Type --help for help");
				break;
		}
	});

	//if the message is not blank, send it to chat
	if(msg != ""){
		//send message to chat window
		updateChat("USER", msg);
	}	
}