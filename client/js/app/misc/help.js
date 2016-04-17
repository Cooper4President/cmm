/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message'], function($, message){
	function append(chatId,data){
		$("#"+chatId).find('.container').append(message({help: data}));
	}

	return function(chatId){
		//ajax call gets help info from help.txt
		$.ajax({
			context: this,
			url: 'help.txt',
			dataType: 'text',
			success: function(data){
				console.log('sent data');
				data = data.replace(/\n/g, '<br />');
				append(chatId, data);
			},
			error: function(data){
				console.log("Error with help");
			}
		});
	};
});
