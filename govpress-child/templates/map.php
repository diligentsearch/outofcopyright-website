<?php
/**
 * Template Name: Map
 *
 * @package WordPress
 * @subpackage govpress
 * @since govpress 1.0
 */
get_header(); 

$location = get_stylesheet_directory_uri();
$key_map = get_post_meta( get_the_ID(), 'map', true );
$key_color = get_post_meta( get_the_ID(), 'color', true );
if ($key_color == "") { 
	$key_color = "['rgb(255,255,255)','rgb(250,170,0)','rgb(0,109,145)']";
}
                
?>

<div id="primary" class="content-area">
	<div id="content" class="site-content" role="main">
		<h1 style="font-size: 25px;"><?php echo the_title(); ?></h1>

		<div class="entry-content">
			<?php if ( have_posts() ) : while ( have_posts() ) : the_post();
				the_content();
				endwhile;
			endif; ?>
		
			<!-- Map -->
			<div class="col-width" style="margin-bottom:1em;">
				<div id="map" style="background-color: #FFFFFF; width: 60%; height: 500px; border: 1px solid #898989; margin: 0 0 1em 0; float:left;"></div>
					<div id="map-tooltip" style="height:auto;float: right;width: 40%;padding:1em;"></div>
			</div>	
			<link rel="stylesheet" href="<?php echo $location?>/lib/css/simple-map-d3.css">
			<script type="text/javascript" src="<?php echo $location?>/lib/js/jquery/jquery.min.js"></script>
			<script type="text/javascript" src="<?php echo $location?>/lib/js/d3/d3.min.js"></script>
			<script type="text/javascript" src="<?php echo $location?>/lib/js/topojson/topojson.js"></script>
			<script type="text/javascript" src="<?php echo $location?>/lib/js/simple-map-d3/simple-map-d3.js"></script>
			<script type="text/javascript">
				(function($) {
					$(document).ready(function() {
						var europePopMap = SimpleMapD3({
							container: '#map',
							datasource: 'https://rawgit.com/outofcopyright/outofcopyright-maps/master/<?php echo $key_map; ?>.json',
							colorSet:  <?php echo $key_color; ?>,
							colorProperty: 'scale',
							colorScale: 'ordinal',
							colorOn: true,
							colorReverse: false,
							legendOn: false,
							projection: 'conicConformal',
							stylesBackground: 'background-color: #FFF;',
							canvasDragOn: true,
						
							tooltipContent: function(d) {
								var p = d.properties;
								if (p.result != "") {
									document.getElementById("map-tooltip").innerHTML = '<h2>' + p.country + '</h2>' + "<p>" + p.result + "</p>" + "<p>" + p.value + "</p>";
								} else {
									document.getElementById("map-tooltip").innerHTML = '<h2>' + p.country + '</h2>' + "<p>" + p.value + "</p>";
								}
							}
						});
					});
				})(jQuery);
			</script>
			<!-- END Map -->
		</div><!-- .entry-content -->	
	</div><!-- #content -->
</div><!-- #primary -->

<?php

get_footer();
