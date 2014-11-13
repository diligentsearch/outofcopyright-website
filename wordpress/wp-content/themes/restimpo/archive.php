<?php
/**
 * The archive template file.
 * @package RestImpo
 * @since RestImpo 1.0.0
*/
get_header(); ?>

<div id="wrapper-content">
<?php if ( have_posts() ) : ?>
  <div class="content-headline-wrapper">
    <div class="content-headline">
      <h1><?php
					if ( is_day() ) :
						printf( __( 'Daily Archive: %s', 'restimpo' ), '<span>' . get_the_date() . '</span>' );
					elseif ( is_month() ) :
						printf( __( 'Monthly Archive: %s', 'restimpo' ), '<span>' . get_the_date( _x( 'F Y', 'monthly archives date format', 'restimpo' ) ) . '</span>' );
					elseif ( is_year() ) :
						printf( __( 'Yearly Archive: %s', 'restimpo' ), '<span>' . get_the_date( _x( 'Y', 'yearly archives date format', 'restimpo' ) ) . '</span>' );
					else :
						_e( 'Archive', 'restimpo' );
					endif;
				?></h1>
    </div>
  </div>
  <div class="container">
  <div id="main-content">
    <div id="content"> 
<?php while (have_posts()) : the_post(); ?>      
<?php get_template_part( 'content', 'archives' ); ?>
<?php endwhile; endif; ?>
<?php restimpo_content_nav( 'nav-below' ); ?>
    </div> <!-- end of content -->
  </div>
<?php get_sidebar(); ?>
  </div>
</div>     <!-- end of wrapper-content -->
<?php get_footer(); ?>