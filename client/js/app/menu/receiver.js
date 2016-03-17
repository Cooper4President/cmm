define([
	'jquery', 
	'lodash', 
	'./menu-events', 
	'messenger/chat-info', 
	'messenger/chat',
	'misc/misc'
], function($, _, menuEvent, chatInfo, chat, misc){
	//parses raw text of receiver field
	function parseReceiver(recRaw){
		if(recRaw === "") return null;
		var recList = _.map(_.split(recRaw, ","), function(n){return _.trim(n)});
		var found = false
		_(recList).each(function(entry){
			if(_.includes(entry, " ") || _.includes(entry, "\n"))found = true;
			if(entry === "") found = true;
		});
		_(chatInfo.log).each(function(entry){
			var rec = $("#"+entry.id).data().receivers;
			if(misc.checkIfEqual(rec, recList)) found = true;
		});

		if(found) return null;
		else return recList.sort();
	}
	return{
		initReceiver: function(){
			$(".receiver").keydown(function(e) {
			    if (e.keyCode == 13) {
			    	e.preventDefault();
			    	//pulls receiver value and tests if valid
			    	chat.refreshChats();
			    	var rec = $('.receiver').val();
					var noErr = chat.appendMessenger(parseReceiver(rec)); //note: focus diverts to new chat
					if(noErr) menuEvent.hideReceiverField();
			    }
			    //esc out of receiver window
			    else if(e.keyCode == 27){
			    	e.preventDefault();
			    	menuEvent.hideReceiverField();
			    }
		 	}).autogrow();
		}
	}
});
