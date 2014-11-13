<?php
/**
 * The template for displaying content of search/archives.
 * @package RestImpo
 * @since RestImpo 1.0.0
*/
?>
<?php global $restimpo_options_db; ?>
    <article <?php post_class('post-entry'); ?>>
        <h2 class="post-entry-headline"><a href="<?php echo get_permalink(); ?>"><?php the_title(); ?></a></h2>
<?php if ( has_post_thumbnail() ) { ?>
        <a href="<?php echo get_permalink(); ?>"><?php the_post_thumbnail(); ?></a>
<?php } ?>
        <div class="post-entry-content"><?php if ( $restimpo_options_db['restimpo_content_archives'] != 'Excerpt' ) { ?><?php global $more; $more = 0; ?><?php the_content(); ?><?php } else { the_excerpt(); } ?></div>
<?php if ( $restimpo_options_db['restimpo_display_meta_post'] != 'Hide' ) { ?>
        <p class="post-info">
          <span class="post-info-alignleft">
            <span class="post-info-author"><?php the_author_posts_link(); ?></span>
            <span class="post-info-date"><a href="<?php echo get_permalink(); ?>"><?php echo get_the_date(); ?></a></span>
<?php if ( has_category() )  { ?>
            <span class="post-info-category"><?php the_category(', '); ?></span><?php the_tags( '<span class="post-info-tags">', ', ', '</span>' ); ?>
<?php } ?>
<?php if ( comments_open() ) : ?>
            <span class="post-info-comments"><a href="<?php comments_link(); ?>"><?php comments_number( '0', '1', '%' ); ?></a></span>
<?php endif; ?>
          </span>
          <a class="read-more" href="<?php echo get_permalink(); ?>"><?php _e( 'Read more &gt;', 'restimpo' ); ?></a>
        </p>
<?php } ?>
    </article>