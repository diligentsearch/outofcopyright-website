/*
	Retourne en fonction des réponses si l'oeuvre et du domaine publique ou non et dans le cas où il manquerai une réponse il retourne le noeud sur lequel il n'a pas pu calculer.
*/
function walk(idSubgraph, responses){
	var responses = JSON.parse(responses);
	var idNode = getStartNode(idSubgraph);
	idNode = idNode.id_node;
	var result;
	while(result === undefined){

		var node = file.subgraph[idSubgraph].nodes[idNode];

		if(node.type == 'question'){

			var listResponses = [];
			listResponses = getResponsesList(node.inputs, responses);

			if(listResponses.error !== undefined){
				return listResponses;
			}

			if(node.formula !== undefined){
				idNode = getResponseFormula(node, listResponses);
			}
			else{
				idNode = getResponseList(node, listResponses);
			}
		}
		else{
			result = node.outofcopyright;
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

	for(var i = 0; i < node.inputs.length; i++) {
		var variable = node.inputs[i];
		var value = listResponses[variable];
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

	return getResponse(node.responses, listResponses[variableList]);
}

