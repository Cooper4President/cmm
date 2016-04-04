/*
	Misc functions
*/

define({
	//checks if two arrays are equal
	checkIfEqual: function (arr1, arr2){
		arr1.sort(); arr2.sort();
		if(arr1.length != arr2.length) return false;
		for(i=0;i<arr1.length;i++) if(arr1[i] !== arr2[i]) return false;
		return true;
	}
});
