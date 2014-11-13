<?php
/**
 * The 404 page (Not Found) template file.
 * @package RestImpo
 * @since RestImpo 1.0.0
*/
get_header(); ?>

<div id="wrapper-content">
  <div class="content-headline-wrapper">
    <div class="content-headline">
      <h1><?php _e( 'Nothing Found', 'restimpo' ); ?></h1>
    </div>
  </div>
  <div class="container">
  <div id="main-content">
    <article id="content"> 
      <div class="entry-content">
        <p><?php _e( 'Apologies, but no results were found for your request. Perhaps searching will help you to find a related content.', 'restimpo' ); ?></p><?php get_search_form(); ?>
      </div>
    </article> <!-- end of content -->
  </div>
<?php get_sidebar(); ?>
  </div>
</div>     <!-- end of wrapper-content -->
<?php get_footer(); ?>