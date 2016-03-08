//parses command and updates the chat
function parseCommand(chatId ,inp){

	var container = $("#"+chatId).find('.chat-container');
	//match the -- delimiter to find all commands in the input
	var matchList = inp.match(/--\w+/g);
	//check that there is a command in the input
	if(matchList){
		//remove all the commands from the message, to get just the text
		var msg = inp.replace(/--\w+/g,'');
		var msg = msg.replace(/\s*=\s*\w+/g,'');
		//iterate through the list of matches
		_(matchList).forEach(function(cmd){
			//parse out the -- delimiter
			cmd = cmd.replace('--','');

			//match the command name, and execute command accordingly
			switch(cmd){
				case "help":
					getHelp(chatId);
					break;
				case "date":
					var date = getTodaysDate();
					msg = msg + " " + date;
					break;
				case "clear":
					container.empty();
					break;
				case "color":
					//find color
					var findColor = inp.match(/--color\s*=\s*(\w+)\s*/);

					if(findColor){
						var color = findColor[1];
						//set color
						msg = msg.fontcolor(color);
					}
					else{
						updateChat(chatId ,"Error: Invalid color");
					}
					break;

				case "fontsize":
					//find font size
					var findSize = inp.match(/--fontsize\s*=\s*([0-9]+)\s*/);
					if(findSize){
						var size = findSize[1];
						//set size
						msg = msg.fontsize(size);
					}
					else{
						updateChat(chatId ,"Error: Invalid font size");
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
					updateChat(chatId,"Error: Command " + cmd.bold() + " not found. Type --help for help");
					break;
			}
		});
		if(msg != "") updateChat(chatId, msg);
	}else updateChat(chatId, inp);
}