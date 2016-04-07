/*
	Misc functions
*/

define(['jquery', 'lodash', 'messenger/chatInfo'], function($, _, chatInfo){
	return {
	//checks if two arrays are equal
		checkIfEqual: function (arr1, arr2){
			arr1.sort(); arr2.sort();
			if(arr1.length != arr2.length) return false;
			for(i=0;i<arr1.length;i++) if(arr1[i] !== arr2[i]) return false;
			return true;
		},
			//swaps two values of array
		swap: function(a, b){
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
	};
});