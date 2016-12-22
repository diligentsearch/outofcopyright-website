/*
 * Dependencies
 * /js/lib/dagre-d3.min.js
 * editor-left-panel.js
 *
 */


// Html target
leftPanelNodeSelector = '#node-editor-id';

// Data store for current graph
questionNodes = [];

// Graphical objects
svg = undefined;
svgGroup = undefined;
graphic = undefined;
zoom = undefined;
initialScale = 0.75;


// Initiate the graphical object and the first node
function initSVG(){
	graphic = new dagreD3.graphlib.Graph({compound:true})
		.setGraph({})
		.setDefaultEdgeLabel(function() { return {}; });	
	
	svg = d3.select("svg");
	svgGroup = svg.append("g");
	zoom = d3.behavior.zoom();
	
	createNode('lvl_0');	// Create and register the first node
}



// Render the graphic to display
function render(){	
	graphic.nodes().forEach(function(id) {
		graphic.node(id).rx = graphic.node(id).ry = 5;
	});
	
	var render = new dagreD3.render();
	render(svgGroup, graphic);

	configSVG();
}


// Configure SVG features (centering, translation, zoom, click)
function configSVG(){
	
	svg.attr('width', $('#graphical-editor').width());	// Update svg width element based on display

	/* Centering */
	// var xCenterOffset = (svg.attr("width") - graphic.graph().width * 2) / 2;
	var xCenterOffset = (svg.attr("width") - graphic.graph().width) / 2;
	svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
	svg.attr("height", graphic.graph().height + 40);


	/* Translation */
	zoom.translate([xCenterOffset, 100])
	  .scale(initialScale)
	  .event(svg);
	svg.attr('height', graphic.graph().height * initialScale + 40);

	/* Zoom */
	zoom.on("zoom", function() {
		svgGroup.attr("transform", 
			"translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
	});
	svg.call(zoom);

	/* Click bindings with editor */
	d3.select("svg g").selectAll("g.node").each(function(v){
		$(this)
			.off('click')
			.on('click', function(event) {
				$(leftPanelNodeSelector)
					.val($(this).context.id)
					.trigger('change');
		});
	});
}





// Create graphical and logical model
function createNode(nodeId, label){
	graphic.setNode(nodeId, {
		id: nodeId,
		label: label || 'Click to edit'
	});

	questionNodes[nodeId] = {
		id: nodeId,
		isResult: false,
		isBlock: false,
		isClustered: false,
		result: {
			text: ""
		},
		block: {
			title: "",
			nbQuestions: 0
		},
		question: {
			clusterNode: "",
			title: "",
			type: "text",
			answers: [],
			computation: {
				reference: 0,
				condition: "==",
				formula: "",
				inputs: []
			}
		}
	};
	return questionNodes[nodeId];
}


// Refresh graphical ndoe based on incomming data from editor
function updateNode(nodeData){

	var nodeGraphic = graphic.node(nodeData.id);

	if(nodeData.isResult){
		nodeGraphic.label = nodeData.result.text;
		nodeGraphic.style = 'stroke: #57723E; stroke-width: 5; ';
	}
	else {
		if(nodeData.isBlock){
			nodeGraphic.label = nodeData.block.title;
			nodeGraphic.style = 'stroke: #000000; fill: #d3d7e8' ; 
			nodeGraphic.shape = 'ellipse';
			generateQuestionsBlock(nodeGraphic, nodeData.block.nbQuestions);
		}
		else{
			// Question case
			nodeGraphic.label = nodeData.question.title;
			if(! nodeData.isClustered){
				generateQuestions(nodeGraphic, nodeData.question.answers);

				if(nodeData.question.type == "numeric"){	
					generateNumericInputs(nodeGraphic, nodeData.question.computation.inputs);

				}
			}
		}
	}	
	render();
}


// Generate a block of questions
function generateQuestionsBlock(nodeGraphic, nbQuestions){

	// Specific id definition
	var baseId = nodeGraphic.id+":";

	// Register a parent node, which will help graphical identification of the block
	graphic.setNode(baseId, {style: 'fill: #d3d7e8'});
	graphic.setParent(nodeGraphic.id, baseId);

	// Reference the parent in the model for further management
	questionNodes[nodeGraphic.id].question.clusterNode = baseId;

	
	// For all questions, create id, node, edge, and register them as child of the created parent
	for(var i=0; i<nbQuestions; i++){
		var childId = baseId + i;

		// Create child if needed
		if(! questionNodes[childId]){
			createNode(childId);
			graphic.setEdge(nodeGraphic.id, childId);
			graphic.setParent(childId, baseId);
			graphic.node(childId).style = 'stroke: #000000; fill: #d3d7e8' ;
			graphic.node(childId).shape = 'diamond';

			questionNodes[childId].isClustered = true;
			questionNodes[childId].clusterNode = baseId;			
		}
	}

	// Create the target node, output of block and beginning of a subgraph if needed
	if(graphic.outEdges(nodeGraphic.id).length == nbQuestions){
		var	defaultTarget = [{ 
			target: undefined,
			label: "Target"
		}];
		generateQuestions(nodeGraphic, defaultTarget);
	}				
}


// Create node that will receive question for specific numerical treatement
function generateNumericInputs(nodeGraphic, inputs){
	// Specific id definition
	var baseId = nodeGraphic.id+":",
		childNodeIndex = 0;

	console.log("generating inputs nodes");


	/* For all answers provided, use a child node or create one with specific id */
	inputs.forEach(function(input){
		// use a defined target if possible
		if(input.target != undefined){
			graphic.setEdge(nodeGraphic.id, input.target, {label:input.label});			
		}
		else{
			// Or create a new node
			var childId = baseId + childNodeIndex;
			childNodeIndex++;

			createNode(childId);
			graphic.setEdge(nodeGraphic.id, childId, {label:input.label});
			graphic.node(childId).style = 'stroke: #000000; fill: #d3d7e8' ;
			graphic.node(childId).shape = 'circle';

			input.target = childId;	// Register the edge in the model of the parent
		}
	});
}



// Create question nodes for each answers provided by the current node received
function generateQuestions(nodeGraphic, answers){

	/* Create id of the new question node, based on the current graphical node */

	// Id creation pattern : lvl_{parent+1}_{rank}
	var idSplit = nodeGraphic.id.split('_'),
		parentLvl = parseInt(idSplit[1]),
		currentLvl = idSplit[0]+'_'+( parentLvl + 1 );

	// Determination of rank of this node at this level : avoid to erase sibling children nodes
	var childNodeIndex = 0;
	for(var nodeId in questionNodes){
		if(nodeId.indexOf(currentLvl) == 0){
			childNodeIndex++;
		}
	}

	/* For all answers provided, use a child node or create one with specific id */
	answers.forEach(function(a){

		// use a defined target if possible
		if(a.target != undefined){
			graphic.setEdge(nodeGraphic.id, a.target, {label:a.label});			
		}
		else{
			// Or create a new node
			var childId = currentLvl+'_'+childNodeIndex;
			childNodeIndex++;

			createNode(childId);
			graphic.setEdge(nodeGraphic.id, childId, {label:a.label});

			a.target = childId;	// Register the edge in the model of the parent
		}
	});
}


// Delete this node, with all nodes which became orphan nodes
function deleteNode(){
	var nodeId = $(leftPanelNodeSelector).val();
	recursiveDelete(nodeId, 0);
	
	// Regenerate root if needed
	if(nodeId == "lvl_0"){
		createNode('lvl_0');
	}

	render();
}


// Delete recursively this node
function recursiveDelete(nodeId, depth){
	// Child node, with at least 2 parents : don't delete it
	if(depth != 0 && graphic.predecessors(nodeId).length > 1){
		return;
	}

	// Look at all children
	var children = graphic.successors(nodeId);
	if(children.length > 0){
		children.map(function(childId){
			recursiveDelete(childId, depth+1);
		});
	}

	// Start node : update predecessors
	if(depth == 0){
		// For all predecessors, remove the question wich points to this current node
		graphic.predecessors(nodeId).map(function(p){
			var array = questionNodes[p].question.answers;

			array.forEach(function(answer, idx){
				// Remove element from array if found
				if(answer.target == nodeId){
					array.splice(idx, 1);
				}
			});
		});
	}

	// If this node is a cluster, delete parent node 
	var nodeData = questionNodes[nodeId],
		clusterId = questionNodes[nodeId].question.clusterNode;
	if(nodeData.isBlock && clusterId != ""){
		delete questionNodes[clusterId];
		graphic.removeNode(clusterId);
	}

	// Delete this node as we have not yet return from this call
	delete questionNodes[nodeId];
	graphic.removeNode(nodeId);	
}
