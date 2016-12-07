/*
	Returns, based on answers, if the work and in the public domain or not, provides a 'failed' response if it was unable to calculate a result.
*/
function walk(idSubgraph, responses, server, lang){

	// Retrieve responses from the call
	var responses = JSON.parse(responses);
	// Get the tree to calculate against
	var idNode = getStartNode(idSubgraph);
	idNode = idNode.id_node;
	var result;
	
	// Test if wether response is properly formatted (wether numbers are indeed numbers)
	var testError = verificationResponses(responses);

	if(testError != true){
		console.log("testError");
		console.log(testError);
		return testError;
	}

	// Use the graphs default language if this is not defined.
	if(lang == undefined){
		lang = file.default_language;
	}

	// TODO: determine if the while loop is necessary
	while(result === undefined){

		var node = file.subgraph[idSubgraph].nodes[idNode];

		// Process question
		if(node.type == 'question'){

			// get all responses from the POST request
			var listResponses = [];
			listResponses = getResponsesList(node.inputs, responses);

			if(listResponses.error !== undefined){
				listResponses.question = getTraduction(lang, listResponses.waiting_response, server);
				// process a type of node that is NOT a formula
				if(getType(idSubgraph, idNode) != 'formula'){
					var correct_responses = [];
					for (var i = node.responses.length - 1; i >= 0; i--) {
						correct_responses.push(getTraduction(lang, node.responses[i].value, server));
					};
				}else{
					var correct_responses = 'Numeric value';
				}
				
				listResponses.correct_responses = correct_responses;
				var missingResponses = getMissingResponse(idSubgraph, idNode, Object.keys(responses));
				listResponses.all_possible_responses = missingResponses;
				return listResponses;
			}
			
			// If there is a formula defined
			if(node.formula !== undefined && node.formula !== "" && node.formula !== null){
				idNode = getResponseFormula(node, listResponses);

				if(idNode.error !== undefined){
					return idNode;
				}
			} 
			else{
				// TODO: Is this function necessary? It is not used anywhere else
				idNode = getResponseList(node, listResponses);
				
				// No node can be found based on the responses
				if(idNode == undefined){
					var correct_responses = [];

					for (var i = node.responses.length - 1; i >= 0; i--) {
					 	correct_responses.push(getTraduction(lang, node.responses[i].value, server));
					};

					return {"error": 2, "id": node.inputs[0], "unusual_response": listResponses[node.inputs[0]], 'correct_responses' : correct_responses};
				}
			}
		}
		
		// We have reached a result node, return the result.
		else{
			result = getTraduction(lang, node.text, server);
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
	Allows retrieval of the next node as a function of the response
*/
function getResponseFormula(node, listResponses){
	var formula = node.formula;

	// GET the current value for the static NOW
	var d = new Date();
	var NOW = d.getFullYear();
	formula.replace('NOW', NOW);

	//remplacement des variables static
	for(var i = 0; i < file.datapoints.length; i++) {
		if(file.datapoints[i].type == 'static'){
			var variable = file.datapoints[i].id;
			var value = file.datapoints[i].set;
			formula = replaceFormula(formula, variable, value);
		}
		
	}

	// Replace the values from the corresponding list of value
	for(var i = 0; i < node.inputs.length; i++) {
		var variable = node.inputs[i];
		var value = listResponses[variable];
		// Return an error if the value is not a number
		if(isNaN(value)){
			return {"error": 3, "response_not_a_number": variable};
		}
		formula = replaceFormula(formula, variable, value);
	}
	
	// evaluate the formula to a true or false
	var result = eval(formula);
	
	// If result is not a boolean
	if(!typeof(result) === "boolean"){
	  return {"error": 3, "result_not_a_boolean": formula};
	}
	return getResponse(node.responses, result);
}

/*
	retrieve the next node based on the response to the list.
	TODO determine if this function is necessary 
*/
function getResponseList(node, listResponses){
	var variableList = node.inputs[0];

	return getResponse(node.responses, listResponses[variableList]);
}

function replaceFormula(formula, variable, value){
	var formulaSplit = formula.split(" ");
	var result = "";
	for(var i = 0; i < formulaSplit.length; i++) {
		if(formulaSplit[i] == variable){
			formulaSplit[i] = value;
		}
		result += formulaSplit[i]+" ";
	}

	return result;
}


