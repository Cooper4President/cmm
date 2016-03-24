define(['jquery'], function($){
	return function (id){
		var isDrag = false;
		var dist, startLeft;
		var call = false;
		$('#'+id).find('.chat-head').mousedown(function (event){
			if(call) call = false;
			if(!call) call = true;
			var elm = $('#'+id);
			isDrag = true;
			dist = event.pageX - parseInt(elm.css('left'));
			startLeft = parseInt(elm.css('left'));
		});
		$('body').mousemove(function (event){
			if(isDrag){
				console.log(id);
				var elm = $('#'+id);
				var margin = event.pageX - dist;
				elm.css('left', margin).css('z-index', 1);
				var rightBound, leftBound;
				if(elm.next().length > 0) rightBound = parseInt(elm.next().css('left'));
				if(elm.prev().length > 0) leftBound = parseInt(elm.prev().css('left')) + elm.prev().width();
				if(event.pageX < leftBound){
					if(!(event.pageX > startLeft + elm.prev().width())){
						var tempLeft = parseInt(elm.prev().css('left'));
						//var diff = Math.abs(elm.width() - elm.next().width());
						elm.prev().css('left', tempLeft + elm.width());
						startLeft = startLeft - elm.prev().width();
						elm.after(elm.prev());
					}
				}
				if(event.pageX > rightBound){
					if(!(event.pageX < startLeft + elm.next().width())){
						var tempLeft = parseInt(elm.next().css('left'));
						var diff = elm.width() - elm.next().width();
						elm.next().css('left', startLeft);
						startLeft = startLeft + elm.next().width();
						elm.before(elm.next());
					}
				}
			}

		}).mouseup(function (event){
			if(isDrag){
				var elm = $('#'+id);
				isDrag = false;
				var lft;
				if(elm.prev().length > 0) lft = parseInt(elm.prev().css('left')) + elm.prev().width();
				else lft = 0;
				elm.css('left', lft).css('z-index', 0);
			}
		});
	}
});