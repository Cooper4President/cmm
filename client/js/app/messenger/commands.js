/*
	ARGUEMENT FOR COMMANDS ARE NOW SPACE SEPERATED AS OPPOSED TO '='
*/


define([ //list of dependencies to load for this module
	'jquery', //first arguement $
	'lodash',//second arguement _
	'misc/date', //third aguement getDat
	'misc/help', //etc...
	'./chat-info', 
	'hbs!templates/message',
	'misc/user'
], function($, _, getDate, help, chatInfo, message, user){ //references to the modules in order of dependencies
	//when you return something in a module, you are simply stating what are the public functions of this module
	//this returns an function, as this is the only function that this modele requires, it can also be anything that
	//can be returned (such as an object, which most modules in this case return)
	return function(chatId ,inp){ 
		//this is the main object to store command data
		var envilope = {
			username: user.name
		}

		var container = $("#"+chatId).find('.chat-container');
		//match the -- delimiter to find all commands in the input
		if(_.includes(inp , '--')){
			//get all space seperated words
			var commands = _.split(inp, ' ');
			_.pull(commands, "");
			//loop through to find commands
			for(i=0;i<commands.length;i++){
				var cmd = commands[i];
				//match the command name, and execute command accordingly
				if(_.startsWith(cmd, '--')){
					name = _.replace(cmd, '--', '');
					switch(name){
					case "help":
						help(chatId);
						break;
					case "date":
						var date = getDate;
						inp = _.replace(inp, cmd, date); //replacing date command input with date
						break;
					case "clear":
						container.empty();
						break;
					case "color":
						//color is next arguement
						var color = commands[i+1];
						if(color){
							inp = _.replace(inp, color, ''); //replacing first arguement of color command
							inp = inp.fontcolor(color);
						}
						else return {error: "Error: Invalid color"};
						break;
					case "font":
						inp = _.replace(inp, cmd, '');
						cmd = "fontsize";
					case "fontsize":
						//size is next arguement
						var size = commands[i+1];
						if(size) {
							inp = _.replace(inp, size, ''); //replacing first arguement of font command
							inp = inp.fontsize(size);
						}
						else return {error: "Error: Invalid font size"};
						break;
					case "bold":
						inp = inp.bold();
						break;
					case "italic":
						inp = _.replace(inp, cmd, ''); //make sure to replace secondary command names manually
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
					case "pic":
						inp = _.replace(inp, cmd, '');
						cmd = "picture";
					case "picture":
						//url is next arguement
						var imgUrl = commands[i+1];
						if(imgUrl){
							//this is how you manually store data for the pictue
							envilope.image = {
								url: imgUrl,
								width: 0.8*container.width()
							}
							inp = _.replace(inp, imgUrl, '');
						}
						else{
							//to write an error, simply return this error object with the error
							 return {error: "Error: Invalid picture url"};
						}
						break;
					case "newtab":
						window.open('', '_blank');
						break;
					case "search":
					//NEED TO IMPLIMENT WITH QUOTED SEARCH STRING
						var searchStr = _.trim(inp.replace(cmd, '').replace(/\s+/g,'+'), '+');
						var searchUrl = 'https://www.google.com/search?q=' + searchStr;
						window.open(searchUrl, '_blank');
						return; //might want to change if we don't want stand alone function
						break;
					default:
						var err = "Error: Command " + cmd.bold() + " not found. Type --help for help";
						return {error: err};
						break;
					}
					inp = _.replace(inp, cmd, ''); //removes command reference in input after each command
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
