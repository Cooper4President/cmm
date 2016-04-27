/** @memberOf jQuery */

/** @module font */

/**
 *
 * @fileOverview font.js parses out the --font command, applies the appropriate html font tags, and returns the message to commands.js
 * @author Morgan Allen <moal8410@colorado.edu>
 */

define([ //list of dependencies to load for this module
	'jquery', //first arguement $
	'lodash',//second arguement _
	], function($, _){

	/**
	 * Dependencies of the font module 
	 * @function
	 * @name Module Dependencies
	 * @param {Object} $ - Defines the jquery module dependency
	 * @param {Object} _ - Defines the lodash dependency
	 * @return {Functions} - Returns the inner return function
	 */

	/**
     * Module returns user's input message with the appropriate font formatting added
     * @function
     * @name ReturnFunction
     * @param {Array} words - the space delimited array of words making up the input string
     * @param {Object} cmdInfo - Defines commands and arguments included in the inp string
     * @param {String} inp - The input string from the user
     * @return {Object} returnData - Returns the inp string and the words array to commands.js so that it can be added to the envelope
     */
	return function(words, cmdInfo, inp){
		var returnData = {};
		var fontAttributes = {
			isGlobal: false,
			isSelection: false,
			isBold: false,
			isItalic: false,
			isColor: false,
			isSize: false,
			color: "black",
			size: "3"
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
					fontAttributes.isSelection = true;
					targetRegex = new RegExp("\{.*?\}");
					break;
				case "&all":
					fontAttributes.isGlobal = true;
					break;
				case "&bold":
					fontAttributes.isBold = true;
					break;
				case "&italics":
					//fall through to italic case, so both are accepted
				case "&italic":
					fontAttributes.isItalic = true;
					break;
				default:
					arg = arg.replace('&', '');
					_.trim(arg);
					if(arg.match(/^[1-7]$/)){
						fontAttributes.isSize = true;
						fontAttributes.size = arg;
					}
					else if(isValidColor(arg)){
						fontAttributes.isColor = true;
						fontAttributes.color = arg;
					}
					else{
						returnData.isError = true;
						returnData.errorMsg = "&" + arg + " is not a valid argument for " + cmdInfo.cmdName + ". Type --help for help.";
						return returnData;	
					}
					break;

					//Wolfram Alpha App id: 6JXTUY-T4HRKH26ER
					//Password: cm5psl@TTT
			}
		}

		if(fontAttributes.isGlobal){
			globalFontAttributes = fontAttributes;
		}

		if(!targetRegex){
			targetRegex = new RegExp(cmdInfo.cmdName + ".*" + startWord + ".*");
		}

		targetStr = inp.match(targetRegex);

		var fontStr = addFontTags(fontAttributes, targetStr);
		inp = inp.replace(targetStr, fontStr);

		if(fontAttributes.isSelection){
			inp = removeBrackets(inp, targetStr[0]);
		}

		//Need to remove command and args from the inp string and words array
		returnData.inp = inp;	

		returnData.words = words;

		return returnData;
	};

    /**
     * @function
     * @name addFontTags
     * Function to add html font tags to a given string, according to the fontAttributes object.
     * @param {Object} fontAttributes - A javascript object containing values for font attributes.
     * @param {string} fontStr - A string (from the message) that will have font tags applied to it
     * @return {string} fontStr - Returns the fontStr with html font tags added
     */
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

    /**
     * @function
     * @name removeBrackets
     * Function to remove brackets from an inp string when the user included the &selection {selected text} argument
     * @param {string} inp - A string (from the message) that will have selection brackets removed from it
     * @param {String} targetStr - the target string which the selection brackets enclose
     * @return {string} inp - Returns the fontStr with html font tags added
     */
	function removeBrackets(inp, targetStr){
		//Need to remove brackets from selected text
		var removedBrackets = targetStr;
		removedBrackets = removedBrackets.replace(/^\{/,'');
		removedBrackets = removedBrackets.replace(/\}$/,'');
		inp = inp.replace(targetStr, removedBrackets);
		return inp;
	}
	/**
	 * @function
	 * Function to find the next valid word (that is not a function or an argument) from the words array
	 * @name nextValidWord
	 * @param {Array} words - the space delimited array of words making up the input string
	 * @param {Integer} startIndex - the index in the words array from which the next valid word will be found
	 * @return {String} nextValidWord - returns the next valid word
	*/
	function nextValidWord(words, startIndex){
		for(var i = startIndex; i < words.length; i++){
			if(!words[i].match(/^(&|-{2})/)){
				return words[i];
			}
		}
		return "";
	}

	/**
	 * @function
	 * Creates a temporay image element, tries to set the color of it, and if it fails then the argument is not a valid color.
	 * Modified function a StackOverflow post: http://stackoverflow.com/questions/6386090/validating-css-color-names
	 * @param {String} arg - the argument passed to the --font command for which color validity will be assessed
	 * @return (Bool} Returns whether the arg was a valid html color
	*/
	
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
});