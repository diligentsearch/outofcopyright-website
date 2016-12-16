/*
 * Dependencies
 * /js/lib/dagre-d3.min.js
 *
 */

// 
// Graphical editor
// 

leftPanelNodeSelector = '#node-editor-id';
graphic = undefined;

function initSVG(){
	// Create graphic element
	graphic = new dagreD3.graphlib.Graph()
		.setGraph({})
		.setDefaultEdgeLabel(function() { return {}; });
	
	// append g element into the svg html group
	d3.select("svg").append("g"); 
	createNew();
}



// Create the renderer and run it on the predefined svg group
function render(){	
	graphicBeautifier();

	var render = new dagreD3.render();
	render(d3.select("svg g"), graphic);

	centerZoomClick();
}

function graphicBeautifier(){
	graphic.nodes().forEach(function(v) {
		var node = graphic.node(v);
		node.rx = node.ry = 5;	// Rounded edges
	});
}


function centerZoomClick(){

	var svg = d3.select("svg"),
		initialScale = 0.75,
		inner = d3.select("svg").select("g"),
		zoom = d3.behavior.zoom();

	// Center the graph
	zoom.translate([(svg.attr("width") - graphic.graph().width * initialScale) / 2, 20])
	  .scale(initialScale)
	  .event(svg);
	svg.attr('height', graphic.graph().height * initialScale + 40);


	// Enable zoom
	zoom.on("zoom", function() {
		inner.attr("transform", 
			"translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
	});
	svg.call(zoom);


	// Node id binding with editor
	d3.select("svg g").selectAll("g.node").each(function(v){
		$(this).on('click', function(event) {
			$(leftPanelNodeSelector)
				.val($(this).context.id)
					.trigger('change');
		});
	});
}


// Based on selected data, create a new graph
function createNew(){
	graphic.setNode('lvl_0', {id:'lvl_0', label: 'Click to edit'});
}





function updateNode(nodeData){
	var nodeToUpdate = graphic.node(nodeData.id);
	nodeToUpdate.label = nodeData.question.title;
	generateOutputLinks(nodeToUpdate, nodeData.question.answers);
	render();
}

function generateOutputLinks(nodeToUpdate, linkAnswers){

	var x = nodeToUpdate.id.split('_')[1],
	y = 0;

	console.log("parentLvl", x);
	x++;

	
	linkAnswers.forEach(function(value){
		console.log('value : ', value);
		var childLvl = 'lvl_'+x+':'+y; //lvl_x:y
		graphic.setNode(childLvl, {id:childLvl, label: 'Click to edit'});
		graphic.setEdge(nodeToUpdate.id, childLvl, {label:value});
		y++;
	});
}