define(['jquery', 'lodash', './chat'], function($, _, chat){
	return{
		downArrowHandler: function(chatId){
			_(chatLog).each(function(entry){
				if(entry.id === chatId){
					var cmd = $("#"+entry.id).find('.cmd');
					var index = entry.currentMessage;
		//handles down arrow functionality
					if(index > -1){
						if(index === 0) cmd.val(saveCmd);
						else cmd.val(entry.messages[index-1]);
						entry.currentMessage--;
					}
					return;
				}
			});
		},

		//handles up arrow functionality
		upArrowHandler: function(chatId){
			_(chatLog).each(function(entry){
				if(entry.id === chatId){
					var cmd = $("#"+entry.id).find('.cmd');
					var index = entry.currentMessage;
					if(index < entry.messages.length-1){
						if(index === -1) saveCmd = cmd.val();
						cmd.val(entry.messages[index+1]);
						entry.currentMessage++;
					}
					return;
				}
			}); 
		},
		//handles enter key functionality
		enterKeyHandler: function(chatId){
			submit(chatId);
			_(chatLog).each(function(entry){
				if(entry.id === chatId) {
					entry.currentMessage = -1;
					return;
				}
			});
		},

		//initializes the resize event
		initResizableChat: function(chatId){
			//fixes width bug
			refreshChats();

			//initializes resizable chat
			var container;
			$("#"+chatId).resizable({
				handles: 'e',
				minWidth: 250,
				start: function(event, ui){
					container = ui.element.width() + ui.element.next().width();
				},
				resize: function(event, ui){
					ui.element.next().width(container - ui.element.width());
				}
			});
		},

			//checks if chat box is overflowed
		checkScrollbar: function(chatId){
			var container = $("#"+chatId).find('.chat-container');
			var elt, hasOverflow = (elt = container).innerWidth() > elt[0].scrollWidth;
			if(hasOverflow) container.scrollTop(container[0].scrollHeight);
		}
	}
});	
	