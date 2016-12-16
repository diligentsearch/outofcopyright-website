/*
 * Dependencies
 * /js/lib/dagre-d3.min.js
 *
 */

// 
// Graphical editor
// 

leftPanelNodeSelector = '#node-editor-id';

questionNodes = [];

svg = undefined;
svgGroup = undefined;
graphic = undefined;
zoom = undefined;
initialScale = 0.75;


function initSVG(){
	// Create graphic element and asvg
	graphic = new dagreD3.graphlib.Graph()
		.setGraph({})
		.setDefaultEdgeLabel(function() { return {}; });	
	
	svg = d3.select("svg");
	svgGroup = svg.append("g");
	zoom = d3.behavior.zoom();

	graphic.setNode('lvl_0', {id:'lvl_0', label: 'Click to edit'});
	questionNodes['lvl_0'] = {};
}



// Create the renderer and run it on the predefined svg group
function render(){	
	graphicBeautifier();

	var render = new dagreD3.render();
	render(svgGroup, graphic);

	centerZoomClick();
}

function graphicBeautifier(){
	graphic.nodes().forEach(function(v) {
		var node = graphic.node(v);
		node.rx = node.ry = 5;	// Rounded edges
	});
}


function centerZoomClick(){

	// Update svg width element based on display
	svg.attr('width', $('#graphical-editor').width());

	// Center the graph
	var xCenterOffset = (svg.attr("width") - graphic.graph().width * 2) / 2;
	svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
	svg.attr("height", graphic.graph().height + 40);


	// Enable translation
	zoom.translate([xCenterOffset, 100])
	  .scale(initialScale)
	  .event(svg);
	svg.attr('height', graphic.graph().height * initialScale + 40);

	// Enable zoom
	zoom.on("zoom", function() {
		svgGroup.attr("transform", 
			"translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
	});
	svg.call(zoom);


	// Node id binding with editor
	d3.select("svg g").selectAll("g.node").each(function(v){
		/* Click event handle only once */
		$(this)
			.off('click')
			.on('click', function(event) {
				$(leftPanelNodeSelector)
					.val($(this).context.id)
					.trigger('change');
		});
	});
}





function updateNode(nodeData){
	
	questionNodes[nodeData.id] = nodeData;

	var nodeToUpdate = graphic.node(nodeData.id);
	nodeToUpdate.label = nodeData.question.title;
	generateOutputLinks(nodeToUpdate, nodeData.question.answers);
	render();
}

function generateOutputLinks(nodeToUpdate, linkAnswers){

	// Pattern creation of children id
	var idSplit = nodeToUpdate.id.split('_'),
		parentLvl = parseInt(idSplit[1]),
		currentLvl = idSplit[0]+'_'+( parentLvl + 1 );

	// Look at all question nodes to know the position to insert in
	var childNodeIndex = 0;
	for(var nodeId in questionNodes){
		// console.log("k : ", nodeId, "; v ", questionNodes[nodeId]);

		// Check if this node is sibling : avoid to erase it
		if(nodeId.indexOf(currentLvl) == 0){
			childNodeIndex++;
		}
	}

	
	linkAnswers.forEach(function(value){
		// Create the children id	
		var childId = currentLvl+'_'+childNodeIndex;
		childNodeIndex++;

		// Create the child node and the edge between parent/child
		graphic.setNode(childId, {id:childId, label: 'Click to edit'});
		graphic.setEdge(nodeToUpdate.id, childId, {label:value});

		// register the created child
		questionNodes[childId] = {};
	});
}