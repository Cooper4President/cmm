define(['jquery'], function($){
	return function(id){
		var isDrag = false;
		var cont;
		var elm = $('#'+id).closest('.chat-elements');
		var win = $(window).width();
		$('#'+id).next().mousedown(function(event){
			isDrag = true;
			cont = elm.width() + elm.next().width();
		});
		$('body').mousemove(function(event){
			if(isDrag){
				var left = parseInt(elm.css('left'));
				var minW = parseInt(elm.css('minWidth'));
				var width = event.pageX - left;
				if(event.pageX > left + minW && width < cont-minW){
					elm.width(width);
					elm.next().css('left', event.pageX).width(cont-width);
				}
			}
		}).mouseup(function(event){
			isDrag = false;
		});
	}
});