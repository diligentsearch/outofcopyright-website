
function datapointContruct(id, hint, type, set){
	var datapoint =  new Object();
	datapoint.id = id;
	datapoint.hint = hint;
	datapoint.type = type;
	datapoint.set = set;

	return datapoint;
}
/*
	Récupération des données de la réponse en fonction de son id
*/
function getResponseById(idResponse){
	var responses = file.datapoints;
	for(var i = 0; i < responses.length; i++) {
		if(idResponse == responses[i].id){
			return responses[i];
		}
	}
	return {"error":1, "description": "no datapoints matching"};
}

/*
	Ajouter un datapoint
*/
function addDatapoint(id, hint, question, type, set){
	
	var stringToEvaluate = 'bibliotheque["'+languageChoosen+'"].question_'+id+' = "'+question+'";';
	console.log(stringToEvaluate);
	eval(stringToEvaluate);
	var datapoint = datapointContruct(id, hint, type, set);
	file.datapoints.push(datapoint);
}

/*
	Modifier un datapoint à partir de ça position dans la table
*/
function modifyDatapoint(idTable, id, hint, question, type, set){
	var setc = null;

	var stringToEvaluate = 'bibliotheque["'+languageChoosen+'"].question_'+id+' = "'+question+'";';
	eval(stringToEvaluate);

	if(type != 'list' || ( type == 'list' &&  !datapointIsUse(id))){
		setc = set;
	}
	var datapoint = datapointContruct(id, hint, null, setc);
	datapoint.type = type;
	file.datapoints[idTable] = datapoint;
}

/*
	Suppresion d'un datapoint à partir de ça position dans la table
*/
function deleteDatapoint(idTable){
	if(!datapointIsUse(file.datapoints[idTable].id)){
		file.datapoints.splice(idTable, 1);
	}
}

/*
	Vérification si un datapoint est utilisé ou non dans le flowchart
*/
function datapointIsUse(id){
	for(var i = 0; i < file.subgraph.length; i++) {
		for(var j = 0; j < file.subgraph[i].nodes.length; j++) {
			if(jQuery.inArray(id, file.subgraph[i].nodes[j].inputs) != -1 ){
				return true;
			}
		}
	}
	return false;
}
/*
	Retourne la liste des datapoints en fonction du type souhaité
*/
function datapointsByType(type){
	var result = [];
	for(var i = 0; i < file.datapoints.length; i++) {
		if(file.datapoints[i].type == type)
		result.push(file.datapoints[i])
	}
	return result;
}
