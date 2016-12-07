// 
// Simple string utility file
// 

function capitaliseFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatString(string){
	var str = string.replace(/\!/g,'');
	str = str.replace(/\?/g,'');
	str = str.replace(/ /g,'_');
	str = str.replace(/'/g,'_');
	str = str.replace(/-/g,'_');
	str = str.replace(/,/g,'_');
	str = str.replace(/\//g,'_');
	str = str.replace(/\\/g,'_');
	str = str.replace(/\\/g,'_');
	str = str.replace(/\(/g,'_');
	str = str.replace(/\)/g,'_');
	str = str.replace(/"/g,'_');
	return str;
}

function formatStringInput(string){
	var str = string.replace(/"/g,'\\"');
	return str;
}