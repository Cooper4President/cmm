define(['lodash'], function(_){
	return {
		log: [],
		center: [],
		left: [],
		right: [],
		count: 0,
		chatsPerWindow: 4,
		defaultWidth: function(){
			if(this.count){
				if(this.count > this.chatsPerWindow) return $(window).width()/this.chatsPerWindow;
				else return $(window).width()/this.count;
			}else return $(window).width();
		},

		//updates chatlog, adds new entry if receiver not found
		updateChatLog: function(chatId, mess){

			//finds receiver and updates messages
			var found = false;
			var retVar;
			_(this.log).each(function(entry){
				if(entry.id === chatId){
					found = true;
					if(mess !== undefined) entry.messages.unshift(mess);
					retVar = entry;
				}
			});

			//if not found make a new entry
			if(!found){
				if(mess !== undefined) this.log.push({id:chatId, messages:[mess], currentMessage:-1});
				else this.log.push({id:chatId, messages:[], currentMessage:-1});
				retVar = _.last(this.log);
			}

			return retVar;
		}

	}
});