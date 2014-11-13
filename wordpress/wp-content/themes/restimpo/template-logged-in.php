<?php
/**
 * Template Name: Logged In
 * The template file for displaying the page content only for logged in users.
 * @package RestImpo
 * @since RestImpo 1.1.4
*/
get_header(); ?>

<div id="wrapper-content">
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
  <div class="content-headline-wrapper">
    <div class="content-headline">
      <h1><?php the_title(); ?></h1>
    </div>
  </div>
  <div class="container">
  <div id="main-content">
    <article id="content">
<?php if ( is_user_logged_in() ) { ?>
      <div class="post-thumbnail"><?php restimpo_get_display_image_page(); ?></div> 
      <div class="entry-content">
<?php the_content(); ?>
<?php edit_post_link( __( '(Edit)', 'restimpo' ), '<p>', '</p>' ); ?>
      </div>
<?php } else { ?>
<p class="logged-in-message"><?php _e( 'You must be logged in to view this page.', 'restimpo' ); ?></p>
<?php wp_login_form(); } ?>
<?php endwhile; endif; ?>
<?php if ( is_user_logged_in() ) { ?>
<?php comments_template( '', true ); ?>
<?php } ?>
    </article> <!-- end of content -->
  </div>
<?php get_sidebar(); ?>
  </div>
</div>     <!-- end of wrapper-content -->
<?php get_footer(); ?>