define(['jquery'], function($){
	return function (id){
		var isDrag = false;
		var dist;
		var lleft, lright;
		var margin;
		$('#'+id).find('.chat-head').mousedown(function (event){
			isDrag = true;
			elm = $(this).closest('.chat-elements');
			var left = parseInt(elm.css('left'));
			dist = event.pageX - left;
			margin = parseInt(elm.css('left'));
			$('body').mousemove(function(event){
				if(isDrag){
					elm.css('left', event.pageX - dist);
					if(elm.prev().length > 0) lleft = parseInt(elm.prev().css('left')) + elm.prev().width();
					if(elm.next().length > 0) lright = parseInt(elm.next().css('left'));
					if(event.pageX < lleft){
						var prev = elm.prev();
						elm.after(prev);
						prev.css('left', lleft);
					}
					if(event.pageX > lright){
						var next = elm.next();
						elm.before(next);
						next.css('left', margin);
					}
				}
			}).mouseup(function(event){
				isDrag = false;
				var left = 0;
				$('.chat-elements').each(function(index){
					$(this).css('left', left);
					left += $(this).width();
				});
			});
		});
	}
});