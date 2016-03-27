define([
	'jquery', 
	'lodash', 
	'./chatInfo',
	'hbs!templates/messenger',
	'./sort',
	'./resize'
	], function($, _, chatInfo, messenger, sort, resize){

	function scaleToAdd(html){
		$('.messenger-container').prepend(html);
		var shrink = $(window).width() - html.width();
		var scale = shrink/$(window).width();
		if(chatInfo.center.length > 0){
			var
				minW = parseInt(html.css('minWidth')),
				widths = _.map(chatInfo.center, function(n){ return n.width()*scale }),
				minCount = 0,
				diff = 0;
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
					if(ent !== minW){
						widths[ind] -= dist;
					}
				});
			}
			var lft = html.width();
			_.each(chatInfo.center, function(elm, ind){
				elm.animate({
					width: widths[ind],
					left: lft
				});
				lft += widths[ind];
			});
			html.animate({left: 0});
			chatInfo.center.unshift(html);

		}else{
			html.animate({left: 0});
			chatInfo.center.unshift(html);
		}
		//console.log(widths);
	}

	function shiftToAdd(html){
		//todo overflow when chat count is above chats per window
	}

	return function(rec){
		if(rec){
			var 
				chatId = "chat-" + ++chatInfo.count,
				format = _.join(rec, ', '),
				context = {id: chatId, formatted: format},
				html = $(messenger(context)).css({
					'width': chatInfo.defaultWidth(),
					'left': -chatInfo.defaultWidth()
				}).data("receivers", rec);
			if(chatInfo.count > chatInfo.chatsPerWindow) shiftToAdd(html);
			else scaleToAdd(html);

			sort(chatId);
			resize(chatId);

			chatInfo.updateChatLog(chatId);

			return chatId;

		}else{
			alert('a username was invalid');
			return null;
		}
	}
});