/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message'], function($, message){

	return function(chatId, inp){
		var container = $("#"+chatId).find('.container');
		url = window.location.href;
		url = url + '/?q=' + encodeURIComponent(inp);
        
        var googleDiv = container.createElement('div');

        function loadSearchResults(){
			googleDiv.innerHTML='<object data="' + url + '" ></object>';
		}

		googleDiv.ready( (function() {
			var cx = '002463612160728276092:tk8fmbtix2g';
			var gcse = document.createElement('script');
			gcse.type = 'text/javascript';
			gcse.async = true;
			gcse.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') +
			'//cse.google.com/cse.js?cx=' + cx;
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(gcse, s);
		})(); );

		googleDiv.createElement('gsce:searchresults-only');
	};
});