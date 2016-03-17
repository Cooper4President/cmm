define(['jquery', 'lodash','./chat', 'misc/date', 'misc/help', './chat-info'], function($, _, chat, date, help, chatInfo){
	return function(chatId ,inp){
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
						help.getHelp(chatId);
						break;
					case "date":
						var date = date();
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
							return "Error: Invalid color";
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
							return "Error: Invalid font size";
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
							var img = "<img src='" + img_url + "' width: " + 0.8*$('.chat-container').width() + ">";
							//Appending to chat container manually
							container.append(img);
							msg = msg.replace(img_url, '');
						}
						else{
							return "Error: Invalid pictue url";
						}
						break;
					case "newtab":
						window.open('', '_blank');
						break;
					case "search":
						var searchStr = msg.replace(/\s/,'+');
						var searchUrl = 'https://www.google.com/search?q=' + searchStr;
						window.open(searchUrl, '_blank');
						msg = "";
						break;
					default:
						return "Error: Command " + cmd.bold() + " not found. Type --help for help";
						break;
				}
			});
			if(msg != "") return msg;
		}else return inp;
	}
});

//parses command and updates the chat
