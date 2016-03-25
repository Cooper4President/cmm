define(['jquery', 'lodash', './chatInfo'], function($, _, chatInfo){
	function append(html){
		if(chatInfo.count === 1){
			$('.messenger-container').append(html);
		}
	}
	return function(id, html){
		var elm = $('#'+id);
		if(elm.length < 4){
			scaleToAdd(elm);
		}else{
			shiftToAdd(elm);
		}
	}
});