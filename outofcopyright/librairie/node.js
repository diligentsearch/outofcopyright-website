
/*
	Retourne un objet node
*/
function node_construct(type, text, formula, inputs, start, response){
	var node =  new Object();
	node.type = type;
	node.text = text;
	node.formula = formula;
	node.inputs = inputs;
	node.start = start;
	node.responses = response;

	return node;
}
/*
	Ajout d'un nouveau noeud dans un sous-graphe définie.
*/
function addNode(idSubgraph, type, text, formula, inputs, start, response){
	var node =  node_construct(type, text, formula, inputs, start, response);
	node.id = newNodeId();
	file.subgraph[idSubgraph].nodes.push(node);
}

/*
	Modifier un noeud particulier
*/
function modifyNode(idSubgraph, id_node, type, text, formula, inputs, start, response){

	var node = node_construct(type, text, formula, inputs, start, response);
	node.id = id_node;
	file.subgraph[idSubgraph].nodes[id_node] = node;

}

/*
	Suppression d'un noeud et de tout ceux ayant un lien unique avec celui-ci.
*/
function deleteNode(id_subgraph, id_node, reconstructChild){
	id_node = parseInt(id_node);
	var listToDelete = deleteNodeRec(id_subgraph, id_node, []);
	var nodes = file.subgraph[id_subgraph].nodes
	var idLinkTable = idLink(id_subgraph);
	
	for (var j = 0; j < nodes.length; j++) {
		var responses = undefined;
		if(file.subgraph[id_subgraph].nodes[j].responses !== undefined){
			responses = file.subgraph[id_subgraph].nodes[j].responses.slice(0);
		}
		if(responses !== undefined){
			for(var k = 0; k < responses.length; k++){
				for (var i = 0; i < listToDelete.length; i++) {
					if(responses[k].child == getNodeId(listToDelete[i]).id_node){
						if(responses[k].alias == true){
							file.subgraph[id_subgraph].nodes[j].responses.splice(k, 1);
						}else{
							if(file.subgraph[id_subgraph].nodes[j].responses[k] !== undefined){
								file.subgraph[id_subgraph].nodes[j].responses[k].child = null;
							}
						}
					}
				}
			}
		}
	}
	for (var i = 0; i < listToDelete.length; i++) {
		if(nodes[getNodeId(listToDelete[i]).id_node].start === true){
			file.subgraph[id_subgraph].nodes[id_node].text = "";
			file.subgraph[id_subgraph].nodes[id_node].responses = [];
		}else{
			file.subgraph[id_subgraph].nodes.splice(getNodeId(listToDelete[i]).id_node, 1);
		}
	}
	//Reconstruit les liens des enfants qui ont été décallé.
	reconstructLink(id_subgraph, idLinkTable, reconstructChild);

	

	return true;
}

/*
	Liste les noeud à supprimmer et tout ceux ayant un lien unique avec celui-ci de façon récurrente
*/
function deleteNodeRec(id_subgraph, id_node, listToDelete){
	var directNodes = getParentNodes(id_subgraph);
	listToDelete.push(file.subgraph[id_subgraph].nodes[id_node].id);
	var responses = file.subgraph[id_subgraph].nodes[id_node].responses;

	if(responses !== undefined){
		for (var i = 0; i < responses.length; i++) { 
			if(unilink(listToDelete, directNodes[responses[i].child])){
				deleteNodeRec(id_subgraph, responses[i].child, listToDelete)
			}
		}
	}

	return listToDelete;

}
/*
	Permet de déterminer si un noeud a un lien unique.
*/
function unilink(listIdNodes, parentNodes){
	if(parentNodes !== undefined){
		var countMatching = 0;
		for(var i = 0; i < listIdNodes.length; i++){
			if(jQuery.inArray( getNodeId(listIdNodes[i]).id_node, parentNodes ) !== -1){
				countMatching++;
			}
		}
		return countMatching == parentNodes.length;
	}else
	{
		return false;
	}
	
}

/*
	Suppression des liens vers un noeud qui a été supprimé
*/
function deleteResponses(id_subgraph, id_node, parentNodes){
	//Suppression des réponses de la node en question qui va être effacé.
	file.subgraph[id_subgraph].nodes[id_node].responses=[];

	if(parentNodes !== undefined){
		for (var i = 0; i < parentNodes.length; i++) { 
			var responses = file.subgraph[id_subgraph].nodes[parentNodes[i]].responses;
			for (var j = 0; j < responses.length; j++) { 
				if(responses[j].child == id_node){
					if(responses[j].alias == true){
						file.subgraph[id_subgraph].nodes[parentNodes[i]].responses.splice(j, 1);
					}
					else{
						file.subgraph[id_subgraph].nodes[parentNodes[i]].responses[j].child = null;
					}
				}
			}
		}
	}
	return true;
}

/*
	Obtenir une nouvelle id pour un nouveau noeud.
*/
function newNodeId(){
	var newId = 1;

	for (i = 0; i < file.subgraph.length; i++) { 
    	for(j = 0; j < file.subgraph[i].nodes.length; j++){
    		if(newId <= file.subgraph[i].nodes[j].id){
    			newId = file.subgraph[i].nodes[j].id + 1;
    		}
    	}
	}
	return newId;
}

/*
	Obtenir l'id du sous-graphe à partir de l'id du noeud
*/
function getNodeId(id_node){
	for (i = 0; i < file.subgraph.length; i++) { 
    	for(j = 0; j < file.subgraph[i].nodes.length; j++){
    		if(id_node == file.subgraph[i].nodes[j].id){
    			return {'id_subgraph': i, 'id_node' : j};
    		}
    	}
	}
}

/*
	Obtenir le noeud start
*/
function getStartNode(id_subgraph){
	for(j = 0; j < file.subgraph[id_subgraph].nodes.length; j++){
		if(true === file.subgraph[id_subgraph].nodes[j].start){
			return {'id_node' : j};
		}
	}

}
/*
	Permet de parcourir le diagramme et de vérifier ça consistence.
*/
function controlRec(id_subgraph, id_node){
	var node = file.subgraph[id_subgraph].nodes[id_node];
	if(node.type != 'final'){
		if(node.responses.length == 0){
			//error 2 : Il n'y a aucun enfant alors que ce n'est pas un noeud final.
			return {"error": 2, "id_subgraph": id_subgraph, "id_node": id_node};
		}
		for (var i = 0; i < node.responses.length; i++) { 
			var id = node.responses[i].child;
			if(id !== undefined){
				var result = controlRec(id_subgraph, id);
			}
			else
			{
				//error 1 : le noeud citer comme child n'existe pas
				return {"error": 1, "id_subgraph": id_subgraph, "id_node": id_node};
			}
			
			if(result != 'ok' && result != undefined){
				return result;
			}
		}
	}
	else{
		return 'ok';
	}
}


/*
	Controle l'intégrité du diagramme.
*/
function control(id_subgraph){

	var firstNode = getStartNode(id_subgraph);
	var result = controlRec(id_subgraph, firstNode.id_node);

	if(result === undefined){
		result = 'ok';
	}
	return result;
}

/*
	Retourne la liste des noeuds parents direct pour tout les noeuds du diagramme
*/
function getParentNodes(id_subgraph){
	var result = [];
	var nodes = file.subgraph[id_subgraph].nodes;
	for (var i = 0; i < nodes.length; i++) { 
		var node = file.subgraph[id_subgraph].nodes[i];
		if(node.responses !== undefined){
			for(var j = 0; j < node.responses.length; j++) { 
				var idNode = node.responses[j].child;
				if(idNode !== null){
					if(result[idNode] !== undefined){
						result[idNode].push(i);
					}
					else
					{
						result[idNode] = [i];
					}
				}
				
			}
		}
	}
	return result;
}

/*
	Retourne la liste des parents direct et indirecte d'un noeud en particulier
*/
function getAllParentNodesByIdNodes(id_subgraph, id_node){

	var allParentNodes = getParentNodes(id_subgraph);
	var result = getAllParentNodesByIdNodesRec(id_subgraph, allParentNodes, id_node);
	return result;
}

/*
	Récupération de tout les parents d'une node particulière.
*/
function getAllParentNodesByIdNodesRec(id_subgraph, allParentNodes, id_node){

	var resultNodes = [];
	var result = [];

	var node = file.subgraph[id_subgraph].nodes[id_node];
	resultNodes = allParentNodes[id_node];
	if(!node.start){
		for (var i = 0; i < resultNodes.length; i++) { 
			if( jQuery.inArray( resultNodes[i], result ) == -1 ){
				result.push(resultNodes[i]);
			}
			

			var listNode = getAllParentNodesByIdNodesRec(id_subgraph, allParentNodes, resultNodes[i]);

			for (var j = 0; j < listNode.length; j++) { 
				if( jQuery.inArray( listNode[j], result ) == -1 ){
					result.push(listNode[j]);
				}
			}

		}
	}
	return result;
}

/*
	Récupération de l'enfant à une réponse spécifique.
*/
function getResponse(responses, response){
	for (var i = 0; i < responses.length; i++) { 
		if(responses[i].value == response){
			return responses[i].child;
		}
	}
}

/*
	Récupération des informations sur un noeud
*/
function getChild(subgraph, idNode){
	return file.subgraph[subgraph].nodes[idNode];
}

/*
	Ajout d'une nouvelle réponse
*/
function addResponse(subgraph, idNode, response){
	file.subgraph[subgraph].nodes[idNode].responses.push({
                            								"value":response, 
                            								"child": file.subgraph[subgraph].nodes.length
                        								});
	addNode(subgraph, null, "", null, [], false, [], null);

	return file.subgraph[subgraph].nodes[idNode].responses.length - 1;

}

/*
	modification d'une réponse
*/
function modificationResponse(subgraph, idNode, idResponse){

	file.subgraph[subgraph].nodes[idNode].responses[idResponse].child = file.subgraph[subgraph].nodes.length
	addNode(subgraph, null, "", null, [], false, [], null);

}

/*
	Récupération des inputs nécessaire pour tout le diagramme d'un sous-graphe donné
*/
function getInputs(id_subgraph){
	var result = [];
	for(var i = 0; i < file.subgraph[id_subgraph].nodes.length; i++){
		if(file.subgraph[id_subgraph].nodes[i].inputs != undefined){
			for(var j = 0; j < file.subgraph[id_subgraph].nodes[i].inputs.length; j++){
				var input = file.subgraph[id_subgraph].nodes[i].inputs[j];
				if( result.indexOf( input, result ) == -1 ){
						result.push(input);
				}
			}
		}
		
	}
	return result;
}

/*
	Récupération du type de noeud, c'est à dire : fomula, list ou final
*/
function getType(subgraph, idNode){
	var node = file.subgraph[subgraph].nodes[idNode];
	if(node.formula !== undefined && node.formula !== "" && node.formula !== null){
		return 'formula';
	}else{
		if(node.type == 'final'){
			return 'final';
		}else{
			if(node.inputs.length > 0){
				return 'list';
			}else{
				return 'formula';
			}
			
		}
	}
}

/*
	Récupération d'un tableau faisant le lien entre l'id unique de chaque noeud et son id dans le tableau
*/
function idLink(subgraph){
	var result = [];
	if(file.subgraph[subgraph] !== undefined){
		for(var i = 0; i < file.subgraph[subgraph].nodes.length; i++){
			result[i] = file.subgraph[subgraph].nodes[i].id;
		}
	}
	return result;
}

/*
	Reconstruction des liens après une suppression d'une liste de noeud
*/
function reconstructLink(subgraph, idLinkTable, reconstructChild){
	
	for(var i = 0; i < file.subgraph[subgraph].nodes.length; i++){
		if(file.subgraph[subgraph].nodes[i].responses !== undefined){
			for(var j = 0; j < file.subgraph[subgraph].nodes[i].responses.length; j++){
				var child = file.subgraph[subgraph].nodes[i].responses[j].child;
				if(child != null){
					var node = getNodeId(idLinkTable[child]);
					if(node !== undefined){
						file.subgraph[subgraph].nodes[i].responses[j].child = node.id_node;
					}
				}else{
					if(reconstructChild){
						modificationResponse(subgraph, i, j);
					}
					
				}
				
			}
		}
	}
}

/*
	Change un noeud en noeud résultat
*/
function resultNode(subgraph, idNode, text){
	var newID = newNodeId();
	file.subgraph[subgraph].nodes[idNode] = {   
                    "id": newID,
                    "type":"final", 
                    "text":"LBL_"+newID
                }
    var stringToEvaluate = 'bibliotheque["'+languageChoosen+'"].LBL_'+newID+' = "'+text+'";';
	eval(stringToEvaluate);

}

/*
	Vérifie si la node à des réponses
*/

function haveResponses(responses){
	if(responses != undefined){
		if(responses.length > 0){
			return true;
		}
		else{
			return false;
		}
	}else{
		return false;
	}
}

/*
	Récupération de la liste des noeuds accessible depuis un noeud particulier
*/
function getSubNode(subgraph, idNode, listNode){
	
	if(listNode == undefined){
		listNode = [];
	}

	if(file.subgraph[subgraph].nodes[idNode].responses !== undefined){
		for(var i = 0; i < file.subgraph[subgraph].nodes[idNode].responses.length; i++){
			var response = file.subgraph[subgraph].nodes[idNode].responses[i];
			if(listNode.indexOf(response.child) == -1){
				listNode.push(response.child);
			}
			listNode = getSubNode(subgraph, response.child, listNode);
		}
	}
	
	return listNode;

}

