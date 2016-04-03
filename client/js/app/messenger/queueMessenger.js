define([
	'jquery', 
	'lodash', 
	'./chatInfo',
	'hbs!templates/messenger',
	'./sort',
	'./resize',
	'./chatEvents',
	'misc/misc',
	'misc/people',
	'./shifter',
	'menu/menuAnimations',

	//jquery plug-ins
	'autogrow',
	'select2'
	], function($, _, chatInfo, messenger, sort, resize, chatEvents, misc, people, shifter, menuAnimations){

	//chatInfo.animationDuration for animations
	chatInfo.animationDuration;

	function scaleToAdd(html){
		$('.messenger-container').prepend(html);
		if(chatInfo.center.length > 0){
			var
				shrink = $(window).width() - html.width(),
				scale = shrink/$(window).width(),
				minW = parseInt(html.css('minWidth')),
				widths = _.map(chatInfo.center, function(n){ return n.width()*scale }),
				minCount = 0,
				diff = 0,
				lft = html.width();
			_.each(widths, function(ent, ind){
				if(ent <= minW){
					diff += minW - ent;
					widths[ind] = minW;
					minCount++;
				}
			});
			var dist = diff/(widths.length - minCount);
			if(dist){
				_.each(widths, function(ent, ind){
					if(ent !== minW) widths[ind] -= dist;
				});
			}
			_.each(chatInfo.center, function(elm, ind){
				elm.animate({
					width: widths[ind],
					left: lft
				}, chatInfo.animationDuration);
				lft += widths[ind];
			});
		}
		html.animate({left: 0}, chatInfo.animationDuration);
		chatInfo.center.unshift(html);
	}

	function shiftToAdd(html){
		html.width(_.last(chatInfo.center).width());
		_.first(chatInfo.center).before(html);
		chatInfo.right.unshift(_.last(chatInfo.center));
		_.pull(chatInfo.center, _.last(chatInfo.center));
		chatInfo.center.unshift(html);
		var shifting = _.union(chatInfo.center, chatInfo.right);
		var lft = 0;
		_.each(shifting, function(elm){
			elm.animate({
				left: lft
			},chatInfo.animationDuration);
			lft += elm.width();
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

	return function(){
		var 
			chatId = "chat-" + ++chatInfo.count,
			context = {id: chatId, friends: people},
			html = $(messenger(context)).css({
				'width': chatInfo.defaultWidth(),
				'left': -chatInfo.defaultWidth()
			});
		if(chatInfo.count > chatInfo.chatsPerWindow) shiftToAdd(html);
		else scaleToAdd(html);
		chatEvents(html);
		$('.receivers').select2({
			placeholder: "Select chat members"
		});
		if(chatInfo.left.length > 0) shifter.showRight();
		if(chatInfo.right.length > 0) shifter.showLeft();
		resize(chatId);
		html.find('.chat-head').find('input').focus();
		$('.chat-head').find('.submit').on('click', function(event){


			var rec = html.find('.receivers').val();//parseReceiver($(this).val());

			var found = false;
			try{

				_.each(chatInfo.log, function(entry){
					if(misc.checkIfEqual(rec, entry.receivers)) found = true;
				});
			}catch (err){
				alert('user name(s) invalid');
			}

			if(!found){

				menuAnimations.showButton();

				var recFormat = _.join(rec, ", ");

				html.find('.chat-head').find('.submit').remove();
				html.find('.chat-head').find('.select2').remove();
				html.find('.chat-head').find('.receivers').remove();
				html.find('.chat-head').append("<div class='chat-title'>"+ recFormat +"</div>");

				//html.find('.receivers').replaceWith("<div class='chat-title'>"+ recFormat +"</div>");

				chatInfo.updateChatLog(chatId, {recEnt: rec});



				sort(chatId);
				//focus on new chat window
				html.find('.chat-head').find('input').focus().autogrow();				
			}else{
				alert('user name(s) invalid');
			}

		});
		return chatId;
	}
});