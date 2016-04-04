define(['jquery', './chatInfo'], function($, chatInfo){

	function swap(a, b){
		var ai, bi;
		_.each(chatInfo.center, function(elm, ind){
			if(elm.is(a)){
				ai = ind;
			}else if(elm.is(b)){
				bi = ind;
			}
		});

		chatInfo.center[ai] = b;
		chatInfo.center[bi] = a;
	}

	//enables sorting chat window
	return function (id){
		//checks drag
		var isDrag = false;
		var dist, startLeft;
		//drag delegate
		$('#'+id).find('.head').mousedown(function (event){
			var elm = $('#'+id);
			isDrag = true;
			dist = event.pageX - parseInt(elm.css('left'));
			startLeft = parseInt(elm.css('left'));
		});
		//sorts windows based on current window position
		$('body').mousemove(function (event){
			if(isDrag){
				var elm = $('#'+id);
				var margin = event.pageX - dist;
				elm.css('left', margin).css('z-index', 1);
				var rightBound, leftBound;
				if(elm.next().length > 0) rightBound = parseInt(elm.next().css('left'));
				if(elm.prev().length > 0) leftBound = parseInt(elm.prev().css('left')) + elm.prev().width();
				if(event.pageX < leftBound){
					if(!(event.pageX > startLeft + elm.prev().width())){
						var tempLeft = parseInt(elm.prev().css('left'));
						elm.prev().css('left', tempLeft + elm.width());
						startLeft = startLeft - elm.prev().width();
						swap(elm, elm.prev());
						elm.after(elm.prev());
					}
				}
				if(event.pageX > rightBound){
					if(!(event.pageX < startLeft + elm.next().width())){
						var tempLeft = parseInt(elm.next().css('left'));
						var diff = elm.width() - elm.next().width();
						elm.next().css('left', startLeft);
						startLeft = startLeft + elm.next().width();
						swap(elm, elm.next());
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