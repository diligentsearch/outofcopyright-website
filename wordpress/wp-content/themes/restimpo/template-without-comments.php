<?php
/**
 * Template Name: Page without Comments
 * The template file for pages without the comments section.
 * @package RestImpo
 * @since RestImpo 1.1.5
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
      <div class="post-thumbnail"><?php restimpo_get_display_image_page(); ?></div> 
      <div class="entry-content">
<?php the_content(); ?>
<?php edit_post_link( __( '(Edit)', 'restimpo' ), '<p>', '</p>' ); ?>
      </div>
<?php endwhile; endif; ?>
    </article> <!-- end of content -->
  </div>
<?php get_sidebar(); ?>
  </div>
</div>     <!-- end of wrapper-content -->
<?php get_footer(); ?>