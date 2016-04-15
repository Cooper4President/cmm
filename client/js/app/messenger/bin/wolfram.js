/*
	Prompts help info for user
*/

define(['jquery', 'hbs!templates/message', '../chatSockets'], function($, message, chatSockets){
	function append(chatId, answer){
		$("#"+chatId).find('.container').append(message({wolfram: answer}));
	}

	return function(chatId, inp){
		//ajax call gets help info from help.txt
		$.ajax({
			context: this,
			dataType: 'text',
			success: chatSockets.wolframQuery(inp, function(result){
				console.log(result);
				append(chatId, result[1].subpods[0].text);
			}),
			error: function(result){
				console.log("Error with wolfram");
			}
		});
	}
});	