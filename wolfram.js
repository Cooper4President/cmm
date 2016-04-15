/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message', './chatSockets'], function($, message, chatSockets){
	function append(chatId, result){
		$("#"+chatId).find('.container').append(message({help: data}));
	}

	return function(chatId){
		//ajax call gets help info from help.txt
		$.ajax({
			context: this,
			url: 'help.txt',
			dataType: 'text',
			success: function(result){
				chatSockets.wolframQuery(inp, function(result){	
				console.log(result);
				append(chatId, result);
			},
			error: function(data){
				console.log("Error with help");
			}
		});
	}
});	