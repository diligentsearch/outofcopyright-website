/*
 * Dependencies
 * /js/lib/dagre-d3.min.js
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

	// Create and register the first node
	createNode('lvl_0');
}



// Render the graphic to display
function render(){	
	graphicBeautifier();
	var render = new dagreD3.render();
	render(svgGroup, graphic);
	configSVG();
}


// Enhance graphical drawing
function graphicBeautifier(){
	graphic.nodes().forEach(function(id) {
		graphic.node(id).rx = graphic.node(id).ry = 5;
	});
}


// Configure svg features
function configSVG(){

	// Update svg width element based on display
	svg.attr('width', $('#graphical-editor').width());

	// Center
	// var xCenterOffset = (svg.attr("width") - graphic.graph().width * 2) / 2;
	var xCenterOffset = (svg.attr("width") - graphic.graph().width) / 2;
	svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
	svg.attr("height", graphic.graph().height + 40);


	// Translation enabled
	zoom.translate([xCenterOffset, 100])
	  .scale(initialScale)
	  .event(svg);
	svg.attr('height', graphic.graph().height * initialScale + 40);

	// Zoom eanbled
	zoom.on("zoom", function() {
		svgGroup.attr("transform", 
			"translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
	});
	svg.call(zoom);


	// Click events on nodes : link to the leftPanel editor
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





// Create model
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
			answers: []
		}
	};
	return questionNodes[nodeId];
}


// Refresh node data
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
			generateCluster(nodeGraphic, nodeData.block.nbQuestions);
		}
		else{
			// Question case
			nodeGraphic.label = nodeData.question.title;
			if(! nodeData.isClustered){
				generateOutputLinks(nodeGraphic, nodeData.question.answers);				
			}
			else{
				nodeGraphic.style = 'stroke: #000000; fill: #d3d7e8' ; 
				nodeGraphic.shape = 'diamond';
			}
		}
	}	
	console.log("nodeData : ", nodeData);
	console.log("nodeGraphic outputs : ", graphic.outEdges(nodeGraphic));
	render();
}



function generateCluster(nodeGraphic, nbQuestions){
	// Create a luster node
	var baseId = nodeGraphic.id+":";

	graphic.setNode(baseId, {style: 'fill: #d3d7e8'});
	graphic.setParent(nodeGraphic.id, baseId);

	// For all children, create id, node, and edge
	for(var i=0; i<nbQuestions; i++){
		var childId = baseId + i;
		
		createNode(childId);
		graphic.setEdge(nodeGraphic.id, childId);
		graphic.setParent(childId, baseId);

		questionNodes[childId].isClustered = true;
		questionNodes[childId].clusterNode = baseId;
	}

	// Create the target node, beginning of a subgraph
	var clusterNode = graphic.node(baseId),
		defaultTarget = [{
			target: undefined,
			label: "Block Target"
		}];
	defaultTarget.forEach(function(a){ console.log("def : ", a); });
	generateOutputLinks(nodeGraphic, defaultTarget);	
}




// Create the required nodes and edges with custom labels
function generateOutputLinks(nodeGraphic, answers){

	// Pattern creation of children id
	var idSplit = nodeGraphic.id.split('_'),
		parentLvl = parseInt(idSplit[1]),
		currentLvl = idSplit[0]+'_'+( parentLvl + 1 );

	// Look at all question nodes to know the position to insert in
	var childNodeIndex = 0;
	for(var nodeId in questionNodes){
		// Check if this node is sibling : avoid to erase it
		if(nodeId.indexOf(currentLvl) == 0){
			childNodeIndex++;
		}
	}

	answers.forEach(function(a){
		// Create the children id
		var childId = currentLvl+'_'+childNodeIndex;
		childNodeIndex++;

		// Create the child node and the edge between parent/child
		if(a.target == undefined){
			createNode(childId);
			graphic.setEdge(nodeGraphic.id, childId, {label:a.label});

			// Register the edge
			a.target = childId;
		}
		else{
			// Create a connection to existing node
			graphic.setEdge(nodeGraphic.id, a.target, {label:a.label});
		}
	});
}







// Delete this node, with all children if needed
function deleteNode(){
	var nodeId = $(leftPanelNodeSelector).val();
	recursiveDelete(nodeId, 0);
	
	// Regen root if needed
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

	// Delete this node as we have not return before
	delete questionNodes[nodeId];
	graphic.removeNode(nodeId);	
}
