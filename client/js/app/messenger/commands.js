/*
	Defines commands that can be run inside chat window
*/


define([ //list of dependencies to load for this module
	'jquery', //first arguement $
	'lodash',//second arguement _
	'misc/date', //third aguement date
	'misc/help', //etc...
	'./chatInfo', 
	'misc/user'
	], function($, _, date, help, chatInfo, user){ //references to the modules in order of dependencies
	//when you return something in a module, you are simply stating what are the public functions of this module
	//this returns a function, as this is the only function that this modele requires, it can also be anything that
	//can be returned (such as an object, which most modules in this case return)

	var error = false;

	return function(chatId, inp){ 
		//this is the main object to store command data
		var envelope = {
			username: user.name
		}
		
		//The chat container
		var container = $("#"+chatId).find('.chat-container');

		//match the -- delimiter to find all commands in the input
		if(_.includes(inp , '--')){
			//get all space seperated words
			var words = _.split(inp, ' ');
			//remove any blank entries in words created by multiple spaces
			_.pull(words, "");

			var commands = parseCommands(words);
			//Iterate through commands and arguments
			for(var i=0; i < commands.length; i++){
				cmdInfo = commands[i];

				//Handle each command
				switch(cmdInfo.cmdName){
					case "--color":
						inp = setFontColor(words, cmdInfo, inp);
						alert(inp);
						if(error){
							error = false;
							return{error: inp};
						}
						break;
					default:
						var err = "Command " + cmdInfo.cmdName + " not found. Type --help for help";
						return {error: err};
						break;
				}
			}
			inp = _.trim(inp);
			if(inp != "") envelope.message = inp; 
			return envelope;
		}else{
			envelope.message = inp;
			return envelope;		
		} 
	}

	// return function(chatId ,inp){ 
	// 	//this is the main object to store command data
	// 	var envelope = {
	// 		username: user.name
	// 	}

	// 	var container = $("#"+chatId).find('.chat-container');
	// 	//match the -- delimiter to find all commands in the input


	// 	if(_.includes(inp , '--')){
	// 		//get all space seperated words
	// 		var words = _.split(inp, ' ');
	// 		//remove any blank entries in words created by multiple spaces
	// 		_.pull(words, "");

	// 		var commands = parseCommands(words);

	// 		//loop through to find commands
	// 		for(i=0;i<words.length;i++){
	// 			var cmd = words[i];
	// 			//match the command name, and execute command accordingly
	// 			if(_.startsWith(cmd, '--')){
	// 				name = _.replace(cmd, '--', '');
	// 				switch(name){
	// 				case "help":
	// 					help(chatId);
	// 					break;
	// 				case "date":
	// 					var date = getDate;
	// 					inp = _.replace(inp, cmd, date); //replacing date command input with date
	// 					break;
	// 				case "clear":
	// 					container.empty();
	// 					break;
	// 				case "color":
	// 					//color is next arguement
	// 					var color = getFontColor('--color', words);//words[i+1];
	// 					return{color: color};
	// 					if(color){
	// 						inp = _.replace(inp, color, ''); //replacing first arguement of color command
	// 						inp = inp.fontcolor(color);
	// 					}
	// 					else return {error: "Error: Invalid color"};
	// 					break;
	// 				case "font":
	// 					inp = _.replace(inp, cmd, '');
	// 					cmd = "fontsize";
	// 				case "fontsize":
	// 					//size is next arguement
	// 					var size = words[i+1];
	// 					if(size) {
	// 						inp = _.replace(inp, size, ''); //replacing first arguement of font command
	// 						inp = inp.fontsize(size);
	// 					}
	// 					else return {error: "Error: Invalid font size"};
	// 					break;
	// 				case "bold":
	// 					inp = inp.bold();
	// 					break;
	// 				case "italic":
	// 					inp = _.replace(inp, cmd, ''); //make sure to replace secondary command names manually
	// 					cmd = "italics";
	// 				case "italics":
	// 					inp = inp.italics();
	// 					break;
	// 				case "big":
	// 					inp = inp.big();
	// 					break;
	// 				case "small":
	// 					inp = inp.small();
	// 					break;
	// 				case "pic":
	// 					inp = _.replace(inp, cmd, '');
	// 					cmd = "picture";
	// 				case "picture":
	// 					//url is next arguement
	// 					var imgUrl = words[i+1];
	// 					if(imgUrl){
	// 						//this is how you manually store data for the pictue
	// 						envelope.image = {
	// 							url: imgUrl,
	// 							width: 0.8*container.width()
	// 						}
	// 						inp = _.replace(inp, imgUrl, '');
	// 					}
	// 					else{
	// 						//to write an error, simply return this error object with the error
	// 						 return {error: "Error: Invalid picture url"};
	// 					}
	// 					break;
	// 				case "newtab":
	// 					window.open('', '_blank');
	// 					break;
	// 				case "search":
	// 				//NEED TO IMPLIMENT WITH QUOTED SEARCH STRING
	// 					var searchStr = _.trim(inp.replace(cmd, '').replace(/\s+/g,'+'), '+');
	// 					var searchUrl = 'https://www.google.com/search?q=' + searchStr;
	// 					window.open(searchUrl, '_blank');
	// 					return; //might want to change if we don't want stand alone function
	// 					break;
	// 				default:
	// 					var err = "Error: Command " + cmd.bold() + " not found. Type --help for help";
	// 					return {error: err};
	// 					break;
	// 				}
	// 				inp = _.replace(inp, cmd, ''); //removes command reference in input after each command
	// 			}
	// 		}
	// 		inp = _.trim(inp);
	// 		if(inp != "") envelope.message = inp; 
	// 		return envelope;
	// 	}else{
	// 		envelope.message = inp;
	// 		return envelope;		
	// 	} 
	// }

	function parseCommands(words){
		var commands = [];
		for(var i=0; i<words.length; i++){
			cmdCount = 0;
			var word = words[i];
			var cmd, arg;
			if(_.startsWith(word,'--')){
				cmd = words[i];
				commands.push({'cmdName': cmd, 'argList' : []});
				cmdCount++;
			}
			else if(_.startsWith(word, '&')){
				arg = words[i];
				if(cmdCount){
					commands[cmdCount-1]['argList'].push(arg);
				}		
			}
		}
		return commands;
	}

	function setFontColor(words, cmdInfo, inp){
		var colorIndex = _.indexOf(words, cmdInfo.cmdName) + cmdInfo.argList.length + 1;

		color = words[colorIndex];

		if(colorIndex+1 == words.length-1){
			targetStr = words[colorIndex+1];
		}
		else{
			startWord = words[colorIndex+1];
			// endWord = words[words.length-1];
			regex = new RegExp(startWord + '.*');
			targetStr = inp.match(regex);	
		}
		alert(targetStr);
		
		inp = inp.replace(targetStr, "<font color=\"" + color + "\">" + targetStr + "</font>");

		inp = inp.replace(color, '');
		words.splice(colorIndex, 1);
		inp = cleanupInp(cmdInfo, inp);
		words = cleanupWords(cmdInfo, words);
		
		return inp;
	}

	//function to remove command and arguments from the message input
	function cleanupInp(cmdInfo, inp){
		inp = inp.replace(cmdInfo.cmdName, '');
		for(var i=0; i<cmdInfo.argList.length; i++){
			inp = inp.replace(cmdInfo.argList[i], '');
		}
		return inp;
	}

	function cleanupWords(cmdInfo, words){
		words.splice(words.indexOf(cmdInfo.cmdName), 1);
		for(var i=0; i<cmdInfo.argList.length; i++){
			words.splice(words.indexOf(cmdInfo.argList[i]), 1);
		}
		return words;
	}

});

//parses command and updates the chat

		// for(i=0; i< argList.length, i++){
		// 	arg = argList[i]
		// 	switch(arg){
		// 		case ''
		// 	}
		// }
