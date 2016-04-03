define(['lodash'], function(_){
	return {
		log: [],
		center: [],
		left: [],
		right: [],
		count: 0,
		chatsPerWindow: 3,
		animationDuration: 250,
		defaultWidth: function(){
			if(this.count){
				if(this.count > this.chatsPerWindow) return $(window).width()/this.chatsPerWindow;
				else return $(window).width()/this.count;
			}else return $(window).width();
		},

		//updates chat log, adds new entry if receiver not found
		updateChatLog: function(chatId, obj){

			//finds receiver and updates messages
			var found = false;
			var rtn;
			_(this.log).each(function(entry){
				if(entry.id === chatId){
					found = true;
					if(obj.message !== undefined) entry.messages.unshift(obj.message);
					rtn = entry;
				}
			});

			if(!found && obj.recEnt !== 0){
				if(obj.message !== undefined) this.log.push({id:chatId, messages:[obj.message], receivers: obj.recEnt,currentMessage:-1});
				else this.log.push({id:chatId, messages:[], receivers: obj.recEnt,currentMessage:-1});
				rtn = _.last(this.log);
			}

			return rtn;
		}

	}
});