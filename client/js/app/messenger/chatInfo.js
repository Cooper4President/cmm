/*
	Stores chat window related information
*/

define(['lodash'], function(_){
	return {
		log: [], //log for chat windows
		center: [], //chat windows that are in the main view
		left: [], //chat windows that are off to the left of screen
		right: [], //chat windows that are off to the right of screen
		count: 0, //total count of chat windows
		chatsPerWindow: 3, //number of chat windows for main view
		animationDuration: 250, //duration for all animations

		//gives the current default width for chat windows
		defaultWidth: function(){
			if(this.count){
				if(this.count > this.chatsPerWindow) return $(window).width()/this.chatsPerWindow;
				else return $(window).width()/this.count;
			}else return $(window).width();
		},

		//updates chat log
		updateChatLog: function(chatId, message){

			//finds receiver and updates messages
			if(message !== undefined){
				_(this.log).each(function(entry){
					if(entry.id === chatId){
						entry.messages.unshift(message);
					}
				});
			}else{
				throw message;
			}
		},

		//adds new chat log entry
		newChatLogEntry: function(chatId, rec){
			if (rec) this.log.push({id:chatId, messages:[], receivers: rec,currentMessage:-1});
			else throw rec;
		}
	};
});