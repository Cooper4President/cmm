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

	globalFontAttributes = {};

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
					case "--font":
						var fontInfo = setFont(words, cmdInfo, inp);
						if(fontInfo.isError){
							return {error: fontInfo.errorMsg};
						}
						else{
							inp = fontInfo.inp;
							words = fontInfo.words;
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
			if(globalFontAttributes){
				inp = addFontTags(globalFontAttributes, inp);	
			}
			envelope.message = inp;
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

	function setFont(words, cmdInfo, inp){
		var returnData = {};
		var fontAttributes = {
			global: false,
			selection: false,
			bold: false,
			italic: false,
			color: false,
			size: false,
			colorStr: "black",
			sizeStr: "3"
		};

		fontCmdIndex = _.indexOf(words, cmdInfo.cmdName);
		var startWord = nextValidWord(words, fontCmdIndex);

		numArgs = cmdInfo.argList.length;

		var targetStr;
		var targetRegex;

		for(var i = 0; i<numArgs; i++){
			var arg =  cmdInfo.argList[i];

			switch(arg){
				case "&word":
					if(startWord == ""){
						returnData.isError = true;
						returnData.errorMsg = "Error: No valid word available following " + cmdInfo.cmdName + " command. Type --help for help."
						return returnData;
					}
					targetRegex = new RegExp(cmdInfo.cmdName + ".*" + startWord);
					break;
				case "&message":
					targetRegex = new RegExp(".*");
					break;
				case "&selection":
					//The ? makes the regex non-greedy, so it will just match the first set of brackets brackets
					fontAttributes.selection = true;
					targetRegex = new RegExp("\{.*?\}");
					break;
				case "&all":
					fontAttributes.global = true;
					break;
				case "&bold":
					fontAttributes.bold = true;
					break;
				case "&italics":
					//fall through to italic case, so both are accepted
				case "&italic":
					fontAttributes.italic = true;
					break;
				default:
					arg = arg.replace('&', '');
					_.trim(arg);
					if(arg.match(/^[1-7]$/)){
						fontAttributes.size = true;
						fontAttributes.sizeStr = arg;
					}
					else if(isValidColor(arg)){
						fontAttributes.color = true;
						fontAttributes.colorStr = arg;
					}
					else{
						returnData.isError = true;
						returnData.errorMsg = "&" + arg + " is not a valid argument for " + cmdInfo.cmdName + ". Type --help for help.";
						return returnData;	
					}
					break;
			}
		}

		if(fontAttributes.global){
			globalFontAttributes = fontAttributes;
		}

		if(!targetRegex){
			targetRegex = new RegExp(cmdInfo.cmdName + ".*" + startWord + ".*");
		}

		targetStr = inp.match(targetRegex);

		if(targetStr != ""){
			var fontStr = addFontTags(fontAttributes, targetStr);
			inp = inp.replace(targetStr, fontStr);

			if(fontAttributes.selection){
				inp = removeBrackets(inp, targetStr[0])
			}

			inp = cleanupInp(cmdInfo, inp);
			words = cleanupWords(cmdInfo, words);

			//Need to remove command and args from the inp string and words array
			returnData.inp = inp;
			returnData.words = words;
		}

		return returnData;
	}

	function addFontTags(fontAttributes, fontStr){
		if(fontAttributes.bold){
			fontStr = "<b>" + fontStr + "</b>";
		}

		if(fontAttributes.italic){
			fontStr = "<i>" + fontStr + "</i>";
		}

		if(fontAttributes.color || fontAttributes.size){
			var fontTag = "<font ";
			if(fontAttributes.color){
				fontTag = fontTag + "color=\"" + fontAttributes.colorStr + "\" ";
			}
			if(fontAttributes.size){
				fontTag = fontTag + "size=\"" + fontAttributes.sizeStr + "\" ";
			}

			fontTag = fontTag + ">";

			fontStr = fontTag + fontStr + "</font>";
		}

		return fontStr;
	}

	function removeBrackets(inp, targetStr){
		//Need to remove brackets from selected text
		var removedBrackets = targetStr;
		removedBrackets = removedBrackets.replace(/^\{/,'');
		removedBrackets = removedBrackets.replace(/\}$/,'');
		inp = inp.replace(targetStr, removedBrackets);
		return inp;
	}

	function nextValidWord(words, startIndex){
		for(var i = startIndex; i < words.length; i++){
			if(!words[i].match(/^(&|-{2})/)){
				return words[i];
			}
		}
		return "";
	}

	//Creates a temporay image element, tries to set the color of it, and if it fails then the argument is not a valid color.
	//Modified function a StackOverflow post: http://stackoverflow.com/questions/6386090/validating-css-color-names
	function isValidColor(arg) {
	    //Alter the following conditions according to your need.
	    if (arg === "") { return false; }
	    if (arg === "inherit") { return false; }
	    if (arg === "transparent") { return false; }

	    var image = document.createElement("img");
	    image.style.color = "rgb(0, 0, 0)";
	    image.style.color = arg;
	    if (image.style.color !== "rgb(0, 0, 0)") { return true; }
	    image.style.color = "rgb(255, 255, 255)";
	    image.style.color = arg;
	    return (image.style.color !== "rgb(255, 255, 255)");
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

