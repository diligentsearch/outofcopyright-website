/*
	Retourne en fonction des réponses si l'oeuvre et du domaine publique ou non et dans le cas où il manquerai une réponse il retourne le noeud sur lequel il n'a pas pu calculer.
*/
function walk(idSubgraph, responses, server){
	console.log("responses");
	console.log(responses);
	var responses = JSON.parse(responses);
	var idNode = getStartNode(idSubgraph);
	idNode = idNode.id_node;
	var result;
	while(result === undefined){
		console.log(idNode);
		var node = file.subgraph[idSubgraph].nodes[idNode];
		console.log(node);
		if(node.type == 'question'){

			var listResponses = [];
			listResponses = getResponsesList(node.inputs, responses);

			if(listResponses.error !== undefined){
				var missingResponses = getMissingResponse(idSubgraph, idNode, Object.keys(responses));
				listResponses.missing_responses = missingResponses;
				return listResponses;
			}

			if(node.formula !== undefined && node.formula !== "" && node.formula !== null){
				idNode = getResponseFormula(node, listResponses);

				if(idNode.error !== undefined){
					return idNode;
				}
			}
			else{
				idNode = getResponseList(node, listResponses);

				if(idNode == undefined){
					var correct_responses = [];

					for (var i = node.responses.length - 1; i >= 0; i--) {
					 	correct_responses.push(node.responses[i].value);
					};

					return {"error": 2, "id": node.inputs[0], "unusual_response": listResponses[node.inputs[0]], 'correct_responses' : correct_responses};
				}
			}
		}
		else{
			result = getTraduction(file.default_language, node.text, server);
		}
	}

	return result;

}

/*
	Retourne dans l'ordre les valeurs des réponses possible sous la forme d'un tableau avec pour clé le nom de la variable et comme valeur la réponse donnée.
*/
function getResponsesList(inputs, responses){
	var result = [];
	for(var i = 0; i < inputs.length; i++) {
		if((eval("responses."+inputs[i])) !== undefined){
			result[inputs[i]] = (eval("responses."+inputs[i]));
		}
		else{
			return {"error": 1, "waiting_response": inputs[i]};
		}
	}

	return result;
}

/*
	Permet la récupération du prochain noeud en fonction de la réponse donnée
*/
function getResponseFormula(node, listResponses){
	var formula = node.formula;

	var d = new Date();
	var NOW = d.getFullYear();
	formula.replace('NOW', NOW);

	//remplacement des variables static
	for(var i = 0; i < file.datapoints.length; i++) {
		if(file.datapoints[i].type == 'static'){
			var variable = file.datapoints[i].id;
			var value = file.datapoints[i].set;
			formula = formula.replace(variable, value);
		}
		
	}

	//remplacement des variables numeric
	for(var i = 0; i < node.inputs.length; i++) {
		var variable = node.inputs[i];
		var value = listResponses[variable];
		if(isNaN(value)){
			return {"error": 3, "response_not_a_number": variable};
		}
		formula = formula.replace(variable, value);
	}
	var result = eval(formula);

	return getResponse(node.responses, result);
}
/*
	Permet de récupérer le prochain noeud en fonction de la réponse donnée pour la liste.
*/
function getResponseList(node, listResponses){
	var variableList = node.inputs[0];
	console.log()
	return getResponse(node.responses, listResponses[variableList]);
}

/*
	Récupération des réponse manquante dans les noeuds en dessous de celui donné
*/
function getMissingResponse(subgraph, idNode, responses){
	var listNodes = getSubNode(subgraph, idNode);
	console.log(listNodes);
	console.log(responses);
	var responsesObligatoire = [];
	var missingResponses = [];
	for(var i = 0; i < listNodes.length; i++){
		var inputs = file.subgraph[subgraph].nodes[listNodes[i]].inputs
		if(inputs !== undefined){
			for(var j = 0; j < inputs.length; j++){
				if(responsesObligatoire.indexOf(inputs[j]) == -1){
					responsesObligatoire.push(inputs[j]);
				}
			}
		}
	}
	for(var i = 0; i < responsesObligatoire.length; i++){
		if(responses.indexOf(responsesObligatoire[i]) == -1){
			missingResponses.push(responsesObligatoire[i]);
		}
	}
	
	return missingResponses;

}
