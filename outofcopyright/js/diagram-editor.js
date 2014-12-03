var country = "";
var typeOfWork = "";
var nodeSelected;
var idNodeSelected;
var idDatapointSelected = null;
var g;
var svg ,centerG, zoomG;
var readOnly = false;
var languageChoosen = "";

$(function(){
	$("html").css("height","800px");
	$("#secondary").hide();
	$('.site-header').css("padding","0");
	$('.col-width').css("max-width","100%");
	$('.col-width').css("padding","0");
	$('#content').css("margin","0");
	//Ajuste la taille du SVG pour le graphe à la taille disponible.
	$('#drawSvg').attr('width', $('#drawZone').width());
	$('#drawSvg').attr('height', $('#drawZone').height()+500);
	

	country = getUrlVars()["country"];

	languageChoosen = getUrlVars()["language"];

	readOnlyDiagram();
	$("#countryTitle").html(country);
	
	$.post( "/node", { country: country, name: country+".json", action: 'read' } )
		.done(function( data ) {
		file = data;
		var result = idLink(2);
		$.post( "/node", { country: country, name: languageChoosen+".json", action: 'read' } )
		.done(function( dataTrad ) {
			traductionData = dataTrad;
			listTypeDatapoint();
			var missingTrad = missingTranslation(traductionData);
			if(missingTrad.length > 0){
				var strMissingTrad = "";
				for(var i = 0; i < missingTrad.length ; i++){
					var endStr = ", ";
					if(i + 1 == missingTrad.length){
						endStr = ".";
					}
					strMissingTrad += missingTrad[i]+endStr;
				}
				$("#messageAlertWarning").text("Missing translation "+strMissingTrad);
				$("#alertWarning").show();
			}
		});

		$( "#question" ).change(function() {
			file.subgraph[typeOfWork].nodes[idNodeSelected];
		});

		$( "#datapointsList" ).change(function() {
			displayResponses();
			resizeVerticaly();
		});

		$( "#typeDatapoint" ).change(function() {
			switch($( "#typeDatapoint" ).val()){
				case 'static':
							$(".valueDatapoint").show();
							$(".listValueDatapoint").hide();
							$("#question_datapoint > label").text("Name");
							$("#questionDatapoint").attr("placeholder", "Name");
						break;
				case 'list':
							$(".valueDatapoint").hide();
							$(".listValueDatapoint").show();
							$("#question_datapoint > label").text("Question");
							$("#questionDatapoint").attr("placeholder", "Question");
						break;
				case 'numeric':
				default:
							$(".valueDatapoint").hide();
							$(".listValueDatapoint").hide();
							$("#question_datapoint > label").text("Question");
							$("#qquestionDatapoint").attr("placeholder", "Question");
						break;
			}
		});

		$( "#addTypeOfWorkButton" ).click(function() {
			$("#addTypeOfWorkModal").show();
		});
		$( "#addDatapointModalButton" ).click(function() {
			writeDatapoint();
			$("#datapoint-modal-title").html("Add datapoint");
			$("#addModifyDatapoint").html("Add new datapoint");
			$("#question_datapoint").show();
			$("#addModifyDatapointModal").show();
		});

		$( ".close" ).click(function() {
			reinititialisationDatapoint();
			if(idDatapointSelected != undefined){
				$("#datapoints-"+file.datapoints[idDatapointSelected].id).removeClass("active");
			}
			idDatapointSelected = null;
			$(".modal").hide();
			$("#warningDelete").hide();
			$(".listValueDatapointAdd").remove();
			
		});

		$( ".closeButton" ).click(function() {
			reinititialisationDatapoint();
			if(idDatapointSelected != undefined){
				$("#datapoints-"+file.datapoints[idDatapointSelected].id).removeClass("active");
			}
			idDatapointSelected = null;
			$(".modal").hide();
			$(".listValueDatapointAdd").remove();
			
		});

		$( "#deleteNode" ).click(function() {
			/*if(nodeSelected.responses == undefined){
				$("#warningDelete").show();
			}
			else{
				if(nodeSelected.responses.length > 0){
					$("#deleteNodeModal").show();
				}else{
					$("#warningDelete").show();
				}
			}*/
			$("#deleteNodeModal").show();
			
		});

		$( "#confirmDeleteNode" ).click(function() {
			deleteNode(typeOfWork, idNodeSelected, true);
			$("#deleteNodeModal").hide();
			draw();
		});

		$( "#addNewTypeOfWork" ).click(function() {
			if($("#nameTypeOfWork").val() !== ""){
				addNewTypeOfWork($("#nameTypeOfWork").val());
				listTypeDatapoint();
				$(".modal").hide();
			}
		});

		$( "#addModifyDatapoint" ).click(function() {
			if($("#idDatapoint").val() !== ""){
				
				var id = $("#idDatapoint").val();
				var hint = $("#hintDatapoint").val();
				var question = $("#questionDatapoint").val();
				var type = $("#typeDatapoint").val();
				var set = null;

				switch(type){
				case 'static':
							set = $("#valueDatapoint").val();
						break;
				case 'list':
							set = [];
							for(var i = 0; i < $(".listValueDatapoint").length - 2; i++){
								if($("#listValueDatapoint"+(i + 1)).val() != ""){
									set.push(id+i);

									eval("bibliotheque['"+languageChoosen+"']."+id+i+" = '"+$("#listValueDatapoint"+(i + 1)).val()+"'");
								}
							}
						break;
				case 'numeric':
				default:
							$(".valueDatapoint").hide();
							$(".listValueDatapoint").hide();
						break;
				}
				if(idDatapointSelected == null){
					addDatapoint(id, hint, question, type, set);
				}else{
					modifyDatapoint(idDatapointSelected, id, hint, question, type, set);
				}
				
				reinititialisationDatapoint();
				listTypeDatapoint(typeOfWork);

				idDatapointSelected = null;

				$(".modal").hide();
				$(".listValueDatapointAdd").remove();
			}
		});
		
		$( "#addListElements" ).click(function() {
			$( "#list-elements" ).append("<div class='form-group listValueDatapoint listValueDatapointAdd' id='listValueDatapoint"+($( ".listValueDatapoint").length - 1)+"-group'>\
                                    <label for='listValueDatapoint"+($( ".listValueDatapoint").length - 1)+"' class='col-lg-3 control-label' >Element "+($( ".listValueDatapoint").length - 1)+"</label>\
                                    <div class='col-lg-9'>\
                                        <input type='text' id='listValueDatapoint"+($( ".listValueDatapoint").length - 1)+"' class='form-control inputLine' placeholder='Element "+($( ".listValueDatapoint").length - 1)+"'>\
                                    </div>\
                                </div>");
		});

	});

	//On resize

	window.onresize = function(event) {
		resizeVerticaly()
	};

	window.onbeforeunload = function (e) {
		if(current_user.id != 0){
			var message = "Any progress will be lost if you have not saved.",
		  	e = e || window.event;
		  	// For IE and Firefox
		  	if (e) {
		    	e.returnValue = message;
		  	}

		  	// For Safari
		  	return message;
		}
	  	
	};

	
	
});

function listTypeDatapoint(activeTypeOfWork){

	if(activeTypeOfWork == undefined){
		activeTypeOfWork = 0;
	}

	$('#listTypeOfWork').html('');
	$('#listDatapoints').html('');
	$.each( file.subgraph, function( key, value ) {
		var classactive = '';
		if(key == activeTypeOfWork){
			classactive = ' active';
			loadTypeOfWork(key);
		}
		else{
			classactive = '';
		}
			$('#listTypeOfWork').append('<li class="typeOfWork'+classactive+'" id="typeOfWork-'+key+'" onclick="loadTypeOfWork(\''+key+'\');"><a href="#">'+value.graphName+'</a></li>');

			$('.active > a').css("color", "#fff");
		});
	
	$.each( file.datapoints, function( key, value ) {
			var etc = '';
			var tradDatapoint = getTraduction(languageChoosen,'question_'+value.id);
			if(tradDatapoint.length > 8){
				etc = '...';
			}

			$('#listDatapoints').append('<li class="datapoints" id="datapoints-'+value.id+'" onclick="loadDatapoints(\''+key+'\');"><a href="#" title="'+tradDatapoint+'">'+tradDatapoint.substring(0, 8)+etc+'</a></li>');
	});

	resizeVerticaly();
}

//Récupération des éléments get de l'URL
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value.replace("#", "");;
    });
    return vars;
}

function loadTypeOfWork(id){

	typeOfWork = id;

	var typeOfWorkSelected = file.subgraph[typeOfWork].graphName;

	$("#subchart-title").html("SUBCHART > "+typeOfWorkSelected);

	$("#panelProperties").hide();
	$("#selectANode").show();
	nodeSelected = null;
	idNodeSelected = null;
	$( ".typeOfWork" ).removeClass('active');
	$(".typeOfWork > a").css('color', "#22abd4");
	$("#typeOfWork-"+id).addClass('active');
	$("#typeOfWork-"+id+" > a").css('color', "#fff");

	

	if(readOnly){
		typeOfWorkSelected = typeOfWorkSelected + " ( Read only )";
	}

	$("#typeOfWorkSelected").html(typeOfWorkSelected);
	
	//Dessine le graphe
	draw();
}

//Dessine le diagramme
function draw(){
	$("#drawSvg").html('');
	g = new dagreD3.graphlib.Graph()
  		.setGraph({})
  		.setDefaultEdgeLabel(function() { return {}; });

	// Push a couple of states with custom styles
	g = formatD3Nodes(g);

	g = formatD3Edges(g);
	
	g.nodes().forEach(function(v) {
	  	var node = g.node(v);
	  	node.rx = node.ry = 5;
	});

	var render = new dagreD3.render();

	// Set up an SVG group so that we can translate the final graph.
	svg = d3.select('svg')
	centerG = svg.append('g')
	zoomG = centerG.append('g');

	// Set up zoom support
	zoom = d3.behavior.zoom().on("zoom", function() {
	    centerG.attr("transform", "translate(" + d3.event.translate + ")" +
	                                "scale(" + d3.event.scale + ")");
	  });
	svg.call(zoom);

	render(d3.select("svg g"), g);

	// Zoom and scale to fit
    var zoomScale = zoom.scale();
    var graphWidth = g.graph().width + 80;
    var graphHeight = g.graph().height + 40;
    var width = parseInt(svg.style("width").replace(/px/, ""));
    var height = parseInt(svg.style("height").replace(/px/, ""));
    zoomScale = Math.min(width / graphWidth, height / graphHeight);
    var translate = [(width/2) - ((graphWidth*zoomScale)/2), (height/2) - ((graphHeight*zoomScale)/2)];
    zoom.translate(translate);
    zoom.scale(zoomScale).event(svg);
 


	var i = 0;
	$(".node").each(function () {
		if(file.subgraph[typeOfWork].nodes[i].start == true){
			$(this).attr('startNode', true);
		}
		if(file.subgraph[typeOfWork].nodes[i].type == 'final'){
			$(this).addClass("endNode");
			$(this).attr('endNode', true);
		}
    	$(this).attr('id', i);
    	$(this).attr('style', "fill: #2196f3");
    	i++;
	});

  	$('.node').click( function(){
  		
  		$( "#inferiorFormula" ).removeAttr("disabled","");
	  	$( "#superiorFormula" ).removeAttr("disabled","");

    	$(".node").find("rect").css("fill","#fff");
    	$(".node").css("fill","#2196f3");

    	$(".node").each(function () {
    		var startNode = $(this).attr('startNode');
  			var endNode = $(this).attr('endNode');
  			if(startNode == 'true' || endNode == 'true'){
  				$(this).find("rect").css("fill","#AAD9FD");
  			}
    	});

    	$(this).find("rect").css("fill","#22abd4");
    	$(this).css("fill","#fff");

    	selectPropertiesButton($(this).attr('id'));

  	});
  	if(idNodeSelected != undefined){
  		$( "#"+idNodeSelected ).trigger( "click" );
  	}
  	
}

//Retourne les noeuds sous le format supporté par D3.js
function formatD3Nodes(g){
	for(var i = 0; i < file.subgraph[typeOfWork].nodes.length; i++){
		var node = file.subgraph[typeOfWork].nodes[i];
		var noeud = new Object();
		noeud.id = i;
		noeud.value = new Object();
		noeud.value.label = "";

		var strADecoupe = "";
		var traduction = getTraduction(languageChoosen,node.text);
		if(traduction != ""){
			strADecoupe = traduction;
		}
		
		var cutHere = 0;
		if(strADecoupe !== undefined){
			for(var j = 0; j < strADecoupe.length; j++){
				if(j - cutHere >= 20 && strADecoupe[j] == ' '){
					noeud.value.label += strADecoupe.substring(cutHere, j)+"\r\n";
					cutHere = j + 1;
				}
				if(j + 1 == strADecoupe.length){
					noeud.value.label += strADecoupe.substring(cutHere, j + 1);
				}
				
			}
		}
		
		if(node.start != undefined && node.start == true){
			noeud.value.style = 'fill: #AAD9FD';
		}
		else{
			if(node.type == 'final'){
				noeud.value.style = 'fill: #AAD9FD';
			}
			else{
				noeud.value.style = 'fill: #fff';
			}
			
		}
		
		g.setNode(noeud.id,  { label: noeud.value.label,      style: noeud.value.style });
		
	}
	return g;
}

//Retourne les liens sous le format supporté par D3.js
function formatD3Edges(g){
	if(file.subgraph[typeOfWork].nodes != undefined){
		for(var i = 0; i < file.subgraph[typeOfWork].nodes.length; i++){
			var node = file.subgraph[typeOfWork].nodes[i];
			if(node.responses != undefined){
				for(var j = 0; j < node.responses.length; j++){
					if(node.responses[j].child != null){
						var edge = new Object();
						edge.u = i;
						edge.v = node.responses[j].child;
						edge.value = new Object();
						if(typeof node.responses[j].value === "boolean"){
							if(node.responses[j].value){
								edge.value.label = 'True';
							}
							else{
								edge.value.label = 'False';
							}
						}else{
							console.log(getType(typeOfWork, i));
							if(getType(typeOfWork, i) == 'list'){
								edge.value.label = getTraduction( languageChoosen , node.responses[j].value);
							}else{
								edge.value.label = node.responses[j].value;
							}
							
						}
						g.setEdge(edge.u, edge.v, {label: edge.value.label});
					}
					
				}
			}
		}
	}
	return g;
}

//Gestion de l'affichage des cliques sur les boutons principaux des propriétés.
function clickPropertiesButton(idButton){
	if((haveResponses(nodeSelected.responses) == true || idButton != 'aliasButton') && (haveResponses(nodeSelected.responses) == false || idButton != 'resultButton')){
		$('.buttonProperties').removeClass('buttonPropertyActive');
		$('.buttonProperties').addClass('buttonPropertyNonActive');
		$('#'+idButton).removeClass('buttonPropertyNonActive');
		$('#'+idButton).addClass('buttonPropertyActive');

		if(haveResponses(nodeSelected.responses) == false){
			$("#aliasButton").removeClass('buttonPropertyNonActive');
		}

		if(haveResponses(nodeSelected.responses) == true){
			$("#resultButton").removeClass('buttonPropertyNonActive');
		}

		switch(idButton){
			case 'formulaButton' :
							$(".panelProperty").hide();
							$("#formulaPanel").show();
							$(".questionPart").show();
							resizeVerticaly();
							setFormulaDatapoints();
							break;
			case 'listButton':
							$(".panelProperty").hide();
							$("#listPanel").show();
							$(".questionPart").show();
							setListDatapoints(nodeSelected.inputs);
							displayResponses();
							resizeVerticaly();
							break;
			case 'aliasButton':
							$(".panelProperty").hide();
							$("#aliasPanel").show();
							$(".questionPart").hide();
							aliasNodes();
							aliasResponses();
							resizeVerticaly();
							break;
			case 'resultButton':
							$(".panelProperty").hide();
							$("#resultPanel").show();
							$(".questionPart").hide();
							resizeVerticaly();
							setResultText();
							break;
		}
	}
}

//Sélection du bouton automatique en fonction du type 
function selectPropertiesButton(idNode){

	reinititialisation();
	$("#panelProperties").show();
	$("#selectANode").hide();
	nodeSelected = file.subgraph[typeOfWork].nodes[idNode];
	idNodeSelected = idNode;
	setQuestionInput();

	if(nodeSelected.responses !== undefined){
		if(nodeSelected.responses.length > 0){
			$('#datapointsList').prop("disabled","disabled");
		}
		else{
			$('#datapointsList').prop("disabled","");
		}
	}else{
		$('#datapointsList').prop("disabled","disabled");
	}
	console.log(getType(typeOfWork, idNode));
	switch(getType(typeOfWork, idNode)){
		case 'formula' :
						clickPropertiesButton('formulaButton');
						if(nodeSelected.formula != null){
							actualFormula(nodeSelected.formula.split(' '));
						}
						break;
		case 'list':
						clickPropertiesButton('listButton');
						break;
		case 'final':
						clickPropertiesButton('resultButton');
						break;
	}
}

//Fonction remplissant le champs de question en fonction de la node sélectionné
function setQuestionInput(){

	var traduction = getTraduction(languageChoosen, nodeSelected.text);

	if(traduction != ''){
		$('#question').val(traduction);
	}

	
}

//Remplissement des datapoints pour les formules
function setFormulaDatapoints(){
	var datapoints = datapointsByType('numeric');
	datapoints = datapoints.concat(datapointsByType('static'));
	$("#datapointsFormula").html('');
	$("#datapointsFormula").append('<option value="">Select datapoint</option>');
	$("#datapointsFormula").append('<option value="NOW">Current year</option>');
	for(var i = 0; i < datapoints.length; i++){
		$("#datapointsFormula").append('<option value="'+datapoints[i].id+'">'+datapoints[i].id+'</option>');
	}
}

//Remplissement des datapoints pour les listes
function setListDatapoints(selected){
	var selectedList = '';
	if(selected !== undefined){
		selectedList = selected[0];
	}
	
	var datapoints = datapointsByType('list');
	$("#datapointsList").html('');
	$("#datapointsList").append('<option value="">Select datapoint</option>');
	for(var i = 0; i < datapoints.length; i++){
		var selectedInOption = '';
		if(selectedList == datapoints[i].id){
			selectedInOption = 'selected';
		}
		$("#datapointsList").append('<option value="'+datapoints[i].id+'" '+selectedInOption+'>'+datapoints[i].id+'</option>');
	}
}

function setResultText(){
	$("#resultText").val(getTraduction(languageChoosen, nodeSelected.text));

}

//Réponse disponible dans la liste sélectionné
function displayResponses(){
	$('#responsesList').html('');
	var idDatapoint = $("#datapointsList").val();
	var datapoint = getResponseById(idDatapoint);
	if(datapoint !== undefined && datapoint.set !== undefined){
		for(var i = 0; i < datapoint.set.length; i++){
			$('#responsesList').append('<div class="row buttonPropertyActive">\
                <span style="padding-left: 15px;font-size: 16px;">'+ getTraduction( languageChoosen, datapoint.set[i]) +'</span>\
            </div>');
		}
	}
}

function aliasNodes(){
	var parents = getAllParentNodesByIdNodes(typeOfWork, idNodeSelected);

	var listNodes = file.subgraph[typeOfWork].nodes;

	$("#aliasNode").html("");
	$("#aliasNode").append('<option value="">Select a node</option>');

	for(var i = 0; i < listNodes.length; i++){
		var libelle = getTraduction(languageChoosen, listNodes[i].text);
		if( jQuery.inArray( i, parents ) == -1  && i != idNodeSelected && libelle != undefined && libelle != ''){
			$("#aliasNode").append('<option value="'+i+'">'+libelle+'</option>');
			parents.push(i);
		}
	}
}

function aliasResponses(){
	
	$("#aliasResponse").html("");
	$("#aliasResponse").append('<option value="">Select a response</option>');

	for(var i = 0; i < nodeSelected.responses.length; i++){
		var response = nodeSelected.responses[i];
		var labelReponse = "";
		switch(response.value){
			case true : 
						labelReponse = "True";
						break;
			case false : 
						labelReponse = "False";
						break;
			default:
						labelReponse = response.value;
						break;
		}

		$("#aliasResponse").append('<option value='+i+'>'+getTraduction(languageChoosen,labelReponse)+'</option>');
	}
}

//Réinitialisation des champs de saisie de la colonne des propriétés
function reinititialisation(){
	$("#formula").html("");
	$("#question").val("");
	resizeVerticaly();
}

function reinititialisationDatapoint(){
	$("#idDatapoint").val("");
	$("#hintDatapoint").val("");
	$("#valueDatapoint").val("");
	$("#typeDatapoint").val("");
	$("#questionDatapoint").val("");
	$(".listValueDatapoint").hide();
	$(".valueDatapoint").hide();

	for(var i = 0; i < $(".listValueDatapoint").length; i++){
		$("#listValueDatapoint"+(i + 1)).val("");
	}
}
function loadDatapoints(id){

	idDatapointSelected = id;

	$("#datapoints-"+file.datapoints[id].id).addClass("active");

	var datapoint = file.datapoints[id];
	$("#idDatapoint").val(datapoint.id);
	if(datapointIsUse(datapoint.id) || readOnly){
		readonlyDatapoint();
	}else{
		writeDatapoint();
	}
	$("#hintDatapoint").val(datapoint.hint);
	var traduction = getTraduction(languageChoosen,'question_'+datapoint.id);
	if(traduction != ""){
		$("#questionDatapoint").val(traduction);
	}
	
	switch(typeof datapoint.set){
			case 'string' : 
						$("#valueDatapoint").val(datapoint.set);
						$(".valueDatapoint").show();
						$(".listValueDatapoint").hide();
						break;
			case 'object' : 
						$(".valueDatapoint").hide();
						if(datapoint.set !== null){
							for(var i = 0; i < $(".listValueDatapoint").length; i++){
								$("#listValueDatapoint"+(i + 1)).val(getTraduction(languageChoosen, datapoint.set[i]));
							}
							$(".listValueDatapoint").show();
						}else{
							$(".listValueDatapoint").hide();
						}
						
						break;
			default:
						$("#valueDatapoint").val(datapoint.set);
						$(".valueDatapoint").hide();
						$(".listValueDatapoint").hide();
						break;
		}

	
	$("#typeDatapoint").val(datapoint.type);

	$("#datapoint-modal-title").html("Modify datapoint");
	$("#addModifyDatapoint").html("Modify");

	$("#addModifyDatapointModal").show();

}

function readonlyDatapoint(){
	$("#idDatapoint").prop("disabled", "disabled");
	$("#valueDatapoint").prop("disabled", "disabled");
	$("#typeDatapoint").prop("disabled", "disabled");
	$("#hintDatapoint").prop("disabled", "disabled");
	$("#questionDatapoint").prop("disabled", "disabled");
	for(var i = 0; i < $(".listValueDatapoint").length; i++){
		$("#listValueDatapoint"+(i + 1)).attr("disabled", "disabled");
	}
	$("#addModifyDatapoint").attr("disabled", "disabled");
}

function writeDatapoint(){
	$("#idDatapoint").prop("disabled", "");
	$("#valueDatapoint").prop("disabled", "");
	$("#typeDatapoint").prop("disabled", "");
	$("#hintDatapoint").prop("disabled", "");
	$("#questionDatapoint").prop("disabled", "");
	for(var i = 0; i < $(".listValueDatapoint").length; i++){
		$("#listValueDatapoint"+(i + 1)).prop("disabled", "");
	}
	$("#addModifyDatapoint").prop("disabled", "");
}

function zoomIn(){

	var zoomScale = zoom.scale() * 1.5;
    var graphWidth = g.graph().width + 80;
    var graphHeight = g.graph().height + 40;
    var width = parseInt(svg.style("width").replace(/px/, ""));
    var height = parseInt(svg.style("height").replace(/px/, ""));
    var translate = [(width/2) - ((graphWidth*zoomScale)/2), (height/2) - ((graphHeight*zoomScale)/2)];
    zoom.translate(translate);
    zoom.scale(zoomScale);
    zoom.event(svg.transition().duration(500));
}

function zoomOut(){
	var zoomScale = zoom.scale() * 2/3;
    var graphWidth = g.graph().width + 80;
    var graphHeight = g.graph().height + 40;
    var width = parseInt(svg.style("width").replace(/px/, ""));
    var height = parseInt(svg.style("height").replace(/px/, ""));
    var translate = [(width/2) - ((graphWidth*zoomScale)/2), (height/2) - ((graphHeight*zoomScale)/2)];
    zoom.translate(translate);
    zoom.scale(zoomScale);
    zoom.event(svg.transition().duration(500));
}

function zoomReinit(){

 // Zoom and scale to fit
    var zoomScale = zoom.scale();
    var graphWidth = g.graph().width + 80;
    var graphHeight = g.graph().height + 40;
    var width = parseInt(svg.style("width").replace(/px/, ""));
    var height = parseInt(svg.style("height").replace(/px/, ""));
    zoomScale = Math.min(width / graphWidth, height / graphHeight);
    var translate = [(width/2) - ((graphWidth*zoomScale)/2), (height/2) - ((graphHeight*zoomScale)/2)];
    zoom.translate(translate);
    zoom.scale(zoomScale);
    zoom.event(svg.transition().duration(500));
}

function readOnlyDiagram(){
	readOnly = getUrlVars()["readonly"] === 'true';

	if(readOnly){
		$("#addTypeOfWorkButton").attr("disabled", "disabled");
		$("#addDatapointModalButton").attr("disabled", "disabled");
		$("#deleteNode").attr("disabled", "disabled");
		$("#saveok").attr("disabled", "disabled");
		$("#save").attr("disabled", "disabled");
		$("#question").prop("disabled", "disabled");
		$("#datapointsFormula").prop("disabled", "disabled");
		$("#plusFormula").attr("disabled", "disabled");
		$("#minusFormula").attr("disabled", "disabled");
		$("#superiorFormula").attr("disabled", "disabled");
		$("#inferiorFormula").attr("disabled", "disabled");
		$("#formulaReset").attr("disabled", "disabled");
		$("#datapointsList").prop("disabled", "disabled");
		$("#aliasResponse").prop("disabled", "disabled");
		$("#aliasNode").prop("disabled", "disabled");
		$("#resultText").prop("disabled", "disabled");
	}
}

function resizeVerticaly(){
	var height = $( "#drawSvg" ).height() ;
	var heightTypeOfWorkRow = $( "#typeOfWorkRow").height();
	var heightDatapointsRow = $( "#datapointsRow").height();
	var heightPanelProperties = $( "#panelProperties").height();
	var heightButtonSave = $( "#buttonSave").height();
	var heightBlueMarginActual = $( "#blueMargin").height();
	var heightDatapoints;
	var heightTypeOfWork;
	var heightBlueMargin;
	heightTypeOfWork = (height - 180) / 2;
	heightDatapoints = (height - 180) / 2;

	heightBlueMargin = (height + heightBlueMarginActual - heightPanelProperties - heightButtonSave);

	$( "#listTypeOfWork").css("height", heightTypeOfWork+"px");
	$( "#listDatapoints").css("height", heightDatapoints+"px");
	$( "#blueMargin").css("height", heightBlueMargin+"px");
}

function printDiagram(){
	window.open("print-diagram.html?country="+country+"&language="+languageChoosen+"&typeOfWork="+typeOfWork);
}

function testCountry(){
	window.open("?page_id=4433&country="+country);
}
