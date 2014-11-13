<?php
/**
 * The sidebar template file.
 * @package RestImpo
 * @since RestImpo 1.0.0
*/
?>
<?php global $restimpo_options_db; ?>
<?php if ($restimpo_options_db['restimpo_display_sidebar'] != 'Hide'){ ?>
<aside id="sidebar">
<?php if ( dynamic_sidebar( 'sidebar-1' ) ) : else : ?>
<?php endif; ?>
</aside> <!-- end of sidebar -->
<?php } ?>