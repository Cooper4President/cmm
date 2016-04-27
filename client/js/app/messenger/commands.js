/** @memberOf jQuery */

/** @module commands */

/**
 * @fileOverview commands.js parses commands out of a user input message, executes them, and returns an envelope with the resulting message data.
 * @author Morgan Allen <moal8410@colorado.edu>
 */

/**
 * Dependencies of the commands module 
 * @function
 * @name Module Dependencies
 * @param {Object} $ - Defines the jquery module dependency
 * @param {Object} _ - Defines the lodash dependency
 * @param {Object} date - Defines the date dependency
 * @param {Object} help - Defines the help dependency
 * @param {Object} wolfram - Defines the wolfram dependency
 * @param {Object} font - Defines the font dependency
 * @return {Functions} - Returns the inner return function
 */
define([ //list of dependencies to load for this module
    'jquery', //first arguement $
    'lodash', //second arguement _
    'misc/date', //third aguement date
    'misc/help', //etc...
    'messenger/bin/wolfram',
    'messenger/bin/font'
], function($, _, date, help, wolfram, font) { //references to the modules in order of dependencies
    //when you return something in a module, you are simply stating what are the public functions of this module
    //this returns a function, as this is the only function that this modele requires, it can also be anything that
    //can be returned (such as an object, which most modules in this case return)

    var globalFontAttributes = {};
    var haveCallbacks = false;

    /**
     * Defines commands that can be run inside chat window
     * @function
     * @name ReturnFunction
     * @param {Integer} chatId - the id of the chat window
     * @param {String} inp - The raw user input string
     * @param {AnonymousFunction} callback - callback function once the commands have been executed and finished
     * @return {Object} envelope - Returns an envelope js object with the final message/image and other data
     */
    return function(chatId, inp, callback) {

        //this is the main object to store command data
        var envelope = {};
        var container = $("#" + chatId).find('.container');

        var haveCallbacks = false;
        var globalFontAttributes = {};

        //Strip any existing html tags that the user might have entered, to prevent malicious script injections
        inp = inp.replace(/(<([^>]+)>)/ig, "");

        //match the -- delimiter to find all commands in the input
        if (_.includes(inp, '--')) {
            //get all space seperated words
            var words = _.split(inp, ' ');
            //remove any blank entries in words created by multiple spaces
            _.pull(words, "");

            var commands = parseCommands(words);
            //Iterate through commands and arguments
            for (var i = 0; i < commands.length; i++) {
                cmdInfo = commands[i];

                //Handle each command
                switch (cmdInfo.cmdName) {
                    case "--help":
                        help(chatId);
                        break;
                    case "--date":
                        var today = date;
                        inp = inp.replace(cmdInfo.cmdName, today); //replacing date command input with date
                        words = _.replace(cmdInfo.cmdName, today);
                        break;
                    case "--time":
                        var d = new Date();
                        inp = inp.replace(cmdInfo.cmdName, d.getHours() + ":" + d.getSeconds());
                        words = _.replace(cmdInfo.cmdName, today);
                        break;
                    case "--clear":
                        container.empty();
                        break;
                    case "--font":
                        var fontInfo = font(words, cmdInfo, inp);
                        if (fontInfo.isError) {
                            callback({ error: fontInfo.errorMsg });
                        } else {
                            inp = fontInfo.inp;
                            words = fontInfo.words;
                            inp = cleanupInp(cmdInfo, inp);
                            inp = _.trim(inp);
                            words = cleanupWords(cmdInfo, words);
                        }
                        break;
                    case "--picture":
                        //url is next arguement
                        var imgUrl = words[i + 1];
                        if (imgUrl) {
                            //this is how you manually store data for the pictue
                            haveCallbacks = true;
                            var img = new Image();
                            img.src = imgUrl;
                            img.onload = function(){
                                envelope.image = {
                                    url: imgUrl,
                                    width: this.width + 'px'//Math.min(0.8 * container.width(), img.naturalWidth)
                                };
                                envelope.message = "";
                                callback(envelope);
                            };

                        } else {
                            //to write an error, simply return this error object with the error
                            callback({ error: "Error: Invalid picture url" });
                        }
                        break;
                    case "--newtab":
                        window.open('', '_blank');
                        inp = inp.replace(cmdInfo.cmdName, '');
                        break;
                    case "--search":
                        //NEED TO IMPLIMENT WITH QUOTED SEARCH STRING
                        inp = cleanupInp(cmdInfo, inp);
                        var searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(inp);
                        window.open(searchUrl, '_blank');
                        callback(null);
                        return; //might want to change if we don't want stand alone functin
                    case "--wolfram":
                        inp = cleanupInp(cmdInfo, inp);
                        inp = _.trim(inp);

                        haveCallbacks = true;
                        wolfram(inp, function(result){
                            // console.log(result);
                            var img = new Image();
                            img.src = result.image;
                            img.onload = function(){
                                envelope.image = {
                                    url: result.image,
                                    width: this.width + 'px'//Math.min(0.8 * container.width(), img.naturalWidth)
                                };
                                envelope.username = "Wolfram Alpha";
                                envelope.message = "<b>Query: </b>" + inp + ", <b>Result Text: </b>" + result.text;
                                // console.log(envelope);
                                callback(envelope);
                            };
                        });
                        break;
                    default:
                        var err = "Command " + cmdInfo.cmdName + " not found. Type --help for help";
                        callback({ error: err });
                }
            }
            inp = _.trim(inp);
        }

        if (globalFontAttributes) {
            inp = addFontTags(globalFontAttributes, inp);
        }

        if (inp !== "") {
            envelope.message = inp;
        }

        if (!haveCallbacks) callback(envelope);
    };

    /**
     * @function
     * @name parseCommands
     * Parses through commands and builds an object with all commands and args from the message
     * @param {array} words - An array of the words of the input message
     * @return {Object} commands - Returns an object with every command and its related arguments.
     */
    function parseCommands(words) {
        var commands = [];
        var cmdCount = 0;
        var cmd, arg, word;

        for (var i = 0; i < words.length; i++) {
            word = words[i];

            if (_.startsWith(word, '--')) {
                cmd = words[i];
                commands.push({ 'cmdName': cmd, 'argList': [] });
                cmdCount++;
            } else if (_.startsWith(word, '&')) {
                arg = words[i];
                if (cmdCount) {
                    commands[cmdCount - 1]['argList'].push(arg);
                }
            }
        }
        return commands;
    }
    /**
     * @function
     * @name addFontTags
     * Function to add html font tags to a given string, according to the fontAttributes object.
     * @param {Object} fontAttributes - A javascript object containing values for font attributes.
     * @param {string} fontStr - A string (from the message) that will have font tags applied to it
     * @return {string} fontStr - Returns the fontStr with html font tags added
     */
    function addFontTags(fontAttributes, fontStr) {
        if (fontAttributes.isBold) {
            fontStr = "<b>" + fontStr + "</b>";
        }

        if (fontAttributes.isItalic) {
            fontStr = "<i>" + fontStr + "</i>";
        }

        if (fontAttributes.isColor || fontAttributes.isSize) {
            var fontTag = "<font ";
            if (fontAttributes.isColor) {
                fontTag = fontTag + "color=\"" + fontAttributes.color + "\" ";
            }
            if (fontAttributes.isSize) {
                fontTag = fontTag + "size=\"" + fontAttributes.size + "\" ";
            }

            fontTag = fontTag + ">";

            fontStr = fontTag + fontStr + "</font>";
        }

        return fontStr;
    }

    /**
     * @function
     * @name cleanupInp
     * function to remove command and arguments from the message input
     * @param {Object} cmdInfo - A javascript object containing the command name and argument list
     * @param {string} inp - The raw input string entered into chat box by the user
     * @return {string} fontStr - Returns the inp with all of the commands and args removed
     */
    function cleanupInp(cmdInfo, inp) {
        inp = inp.replace(cmdInfo.cmdName, '');
        for (var i = 0; i < cmdInfo.argList.length; i++) {
            inp = inp.replace(cmdInfo.argList[i], '');
        }
        return inp;
    }

    /**
     * @function
     * @name cleanupWords
     * function to remove command and arguments from the message words array
     * @param {Object} cmdInfo - A javascript object containing the command name and argument list
     * @param {array} words - A space delimited array of the words entered by user
     * @return {string} words - Returns the words array with all of the commands and args removed
     */
    function cleanupWords(cmdInfo, words) {
        words.splice(words.indexOf(cmdInfo.cmdName), 1);
        for (var i = 0; i < cmdInfo.argList.length; i++) {
            words.splice(words.indexOf(cmdInfo.argList[i]), 1);
        }
        return words;
	}
});

