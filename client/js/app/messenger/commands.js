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

	globalColor = "";
	globalBold = false;

	return function(chatId, inp){ 
		//this is the main object to store command data
		var envelope = {
			username: user.name
		}
		
		//The chat container
		var container = $("#"+chatId).find('.chat-container');

		//Strip any existing html tags that the user might have entered, to prevent malicious script injections
		inp = inp.replace(/(<([^>]+)>)/ig,"")

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
						var colorInfo = setFontColor(words, cmdInfo, inp);
						if(colorInfo.isError){
							return {error: colorInfo.errorMsg};
						}
						else{
							inp = colorInfo.inp;
						}
						break;
					case "--bold":
						var boldInfo = setBold(words, cmdInfo, inp);
						if(boldInfo.isError){
							return {error: boldInfo.errorMsg};
						}
						else{
							inp = boldInfo.inp;
						}
						break;
					default:
						var err = "Command " + cmdInfo.cmdName + " not found. Type --help for help";
						return {error: err};
						break;
				}
			}

			inp = _.trim(inp);
		}

		if(inp != ""){
			envelope.message = inp;
		 
			if(globalColor){
				envelope.message = inp.fontcolor(globalColor);
			}

		}

		return envelope;
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
		var cmdCount = 0;
		var cmd, arg, word;

		for(var i=0; i<words.length; i++){
			word = words[i];
			
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
		var colorInfo = {};	

		if(_.indexOf(words, cmdInfo.cmdName) + cmdInfo.argList.length == words.length-1){
			colorInfo.isError = true;
			colorInfo.errorMsg = "Cannot set color at the end of a message. You must specify a target. Type --help for help."
			return colorInfo;
		}

		if(cmdInfo.argList.length > 1){
			colorInfo.isError = true;
			colorInfo.errorMsg = "The " + cmdInfo.cmdName + " command does not support multiple arguments. Type --help for help."
		}

		//The color will be the first word after the --color command and whatever argument they pass.
		var startIndex = _.indexOf(words, cmdInfo.cmdName)

		var colorIndex = startIndex + cmdInfo.argList.length + 1;
		var color = words[colorIndex];

		var regex;

		if(cmdInfo.argList.length > 0){
			var arg = cmdInfo.argList[0];

			switch(arg){
				case "&word":
					regex = new RegExp(words[colorIndex + 1]);
					break;
				case "&message":
					regex = new RegExp(".*");
					break;
				case "&selection":
					//The ? makes the regex non-greedy, so it will just match the first brackets
					regex = new RegExp("\{.*?\}");
					break;
				case "&all":
					globalColor = color;
					break;
				default:
					colorInfo.isError = true;
					colorInfo.errorMsg = arg + " is not a recognized argument for " + cmdInfo.cmdName + ". Type --help for help.";
					return colorInfo;
					break;
			}
		}
		else{
			startWord = words[colorIndex+1];
			regex = new RegExp(startWord + '.*');	
		}
		
		//Need to clean up the command and args from inp and words so they don't get displayed
		inp = inp.replace(color, '');
		words.splice(colorIndex, 1);
		inp = cleanupInp(cmdInfo, inp);
		words = cleanupWords(cmdInfo, words);

		if(inp != ""){
			//find the target portion of the string using the regex
			var targetStr = inp.match(regex);

			//add html color tags around the target string portion of the message
			inp = inp.replace(targetStr, "<font color=\"" + color + "\">" + targetStr + "</font>");

			//Need to remove brackets from selected text
			if(cmdInfo.argList[0] == "&selection"){
				var removedBrackets = targetStr[0].replace(/^\{/,'');
				removedBrackets = removedBrackets.replace(/\}$/,'');
				inp = inp.replace(targetStr, removedBrackets);
			}

			colorInfo.inp = inp;
		}

		return colorInfo;
	}

	function setBold(words, cmdInfo, inp){
		var boldInfo = {};	

		if(_.indexOf(words, cmdInfo.cmdName) + cmdInfo.argList.length == words.length-1){
			boldInfo.isError = true;
			boldInfo.errorMsg = "Cannot set bold at the end of a message. You must specify a target. Type --help for help."
			return boldInfo;
		}

		if(cmdInfo.argList.length > 1){
			boldInfo.isError = true;
			boldInfo.errorMsg = "The " + cmdInfo.cmdName + " command does not support multiple arguments. Type --help for help."
		}

		//The bold will be the first word after the --bold command and whatever argument they pass.
		var startIndex = _.indexOf(words, cmdInfo.cmdName)

		var boldIndex = startIndex + cmdInfo.argList.length;

		var regex;

		if(cmdInfo.argList.length > 0){
			var arg = cmdInfo.argList[0];

			switch(arg){
				case "&word":
					regex = new RegExp(words[boldIndex + 1]);
					break;
				case "&message":
					regex = new RegExp(".*");
					break;
				case "&selection":
					//The ? makes the regex non-greedy, so it will just match the first brackets
					regex = new RegExp("\{.*?\}");
					break;
				case "&all":
					globalbold = true;
					break;
				default:
					boldInfo.isError = true;
					boldInfo.errorMsg = arg + " is not a recognized argument for " + cmdInfo.cmdName + ". Type --help for help.";
					return boldInfo;
					break;
			}
		}
		else{
			startWord = words[boldIndex+1];
			regex = new RegExp(startWord + '.*');	
		}
		
		//Need to clean up the command and args from inp and words so they don't get displayed
		inp = cleanupInp(cmdInfo, inp);
		words = cleanupWords(cmdInfo, words);

		if(inp != ""){
			//find the target portion of the string using the regex
			var targetStr = inp.match(regex);

			//add html color tags around the target string portion of the message
			inp = inp.replace(targetStr, "<b>" + targetStr + "</b>");
			alert(inp);

			//Need to remove brackets from selected text
			if(cmdInfo.argList[0] == "&selection"){
				var removedBrackets = targetStr[0].replace(/^\{/,'');
				removedBrackets = removedBrackets.replace(/\}$/,'');
				inp = inp.replace(targetStr, removedBrackets);
			}

			boldInfo.inp = inp;
		}

		return boldInfo;
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
