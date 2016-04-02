define([
	'jquery', 
	'lodash', 
	'./menuAnimations', 
	'messenger/chatInfo', 
	//'messenger/chat',
	'messenger/queueMessenger',
	'misc/misc',
	'messenger/shifter'
	], function($, _, menuAnimations, chatInfo, queueMessenger /*chat*/, misc, shifter){
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
		else return recList;
	}
	return function(){
			$(".add-messenger").on("click",function(clickEvent){
				$(this).tooltip("disable").unbind("hover").css({
					paddingLeft: 10
		    	});
				menuAnimations.showReceiver();
			});

			$(".receiver").keydown(function(e) {
			    if (e.keyCode == 13) {
			    	e.preventDefault();
			    	//pulls receiver value and tests if valid
			    	var rec = $('.receiver').val();
					var noErr = queueMessenger(parseReceiver(rec)); //note: focus diverts to new chat
					if(noErr) menuAnimations.hideReceiver();
					if(chatInfo.left.length > 0) shifter.showRight();
					if(chatInfo.right.length > 0) shifter.showLeft();

			    }
			    //esc out of receiver window
			    else if(e.keyCode == 27){
			    	e.preventDefault();
			    	menuAnimations.hideReceiver();
			    }
		 	}).autogrow();
		}
});
