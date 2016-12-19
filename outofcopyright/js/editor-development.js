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
	graphic.setNode('lvl_0', {id:'lvl_0', label: 'Click to edit'});
	questionNodes['lvl_0'] = {};
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
	graphic.nodes().forEach(function(v) {
		var node = graphic.node(v);
		node.rx = node.ry = 5;	// Rounded edges
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




// Delete node
function deleteNode(){
	// Get node
	var nodeId = $(leftPanelNodeSelector).val(),
		node = questionNodes[nodeId];


	console.log("deleteing");

	// Check if this node has children
	if(graphic.hasNode(nodeId)){
		console.log("has node ");

		// For all of them, check if they have other 'In' connections
		graphic.outEdges(nodeId).map(function(out){
			console.log("map : ", out);

			var destSrc = []
			graphic.inEdges(out.w).map(function(inEdges){
				console.log("in edges : ", inEdges.v, nodeId);
				if(inEdges.v != nodeId){
					destSrc.push(inEdges.v);	
				} 
			});

			// If no connection, remove this node from model and graphic
			if(destSrc.length == 0){
				delete questionNodes[out.w];
				graphic.removeNode(out.w);
			}
		});
	}

	// Remove finally this current node
	delete questionNodes[nodeId];
	graphic.removeNode(nodeId);

	render();


	// Hide all display

}






// Refresh node data
function updateNode(nodeData){
	
	// Get the node, and update graphic sructure
	var nodeToUpdate = graphic.node(nodeData.id);

	if(nodeData.isResult){
		nodeToUpdate.label = nodeData.text;
	}
	else {
		if(nodeData.isBlock){
			// Block case : Cluster
			nodeToUpdate.label = nodeData.block.title;			
			nodeToUpdate.style = 'fill: #d3d7e8';
			nodeToUpdate.shape = 'diamond';
			generateCluster(nodeToUpdate, nodeData.block.nbQuestions);
		}
		else if(questionNodes[nodeData.id].isClustered) {
			// Question clustered case
			// Nothing to do except retrieve this information
			// The copy will be done just after
			nodeData.isClustered = true;
			nodeToUpdate.label = nodeData.question.title;
		}
		else{
			// Question case
			nodeToUpdate.label = nodeData.question.title;
			generateOutputLinks(nodeToUpdate, nodeData.question.answers);
		}
	}

	// Save model modifications
	questionNodes[nodeData.id] = nodeData;

	// Render graphic modifications
	render();
}



function generateCluster(nodeToUpdate, nbQuestions){
	// Base id
	var baseId = nodeToUpdate.id+":";

	for(var i=0; i<nbQuestions; i++){
		// Create the children id, the node, and the edge
		var childId = baseId + i;
		graphic.setNode(childId, {id:childId, label:"Click to edit"});
		graphic.setEdge(nodeToUpdate.id, childId);

		// register the created child
		questionNodes[childId] = {
			isClustered: true
		};
	}
}




// Create the required nodes and edges with custom labels
function generateOutputLinks(nodeToUpdate, answers){

	// Pattern creation of children id
	var idSplit = nodeToUpdate.id.split('_'),
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

		if(a.target == undefined){
			// Create the child node and the edge between parent/child
			graphic.setNode(childId, {id:childId, label: 'Click to edit'});
			graphic.setEdge(nodeToUpdate.id, childId, {label:a.label});

			// register the created child and register it as a target for this answer
			questionNodes[childId] = {};
			a.target = childId;
		}
		else{
			// Create a connection to existing node
			graphic.setEdge(nodeToUpdate.id, a.target, {label:a.label});
		}
	});
}