$(function(){
	$( "#saveok" ).click(function() {
  		saveFormula();
  		saveList();
  		saveAlias();
  		saveResult();
  		saveQuestion();
  		draw();
  		

	});

	$( "#sendCommit" ).click(function() {
		if(nodeSelected != undefined){
			saveFormula();
  			saveList();
  			saveAlias();
  			saveResult();
  			saveQuestion();
		}
  		
  		saveTraduction(languageChoosen, $("#commitMessage").val());
  		saveFile($("#commitMessage").val());
  		$("#saveModal").hide();
  		draw();
  		$("#messageAlert").html("Save is done!");
  		$("#alertSuccess").fadeIn( "slow");
  		setTimeout(function(){$( "#alertSuccess" ).fadeOut("slow")}, 3000);
	});
	$( "#buttonSave" ).click(function() {
  		$("#saveModal").show();
	});

});

//Sauvegarde d'une formule dans le structure de donnée dans le javascript
function saveFormula(){
	if($("#formulaButton").hasClass( "buttonPropertyActive" )){
		file.subgraph[typeOfWork].nodes[idNodeSelected].formula = formulaActual;
		file.subgraph[typeOfWork].nodes[idNodeSelected].inputs = formulaInputs;
		file.subgraph[typeOfWork].nodes[idNodeSelected].type = 'question';

		if(file.subgraph[typeOfWork].nodes[idNodeSelected].responses.length == 0){
			addResponse(typeOfWork, idNodeSelected, true);
			addResponse(typeOfWork, idNodeSelected, false);
		}
	}
}

function saveList(){
	if($("#listButton").hasClass("buttonPropertyActive") && $("#datapointsList").val() != ""){
		file.subgraph[typeOfWork].nodes[idNodeSelected].formula = null;
		file.subgraph[typeOfWork].nodes[idNodeSelected].inputs = [];
		file.subgraph[typeOfWork].nodes[idNodeSelected].inputs.push($("#datapointsList").val());
		file.subgraph[typeOfWork].nodes[idNodeSelected].type = 'question';

		if(file.subgraph[typeOfWork].nodes[idNodeSelected].responses.length == 0){
			var datapoint = getResponseById($("#datapointsList").val());
			for(var i = 0; i < datapoint.set.length; i++){
				addResponse(typeOfWork, idNodeSelected, datapoint.set[i]);
			}
		}
	}
}

function saveQuestion(){
	var question = "";
	if($("#question").val() != ""){
		if(nodeSelected.text != ""){
			question = nodeSelected.text;
		}else{
			question = $("#question").val().replace(/\!/g,'');
			question = question.replace(/\?/g,'');
			question = question.replace(/ /g,'_');
			question = question.replace(/'/g,'_');
			question = question.replace(/-/g,'_');
			file.subgraph[typeOfWork].nodes[idNodeSelected].text = question;
		}
		
		var stringToEvaluate = 'bibliotheque["'+languageChoosen+'"].'+question+' = "'+$("#question").val()+'";';
		eval(stringToEvaluate);
	}
}

function saveAlias(){
	if($("#aliasButton").hasClass("buttonPropertyActive")){
		var response = file.subgraph[typeOfWork].nodes[idNodeSelected].responses[$("#aliasResponse").val()];

		if(response !== undefined && $("#aliasNode").val() != ""){

			var idNodeAlias = parseInt($("#aliasNode").val());
			idNodeAlias = file.subgraph[typeOfWork].nodes[idNodeAlias].id;

			var idNodeToRemove = file.subgraph[typeOfWork].nodes[idNodeSelected].responses[$("#aliasResponse").val()].child;
			var node = file.subgraph[typeOfWork].nodes[idNodeToRemove];

			if(node.type == null){
				deleteNode(typeOfWork, idNodeToRemove, false, $("#aliasResponse").val());
			}else{
				var parentNodes = getParentNodes(typeOfWork);
				if(parentNodes[idNodeToRemove].length == 1){
					deleteNode(typeOfWork, idNodeToRemove, false, $("#aliasResponse").val());
				}
			}

			file.subgraph[typeOfWork].nodes[idNodeSelected].responses[$("#aliasResponse").val()].child = getNodeId(idNodeAlias).id_node;
			file.subgraph[typeOfWork].nodes[idNodeSelected].responses[$("#aliasResponse").val()].alias = true;
		}
	}
	
}

function saveResult(){
	if($("#resultButton").hasClass("buttonPropertyActive")){
		resultNode(typeOfWork, idNodeSelected, $("#resultText").val());
		$("#resultText").val("");
	}
}

function saveFile(message){
	message += "\nContributed by : "+current_user.firstname+" "+current_user.lastname;
	$.post( "/node", { country: country, name: country+".json", action: 'update', file: JSON.stringify(file), message: message } );
}

function saveTraduction(langue, message){
	message += "\nContributed by : "+current_user.firstname+" "+current_user.lastname;
	bibliotheque[langue] = cleaningTranslation(bibliotheque[langue]);
	$.post( "/node", { country: country, name: langue+".json", action: 'update', file: JSON.stringify(bibliotheque[langue]), message: message } );
}