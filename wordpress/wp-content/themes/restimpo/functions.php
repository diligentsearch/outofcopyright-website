<?php
/**
 * RestImpo functions and definitions.
 * @package RestImpo
 * @since RestImpo 1.0.0
*/

/**
 * RestImpo theme variables.
 *  
*/    
$restimpo_themename = "RestImpo";			//Theme Name
$restimpo_themever = "1.3.4";					//Theme version
$restimpo_shortname = "restimpo";			//Shortname 
$restimpo_manualurl = get_template_directory_uri() . '/docs/documentation.html';	//Manual Url
// Set path to RestImpo Framework and theme specific functions
$restimpo_be_path = get_template_directory() . '/functions/be/';									//BackEnd Path
$restimpo_fe_path = get_template_directory() . '/functions/fe/';									//FrontEnd Path 
$restimpo_be_pathimages = get_template_directory_uri() . '/functions/be/images';		//BackEnd Path
$restimpo_fe_pathimages = get_template_directory_uri() . '';	//FrontEnd Path
//Include Framework [BE] 
require_once ($restimpo_be_path . 'fw-options.php');	 	 // Framework Init  
// Include Theme specific functionality [FE] 
require_once ($restimpo_fe_path . 'headerdata.php');		 // Include css and js
require_once ($restimpo_fe_path . 'library.php');	       // Include library, functions
require_once ($restimpo_fe_path . 'widget-posts-default.php');// Posts-Default Widget

/**
 * RestImpo theme basic setup.
 *  
*/
function restimpo_setup() {
	// Makes RestImpo available for translation.
	load_theme_textdomain( 'restimpo', get_template_directory() . '/languages' );
  // This theme styles the visual editor to resemble the theme style.
  add_editor_style( 'editor-style.css' );
	// Adds RSS feed links to <head> for posts and comments.  
	add_theme_support( 'automatic-feed-links' );
	// This theme supports custom background color and image.
	$defaults = array(
	'default-color'          => '', 
  'default-image'          => '',
	'wp-head-callback'       => '_custom_background_cb',
	'admin-head-callback'    => '',
	'admin-preview-callback' => '' );  
  add_theme_support( 'custom-background', $defaults );
	// This theme uses a custom image size for featured images, displayed on "standard" posts.
	add_theme_support( 'post-thumbnails' );
	set_post_thumbnail_size( 980, 9999 );
  // This theme uses a custom header background image.
  $args = array(
	'flex-width' => true,
  'flex-height' => true,
  'width' => 1800,
	'default-image' => get_template_directory_uri() . '/images/header.jpg',
  'header-text' => false,
  'random-default' => true,);
  add_theme_support( 'custom-header', $args );
  add_theme_support( 'woocommerce' );
  global $content_width;
  if ( ! isset( $content_width ) ) { $content_width = 690; }
}
add_action( 'after_setup_theme', 'restimpo_setup' );

/**
 * Enqueues scripts and styles for front-end.
 *
*/
function restimpo_scripts_styles() {
	global $wp_styles;
	// Adds JavaScript
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) )
		wp_enqueue_script( 'comment-reply' );
    wp_enqueue_script( 'restimpo-placeholders', get_template_directory_uri() . '/js/placeholders.js', array(), '2.1.0', true );
    wp_enqueue_script( 'restimpo-scroll-to-top', get_template_directory_uri() . '/js/scroll-to-top.js', array( 'jquery' ), '1.0', true );
    wp_enqueue_script( 'restimpo-selectnav', get_template_directory_uri() . '/js/selectnav.js', array(), '0.1', true );
    wp_enqueue_script( 'restimpo-responzive', get_template_directory_uri() . '/js/responzive.js', array(), '1.0', true );
	// Loads the main stylesheet.
	  wp_enqueue_style( 'restimpo-style', get_stylesheet_uri() );
    if ( class_exists( 'woocommerce' ) ) { wp_enqueue_style( 'restimpo-woocommerce-custom', get_template_directory_uri() . '/css/woocommerce-custom.css' ); }
  // Loads additional stylesheet for IE8 and older versions.
    wp_enqueue_style( 'restimpo-style-ie', get_template_directory_uri() . '/css/style-ie.css' );
  // Apply IE conditionals
    $GLOBALS['wp_styles']->add_data( 'restimpo-style-ie', 'conditional', 'lte IE 8' );
}
add_action( 'wp_enqueue_scripts', 'restimpo_scripts_styles' );

/**
 * Creates a nicely formatted and more specific title element text.
 *  
*/
function restimpo_wp_title( $title, $sep ) {
	if ( is_feed() )
		return $title;
	$title .= get_bloginfo( 'name' );
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		$title = "$title $sep $site_description";
	return $title;
}
add_filter( 'wp_title', 'restimpo_wp_title', 10, 2 );

/**
 * Register our menus.
 *
 */
function restimpo_register_my_menus() {
  register_nav_menus(
    array(
      'main-navigation' => __( 'Main Header Menu', 'restimpo' ),
      'top-navigation' => __( 'Top Header Menu', 'restimpo' )
    )
  );
}
add_action( 'after_setup_theme', 'restimpo_register_my_menus' );

/**
 * Register our sidebars and widgetized areas.
 *
*/
function restimpo_widgets_init() {
  register_sidebar( array(
		'name' => __( 'Right Sidebar', 'restimpo' ),
		'id' => 'sidebar-1',
		'description' => __( 'Right sidebar which appears on all posts and pages.', 'restimpo' ),
		'before_widget' => '<div id="%1$s" class="sidebar-widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => ' <p class="sidebar-headline">',
		'after_title' => '</p>',
	) );
  register_sidebar( array(
		'name' => __( 'Footer left widget area', 'restimpo' ),
		'id' => 'sidebar-2',
		'description' => __( 'Left column with widgets in footer.', 'restimpo' ),
		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<p class="footer-headline">',
		'after_title' => '</p>',
	) );
  register_sidebar( array(
		'name' => __( 'Footer middle widget area', 'restimpo' ),
		'id' => 'sidebar-3',
		'description' => __( 'Middle column with widgets in footer.', 'restimpo' ),
		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<p class="footer-headline">',
		'after_title' => '</p>',
	) );
  register_sidebar( array(
		'name' => __( 'Footer right widget area', 'restimpo' ),
		'id' => 'sidebar-4',
		'description' => __( 'Right column with widgets in footer.', 'restimpo' ),
		'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
		'after_widget' => '</div>',
		'before_title' => '<p class="footer-headline">',
		'after_title' => '</p>',
	) );
  register_sidebar( array(
		'name' => __( 'Footer notices', 'restimpo' ),
		'id' => 'sidebar-5',
		'description' => __( 'The line for copyright and other notices below the footer widget areas. Insert here one Text widget. The "Title" field at this widget should stay empty.', 'restimpo' ),
		'before_widget' => '<div class="footer-signature"><div class="footer-signature-content">',
		'after_widget' => '</div></div>',
		'before_title' => '',
		'after_title' => '',
	) );
  register_sidebar( array(
		'name' => __( 'Latest Posts Homepage widget area', 'restimpo' ),
		'id' => 'sidebar-6',
		'description' => __( 'The area for any RestImpo Posts Widgets, which display latest posts from a specific category below the default Latest Posts area.', 'restimpo' ),
		'before_widget' => '',
		'after_widget' => '',
		'before_title' => '',
		'after_title' => '',
	) );
}
add_action( 'widgets_init', 'restimpo_widgets_init' );

/**
 * Post excerpt settings.
 *
*/
function restimpo_custom_excerpt_length( $length ) {
return 30;
}
add_filter( 'excerpt_length', 'restimpo_custom_excerpt_length', 999 );
function restimpo_new_excerpt_more( $more ) {
global $post;
return '... <a class="read-more-button" href="'. esc_url( get_permalink($post->ID) ) . '">' . __( 'Read more &gt;', 'restimpo' ) . '</a>';}
add_filter( 'excerpt_more', 'restimpo_new_excerpt_more' );

if ( ! function_exists( 'restimpo_content_nav' ) ) :
/**
 * Displays navigation to next/previous pages when applicable.
 *
*/
function restimpo_content_nav( $html_id ) {
	global $wp_query;
	$html_id = esc_attr( $html_id );
	if ( $wp_query->max_num_pages > 1 ) : ?>
		<div id="<?php echo $html_id; ?>" class="navigation" role="navigation">
			<h2 class="navigation-headline section-heading"><?php _e( 'Post navigation', 'restimpo' ); ?></h2>
      <div class="nav-wrapper">
			 <p class="navigation-links">
<?php $big = 999999999;
echo paginate_links( array(
	'base' => str_replace( $big, '%#%', esc_url( get_pagenum_link( $big ) ) ),
	'format' => '?paged=%#%',
	'current' => max( 1, get_query_var('paged') ),
  'prev_text' => __( '&larr; Previous', 'restimpo' ),
	'next_text' => __( 'Next &rarr;', 'restimpo' ),
	'total' => $wp_query->max_num_pages
) );
?>
        </p>
      </div>
		</div>
	<?php endif;
}
endif;

/**
 * Displays navigation to next/previous posts on single posts pages.
 *
*/
function restimpo_prev_next($nav_id) { ?>
<?php $restimpo_previous_post = get_adjacent_post( false, "", true );
$restimpo_next_post = get_adjacent_post( false, "", false ); ?>
<div id="<?php echo $nav_id; ?>" class="navigation" role="navigation">
	<div class="nav-wrapper">
<?php if ( !empty($restimpo_previous_post) ) { ?>
  <p class="nav-previous"><a href="<?php echo esc_url(get_permalink($restimpo_previous_post->ID)); ?>" title="<?php echo esc_attr($restimpo_previous_post->post_title); ?>"><?php _e( '&larr; Previous post', 'restimpo' ); ?></a></p>
<?php } if ( !empty($restimpo_next_post) ) { ?>
	<p class="nav-next"><a href="<?php echo esc_url(get_permalink($restimpo_next_post->ID)); ?>" title="<?php echo esc_attr($restimpo_next_post->post_title); ?>"><?php _e( 'Next post &rarr;', 'restimpo' ); ?></a></p>
<?php } ?>
   </div>
</div>
<?php }

if ( ! function_exists( 'restimpo_comment' ) ) :
/**
 * Template for comments and pingbacks.
 *
*/
function restimpo_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	switch ( $comment->comment_type ) :
		case 'pingback' :
		case 'trackback' :
	?>
	<li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
		<p><?php _e( 'Pingback:', 'restimpo' ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( __( '(Edit)', 'restimpo' ), '<span class="edit-link">', '</span>' ); ?></p>
	<?php
			break;
		default :
		global $post;
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
		<div id="comment-<?php comment_ID(); ?>" class="comment">
			<div class="comment-meta comment-author vcard">
				<?php
					echo get_avatar( $comment, 44 );
					printf( '<span><b class="fn">%1$s</b> %2$s</span>',
						get_comment_author_link(),
						( $comment->user_id === $post->post_author ) ? '<span>' . __( '(Post author)', 'restimpo' ) . '</span>' : ''
					);
					printf( '<time datetime="%2$s">%3$s</time>',
						esc_url( get_comment_link( $comment->comment_ID ) ),
						get_comment_time( 'c' ),
						// translators: 1: date, 2: time
						sprintf( __( '%1$s at %2$s', 'restimpo' ), get_comment_date(''), get_comment_time() )
					);
				?>
			</div><!-- .comment-meta -->

			<?php if ( '0' == $comment->comment_approved ) : ?>
				<p class="comment-awaiting-moderation"><?php _e( 'Your comment is awaiting moderation.', 'restimpo' ); ?></p>
			<?php endif; ?>

			<div class="comment-content comment">
				<?php comment_text(); ?>
			 <div class="reply">
			   <?php comment_reply_link( array_merge( $args, array( 'reply_text' => __( 'Reply', 'restimpo' ), 'after' => ' <span>&darr;</span>', 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
			</div><!-- .reply -->
			   <?php edit_comment_link( __( 'Edit', 'restimpo' ), '<p class="edit-link">', '</p>' ); ?>
			</div><!-- .comment-content -->
		</div><!-- #comment-## -->
	<?php
		break;
	endswitch;
}
endif;

/**
 * Function for rendering CSS3 features in IE.
 *
*/
add_filter( 'wp_head' , 'restimpo_pie' );
function restimpo_pie() { ?>
<!--[if IE]>
<style type="text/css" media="screen">
.header-content-wrapper, input[type="submit"], input[type="reset"], .custom-button, .header-image .header-image-text .header-image-link {
        behavior: url("<?php echo get_template_directory_uri() . '/css/pie/PIE.php'; ?>");
        zoom: 1;
}
</style>
<![endif]-->
<?php }

/**
 * Function for adding custom classes to the menu objects.
 *
*/
add_filter( 'wp_nav_menu_objects', 'restimpo_filter_menu_class', 10, 2 );
function restimpo_filter_menu_class( $objects, $args ) {

    $ids        = array();
    $parent_ids = array();
    $top_ids    = array();
    foreach ( $objects as $i => $object ) {

        if ( 0 == $object->menu_item_parent ) {
            $top_ids[$i] = $object;
            continue;
        }
 
        if ( ! in_array( $object->menu_item_parent, $ids ) ) {
            $objects[$i]->classes[] = 'first-menu-item';
            $ids[]          = $object->menu_item_parent;
        }
 
        if ( in_array( 'first-menu-item', $object->classes ) )
            continue;
 
        $parent_ids[$i] = $object->menu_item_parent;
    }
 
    $sanitized_parent_ids = array_unique( array_reverse( $parent_ids, true ) );
 
    foreach ( $sanitized_parent_ids as $i => $id )
        $objects[$i]->classes[] = 'last-menu-item';
 
    return $objects; 
}

/**
 * WooCommerce custom template modifications.
 *  
*/
if ( in_array( 'woocommerce/woocommerce.php', apply_filters( 'active_plugins', get_option( 'active_plugins' ) ) ) ) {
function restimpo_woocommerce_modifications() {
  remove_action ( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 ); 
}  
add_action ( 'init', 'restimpo_woocommerce_modifications' );
add_filter ( 'woocommerce_show_page_title', '__return_false' );
} ?>