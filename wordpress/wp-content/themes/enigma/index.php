<?php get_header();
get_template_part('breadcrums'); ?>
<div class="container">	
	<div class="row enigma_blog_wrapper">
	<div class="col-md-8">
	<?php 	if ( have_posts()) : 
			$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
			$args = array( 'post_type' => 'post','paged'=>$paged);		
			$post_type = new WP_Query( $args );
			while($post_type->have_posts()):
			$post_type->the_post(); ?>
		
		<?php get_template_part('post','content'); ?>		
		
		<?php  endwhile; 
		endif; ?>
		<!-- Pagination -->
		<?php weblizar_pagination($post_type->max_num_pages) ; ?>
		
		<!-- //Pagination -->	
	</div>	
	<?php get_sidebar(); ?>
	<!--- row div end here -->
	</div>
</div><!-- container div end here -->
<?php get_footer(); ?>