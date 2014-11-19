var formatArray = [];

/*
  Permet de détecter les groupes dans un graphes qui peuvent boucler.
*/
function stronglyConnectedComponents(adjList) {
  var numVertices = adjList.length;
  var index = new Array(numVertices)
  var lowValue = new Array(numVertices)
  var active = new Array(numVertices)
  var child = new Array(numVertices)
  var scc = new Array(numVertices)
  var sccLinks = new Array(numVertices)
  
  //Initialize tables
  for(var i=0; i<numVertices; ++i) {
    index[i] = -1
    lowValue[i] = 0
    active[i] = false
    child[i] = 0
    scc[i] = -1
    sccLinks[i] = []
  }

  // The strongConnect function
  var count = 0
  var components = []
  var sccAdjList = []

  function strongConnect(v) {
    // To avoid running out of stack space, this emulates the recursive behaviour of the normal algorithm, effectively using T as the call stack.
    var S = [v], T = [v]
    index[v] = lowValue[v] = count
    active[v] = true
    count += 1
    while(T.length > 0) {
      v = T[T.length-1]
      var e = adjList[v]
      if (child[v] < e.length) { // If we're not done iterating over the children, first try finishing that.
        for(var i=child[v]; i<e.length; ++i) { // Start where we left off.
          var u = e[i]
          if(index[u] < 0) {
            index[u] = lowValue[u] = count
            active[u] = true
            count += 1
            S.push(u)
            T.push(u)
            break // First recurse, then continue here (with the same child!).
            // There is a slight change to Tarjan's algorithm here.
            // Normally, after having recursed, we set lowValue like we do for an active child (although some variants of the algorithm do it slightly differently).
            // Here, we only do so if the child we recursed on is still active.
            // The reasoning is that if it is no longer active, it must have had a lowValue equal to its own index, which means that it is necessarily higher than our lowValue.
          } else if (active[u]) {
            lowValue[v] = Math.min(lowValue[v], lowValue[u])|0
          }
          if (scc[u] >= 0) {
            // Node v is not yet assigned an scc, but once it is that scc can apparently reach scc[u].
            sccLinks[v].push(scc[u])
          }
        }
        child[v] = i // Remember where we left off.
      } else { // If we're done iterating over the children, check whether we have an scc.
        if(lowValue[v] === index[v]) { // TODO: It /might/ be true that T is always a prefix of S (at this point!!!), and if so, this could be used here.
          var component = []
          var links = [], linkCount = 0
          for(var i=S.length-1; i>=0; --i) {
            var w = S[i]
            active[w] = false
            component.push(w)
            links.push(sccLinks[w])
            linkCount += sccLinks[w].length
            scc[w] = components.length
            if(w === v) {
              S.length = i
              break
            }
          }
          components.push(component)
          var allLinks = new Array(linkCount)
          for(var i=0; i<links.length; i++) {
            for(var j=0; j<links[i].length; j++) {
              allLinks[--linkCount] = links[i][j]
            }
          }
          sccAdjList.push(allLinks)
        }
        T.pop() // Now we're finished exploring this particular node (normally corresponds to the return statement)
      }
    }
  }

  //Run strong connect starting from each vertex
  for(var i=0; i<numVertices; ++i) {
    if(index[i] < 0) {
      strongConnect(i)
    }
  }
  
  // Compact sccAdjList
  var newE
  for(var i=0; i<sccAdjList.length; i++) {
    var e = sccAdjList[i]
    if (e.length === 0) continue
    e.sort(function (a,b) { return a-b; })
    newE = [e[0]]
    for(var j=1; j<e.length; j++) {
      if (e[j] !== e[j-1]) {
        newE.push(e[j])
      }
    }
    sccAdjList[i] = newE
  }  

  return {components: components, adjacencyList: sccAdjList}
}

/*
  Récupération de la liste des liens formaté comme il faut pour le moteur de vérification SCC (Strong Connected Component)
*/
function getChildFormatArray(id_subgraph, formatArray){
  
  var formatArraychild = [];
  for (var j = 0; j < file.subgraph[id_subgraph].nodes.length; j++) { 
    var node = file.subgraph[id_subgraph].nodes[j];
    formatArraychild = [];
    if(node.responses !== undefined){
      for (var i = 0; i < node.responses.length; i++) { 
        var id = node.responses[i].child;
        formatArraychild.push(id);
      }
      formatArray[j] = formatArraychild;
    }
    else{
      formatArray[j] = [];
    }
  }
}
/*
  Retourne la liste des liens formaté comme il faut pour le moteur de vérification SCC (Strong Connected Component)
*/
function formatForStronglyConnectedComponents(id_subgraph){
  formatArray = [];
  getChildFormatArray(id_subgraph, formatArray);
  return formatArray;
}
/*
  Permet de récupérer la liste des noeuds formant des boucles. Retourne true si aucun noeud ne forme de boucle
*/
function controlStrongConnected(id_subgraph){
  var result = formatForStronglyConnectedComponents(id_subgraph);
  var sccRet = stronglyConnectedComponents(result);
  var control = true;
  for (var i = 0; i < sccRet.components.length; i++) {
    if(sccRet.components[i].length > 1){
      control = sccRet.components[i];
    }
  }
  
  return control;
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

/*
  Vérification si les réponses sont bien formé
*/
function verificationResponses(listResponse){
  console.log(listResponse);
  var errors =[]
  var listInputs = Object.keys(listResponse);
  for(var i = 0; i < listInputs.length; i++){
    var response = getResponseById(listInputs[i]);
    var responseSubmit = eval("listResponse."+listInputs[i]);
    console.log(response.type);
    console.log(responseSubmit);
    if(response.type == 'numeric'){
      if(isNaN(responseSubmit)){
        errors.push(listInputs[i]);
        console.log('push');
      }
    }
  }
  console.log(errors);
  if(errors.length > 0){
    return {"error": 3, "response_not_a_number": errors};
  }else{
    console.log("test");
    return true;
  }
  

}




