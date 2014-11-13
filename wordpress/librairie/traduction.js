var bibliotheque = [];
var traductionData;
/*
	Récupération d'une traduction à partir de la langue et de l'id de la tracduction que l'on souhaite
*/
function getTraduction(langue, key){
	var trad;
	var result;

	if(bibliotheque[langue] == undefined){
		
	   	trad = JSON.parse(traductionData);

	   	bibliotheque[langue] = trad;
	}else
	{
		trad = bibliotheque[langue];
	}
	if(key != ""){
		result = eval("trad."+key);
	}
	
	return result;
}
