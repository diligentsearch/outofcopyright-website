// 
// String utility function
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


// 
// URL utility function
// 
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value.replace("#", "");;
	});
	return vars;
}