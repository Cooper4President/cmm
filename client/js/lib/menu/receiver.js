define(['jquery', 'lodash', './menu-events', 'messenger/chat'], function($, _, menuEvent, chat){
	//parses raw text of receiver field
	function parseReceiver(recRaw){
		if(recRaw === "") return null;
		var recList = _.map(_.split(recRaw, ","), function(n){return _.trim(n)});
		var found = false
		_(recList).each(function(entry){
			if(_.includes(entry, " ") || _.includes(entry, "\n"))found = true;
			if(entry === "") found = true;
		});
		_(chatLog).each(function(entry){
			var rec = $("#"+entry.id).data().receivers;
			if(checkIfEqual(rec, recList)) found = true;
		});

		if(found) return null;
		else return recList.sort();
	}
	return{
		//hides receiver field
		hideReceiverField: function(){
			//give event delegate back to add messenger button
		 	menuEvent.hoverEvent("add-messenger");

			$(".receiver").css({
				borderColor: "transparent",
				width: 0,
				height: 36,
				zIndex: 0,
				borderWidth: 0
			}).val("");
		},

		//shows receiver field
		showReceiverField: function(){
		 	$(".receiver").css({
		 		width: 195,
		 		borderColor: "black",
		 		height: 36,
		 		zIndex: 1,
		 		borderWidth: 3
		 	}).focus();
		},
		initReceiver: function(){
			$(".receiver").keydown(function(e) {
			    if (e.keyCode == 13) {
			    	e.preventDefault();
			    	//pulls receiver value and tests if valid
			    	var rec = $('.receiver').val();
					var noErr = chat.appendMessenger(parseReceiver(rec)); //note: focus diverts to new chat
					if(noErr) this.hideReceiverField();
			    }
			    //esc out of receiver window
			    else if(e.keyCode == 27){
			    	e.preventDefault();
			    	this.hideReceiverField();
			    }
		 	}).autogrow();
		}
	}
});


