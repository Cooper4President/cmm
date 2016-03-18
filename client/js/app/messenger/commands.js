define([
	'jquery', 
	'lodash',
	'misc/date', 
	'misc/help', 
	'./chat-info', 
	'hbs!templates/message',
	'misc/user'
], function($, _, getDate, help, chatInfo, message, user){
	return function(chatId ,inp){
		var envilope = {
			username: user.name
		}

		var container = $("#"+chatId).find('.chat-container');
		//match the -- delimiter to find all commands in the input
		if(_.includes(inp , '--')){
			var commands = _.split(inp, ' ');
			_.pull(commands, "");
			for(i=0;i<commands.length;i++){
				var cmd = commands[i];
				//match the command name, and execute command accordingly
				if(_.startsWith(cmd, '--')){
					cmd = _.replace(cmd, '--', '');
					switch(cmd){
					case "help":
						help.getHelp(chatId);
						break;
					case "date":
						var date = getDate;
						inp = _.replace(inp, '--'+cmd, date);
						break;
					case "clear":
						container.empty();
						break;
					case "color":
						var color = commands[i+1];
						if(color){
							inp = _.replace(inp, color, '');
							inp = inp.fontcolor(color);
						}
						else return {error: "Error: Invalid color"};
						break;
					case "font":
						inp = _.replace(inp, '--'+cmd, '');
						cmd = "fontsize";
					case "fontsize":
						var size = commands[i+1];
						if(size) {
							inp = _.replace(inp, size, '');
							inp = inp.fontsize(size);
						}
						else return {error: "Error: Invalid font size"};
						break;
					case "bold":
						inp = inp.bold();
						break;
					case "italic":
						inp = _.replace(inp, '--'+cmd, '');
						cmd = "italics";
					case "italics":
						inp = inp.italics();
						break;
					case "big":
						inp = inp.big();
						break;
					case "small":
						inp = inp.small();
						break;
					case "picture":
						var imgUrl = commands[i+1];
						if(imgUrl){
							envilope.image = {
								url: imgUrl,
								width: container.width()
							}
							inp = _.replace(inp, imgUrl, '');
						}
						else{
							 return {error: "Error: Invalid picture url"};
						}
						break;
					case "newtab":
						window.open('', '_blank');
						break;
					case "search":
						var searchStr = _.trim(inp.replace("--"+cmd, '').replace(/\s+/g,'+'), '+');
						var searchUrl = 'https://www.google.com/search?q=' + searchStr;
						window.open(searchUrl, '_blank');
						return; //might want to change if we don't want stand alone function
						break;
					default:
						var err = "Error: Command " + cmd.bold() + " not found. Type --help for help";
						return {error: err};
						break;
					}
					inp = _.replace(inp, '--'+cmd, '');
				}
			}
			inp = _.trim(inp);
			if(inp != "") envilope.message = inp; 
			return envilope;
		}else{
			envilope.message = inp;
			return envilope;		
		} 
	}
});

//parses command and updates the chat
