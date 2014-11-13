<?php 
/**
 * Library of Theme options functions.
 * @package RestImpo
 * @since RestImpo 1.0.0
*/

// Display featured images on single posts
function restimpo_get_display_image_post() { 
global $restimpo_options_db;
		if ($restimpo_options_db['restimpo_display_image_post'] == '' || $restimpo_options_db['restimpo_display_image_post'] == 'Display') { ?>
		<?php if ( has_post_thumbnail() ) : ?>
      <?php the_post_thumbnail(); ?>
    <?php endif; ?>
<?php } 
}

// Display featured images on pages
function restimpo_get_display_image_page() { 
global $restimpo_options_db;
		if ($restimpo_options_db['restimpo_display_image_page'] == '' || $restimpo_options_db['restimpo_display_image_page'] == 'Display') { ?>
		<?php if ( has_post_thumbnail() ) : ?>
      <?php the_post_thumbnail(); ?>
    <?php endif; ?>
<?php } 
} ?>