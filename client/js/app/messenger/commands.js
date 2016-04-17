/*
	Defines commands that can be run inside chat window
*/


define([ //list of dependencies to load for this module
	'jquery', //first arguement $
	'lodash',//second arguement _
	'misc/date', //third aguement date
	'misc/help', //etc...
	'messenger/bin/wolfram',
	'messenger/bin/font',
	'./chatInfo',
	'misc/user',
	'./chatSockets',
	'hbs!templates/message'
	], function($, _, date, help, wolfram, font, chatInfo, user, chatSockets, message){ //references to the modules in order of dependencies
	//when you return something in a module, you are simply stating what are the public functions of this module
	//this returns a function, as this is the only function that this modele requires, it can also be anything that
	//can be returned (such as an object, which most modules in this case return)


	globalFontAttributes = {};

	return function(chatId, inp){
		// this is the main object to store command data
		var envelope = {
			username: user.name
		};

		//The chat container
		var container = $("#"+chatId).find('.chat-container');

		//Strip any existing html tags that the user might have entered, to prevent malicious script injections
		inp = inp.replace(/(<([^>]+)>)/ig,"");

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
					case "--help":
						help(chatId);
						break;
					case "--date":
						var today = date;
						inp = _.replace(inp, cmd, today); //replacing date command input with date
						break;
					case "--clear":
						container.empty();
						break;
					case "--font":
						var fontInfo = font(words, cmdInfo, inp);
						if(fontInfo.isError){
							return {error: fontInfo.errorMsg};
						}
						else{
							inp = fontInfo.inp;
							words = fontInfo.words;
							inp = cleanupInp(cmdInfo, inp);
							words = cleanupWords(cmdInfo, words);
						}
						
						break;
					case "--picture":
						//url is next arguement
						var imgUrl = words[i+1];
						if(imgUrl){
							//this is how you manually store data for the pictue
							envelope.image = {
								url: imgUrl,
								width: 0.8*container.width()
							};
							
							inp = _.replace(inp, imgUrl, '');
						}
						else{
							//to write an error, simply return this error object with the error
							 return {error: "Error: Invalid picture url"};
						}
						break;
					case "--newtab":
						window.open('', '_blank');
						inp = inp.replace(cmdInfo.cmdName, '');
						break;
					case "--search":
					//NEED TO IMPLIMENT WITH QUOTED SEARCH STRING
						var searchStr = _.trim(inp.replace(cmdInfo.cmdName, '').replace(/\s+/g,'+'), '+');
						var searchUrl = 'https://www.google.com/search?q=' + searchStr;
						window.open(searchUrl, '_blank');
						return; //might want to change if we don't want stand alone function
						break;
					case "--wolfram":
						inp = cleanupInp(cmdInfo, inp);
						wolfram(chatId, inp);
						break;
					default:
						var err = "Command " + cmdInfo.cmdName + " not found. Type --help for help";
						return {error: err};
						break;
				}
			}
			inp = _.trim(inp);
		}

		if(globalFontAttributes){
			inp = addFontTags(globalFontAttributes, inp);	
		}

		if(inp != ""){
			envelope.message = inp;
		}

		return envelope;
	}

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


	function addFontTags(fontAttributes, fontStr){
	if(fontAttributes.isBold){
		fontStr = "<b>" + fontStr + "</b>";
	}

	if(fontAttributes.isItalic){
		fontStr = "<i>" + fontStr + "</i>";
	}

	if(fontAttributes.isColor || fontAttributes.isSize){
		var fontTag = "<font ";
		if(fontAttributes.isColor){
			fontTag = fontTag + "color=\"" + fontAttributes.color + "\" ";
		}
		if(fontAttributes.isSize){
			fontTag = fontTag + "size=\"" + fontAttributes.size + "\" ";
		}

		fontTag = fontTag + ">";

		fontStr = fontTag + fontStr + "</font>";
	}

	return fontStr;
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

