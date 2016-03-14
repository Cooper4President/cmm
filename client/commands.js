//parses command for functionality
function parseCommand(user, rec ,inp){

	var chatContainerClass = "[class = 'chat-container "+rec+"']";
	//match the -- delimiter to find all commands in the input
	var matchList = inp.match(/--\w+/g);
	//check that there is a command in the input
	if(matchList){
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
					getHelp(rec);
					break;
				case "date":
					var date = getTodaysDate();
					msg = msg + " " + date;
					break;
				case "clear":
					$(chatContainerClass).empty();
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
						updateChat("ERROR", rec,"Invalid color");
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
						updateChat("ERROR", rec,"Invalid font size");
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
				case "picture":
					var findURL = inp.match(/--picture\s*=\s*(.*)\s*/);
					if(findURL){
						var img_url = findURL[1]
						var img = "<img src='" + img_url + "' alt='test'>";
						updateChat(user, rec, img);
						msg = msg.replace(img_url, '');
					}
					else{
						updateChat("ERROR", rec,"Invalid pictue url");
					}
					break;
				default:
					updateChat("ERROR", rec,"Command " + cmd.bold() + " not found. Type --help for help");
					break;
			}
		});
		if(msg != "") updateChat(user, rec, msg);
	}else updateChat(user, rec, inp);
}