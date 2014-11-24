<?php
/**
 * Template Name: Map
 *
 * @package WordPress
 * @subpackage govpress
 * @since govpress 1.0
 */
get_header(); 

$key_country = get_post_meta( get_the_ID(), 'country', true );
$location = get_stylesheet_directory_uri();
$key_map = get_post_meta( get_the_ID(), 'map', true );
                
?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
        <h1 style="font-size: 25px;"><?php echo the_title(); ?></h1>
		
		<!-- Map -->
		<div class="col-width" style="margin-bottom:1em;">
			<div id="map" style="background-color: #FFFFFF; width: 100%; height: 500px; border: 1px solid #898989; margin: 0 0 1em 0;"></div>
			<div id="map-tooltip" style="height:auto"></div>
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
					  colorSet:  ['rgb(250,170,0)','rgb(0,109,145)','rgb(255,255,255)'],
					  colorProperty: 'scale',
					  colorScale: 'ordinal',
					  colorOn: true,
					  legendOn: false,
					  colorProperty: 'scale',
					  colorReverse: true,
					  projection: 'conicConformal',
					  stylesBackground: 'background-color: #FFF;',
					  canvasDragOn: true,

					  tooltipContent: function(d) {
						  var p = d.properties;
						  document.getElementById("map-tooltip").innerHTML = '<h5>' + p.country + '</h5>' + "<p>" + p.result + "</p>" + "<p>" + p.value + "</p>";


					  }
				  });


			  });
		  })(jQuery);
		</script>
		<!-- END Map -->
       <div class="col-width clear"> 
        <?php
        if (have_posts()) :
           while (have_posts()) :
              the_post();
                 the_content();
           endwhile;
        endif;
        ?>
    </div> <!-- colwidth -->
		</div><!-- #content -->
       
	</div><!-- #primary -->

<?php

get_footer();
