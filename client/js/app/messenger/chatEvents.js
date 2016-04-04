define([
	'jquery',
	'lodash',
	'./send',
	'./chatInfo',
	'./enqueueMessenger',
	'./sort',
	'./resize',
	'menu/menuAnimations',
	'messenger/shifter',
	'misc/misc',

	//jquery plug-ins
	'autogrow',
	'select2'


	], function($, _, send, chatInfo, enqueueMessenger, sort, resize, menuAnimations, shifter, misc){
	var saveCmd;
	//handles down arrow functionality
	function downArrowHandler(chatId){
		_(chatInfo.log).each(function(entry){
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
	}

	//handles up arrow functionality
	function upArrowHandler(chatId){
		_(chatInfo.log).each(function(entry){
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
	}
	//handles enter key functionality
	function enterKeyHandler(chatId){
		send(chatId);
		_(chatInfo.log).each(function(entry){
			if(entry.id === chatId) {
				entry.currentMessage = -1;
				return;
			}
		});
	}

	function parseReceiver(recList){
		//if(recRaw === "") return null;
		//var recList = _.map(_.split(recRaw, ","), function(n){return _.trim(n)});
		var found = false
		_(recList).each(function(entry){
			if(_.includes(entry, " ") || _.includes(entry, "\n"))found = true;
			if(entry === "") found = true;
		});
		_(chatInfo.log).each(function(entry){
			if(misc.checkIfEqual(recList, entry.receivers)) found = true;
		});

		if(found) return null;
		else return recList;
	}


	function receiverHandler(html){
		$('.head').find('.submit').on('click', function(event){


			var chatId = html.attr('id')
			var rec = html.find('.receivers').val();//parseReceiver($(this).val());

			var found = false;

			_.each(chatInfo.log, function(entry){
				if(misc.checkIfEqual(rec, entry.receivers)) found = true;
			});

			if(!found && rec !== null){

				menuAnimations.showButton();

				var recFormat = _.join(rec, ", ");

				html.find('.head').find('.submit').remove();
				html.find('.head').find('.select2').remove();
				html.find('.head').find('.receivers').remove();
				html.find('.head').append("<div class='title'>"+ recFormat +"</div>");

				//html.find('.receivers').replaceWith("<div class='title'>"+ recFormat +"</div>");

				chatInfo.updateChatLog(chatId, {recEnt: rec});



				sort(chatId);
				//focus on new chat window
				html.find('.head').find('input').focus().autogrow();
				keyDownHandler(html);
			}else{
				return false;
				alert('user name(s) invalid');
			}

		});

	}

	function keyDownHandler(html){
	    html.find('.cmd').prop('disabled', false).focus().keydown(function(event) {
			var chatId = $(this).closest('.chat').attr('id');
			//enter key submit
		    if (event.keyCode === 13) {
				event.preventDefault();
				enterKeyHandler(chatId); 
		    }

		    //up arrow to go through chat log
		    if(event.keyCode === 38){
		    	event.preventDefault();
				upArrowHandler(chatId);
		    }

		    //down arrow to go through chat log
		    if(event.keyCode === 40){
		    	event.preventDefault();
 				downArrowHandler(chatId);
		    }
		}).autogrow();
	}


	return function(html){
		var cont = receiverHandler(html);

		$('.receivers').select2({
			placeholder: "Select chat members"
		});
		if(chatInfo.left.length > 0) shifter.showRight();
		if(chatInfo.right.length > 0) shifter.showLeft();
		resize(html.attr('id'));
		html.find('.head').find('input').focus();

		html.find(".remove-messenger").on("click",function(event){
			enqueueMessenger(html);
		});
	}
});