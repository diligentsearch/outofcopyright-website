<?php
/**
 * Template Name: Diagramm editor
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
get_header(); ?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
            <script>
                var g;
                var svg ,centerG, zoomG;
                var country;
                var languageChoosen;
                var typeOfWork;

                $(function(){
                    country = getUrlVars()["country"];

                    languageChoosen = getUrlVars()["language"];

                    typeOfWork = getUrlVars()["typeOfWork"];

                    $.post( "/node", { country: country, name: country+".json", action: 'read' } )
                    .done(function( data ) {
                        file = data;
                        $.post( "/node", { country: country, name: languageChoosen+".json", action: 'read' } )
                        .done(function( dataTrad ) {
                            traductionData = dataTrad;
                            loadTypeOfWork();
                        });
                    });
                });

                

                function loadTypeOfWork(){

                    var typeOfWorkSelected = file.subgraph[typeOfWork].graphName;
           
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
                    
                }

            </script>
            <svg id='drawSvg' style=" margin-left: 20px;width: 800px; height: 800px;"></svg>
            <!-- Include all compiled plugins (below), or include individual files as needed -->
            <script src="js/bootstrap.min.js"></script>
        </div><!-- #content -->
    </div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();
