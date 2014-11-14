<?php
/**
 * The Header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package GovPress
 */
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) & !(IE 8)]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?php wp_title( '|', true, 'right' ); ?></title>
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<!-- Bootstrap -->
<link href="/www/outofcopyright-website/outofcopyright/css/bootstrap.css" rel="stylesheet">

<link href="/www/outofcopyright-website/outofcopyright/css/design.css" rel="stylesheet">
<link rel="stylesheet" href="/www/outofcopyright-website/outofcopyright/css/font-awesome.min.css">

<!-- Javascript library -->
<script src="/www/outofcopyright-website/outofcopyright/librairie/node.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/librairie/control.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/librairie/library.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/librairie/walk.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/librairie/datapoints.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/librairie/traduction.js"></script>

<!-- Draw graph  -->
<script src="//d3js.org/d3.v3.min.js" charset="utf-8"></script>
<script src="/www/outofcopyright-website/outofcopyright/js/dagre-d3.js"></script>

<!-- Javascript -->
<script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/js/timeformater.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/js/formula.js"></script>
<script src="/www/outofcopyright-website/outofcopyright/js/save.js"></script>
<!--[if lt IE 9]>
<script src="<?php echo esc_url( get_template_directory_uri() . '/js/html5.js' ); ?>"></script>
<![endif]-->
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<div id="page" class="hfeed site">

	<?php do_action( 'before' ); ?>

	<nav id="site-navigation" class="main-navigation" role="navigation">
		<div class="col-width">
			<h1 class="menu-toggle"><?php _e( 'Menu', 'govpress' ); ?></h1>
			<a class="skip-link screen-reader-text" href="#content"><?php _e( 'Skip to content', 'govpress' ); ?></a>

			<?php wp_nav_menu( array('theme_location' => 'primary', 'menu_class' => 'nav-menu' ) ); ?>
		</div>
	</nav><!-- #site-navigation -->

	<header id="masthead" class="site-header" role="banner">
		<div class="site-branding col-width">
			<?php if ( get_header_image() ) : ?>
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
					<img src="<?php header_image(); ?>" width="<?php echo get_custom_header()->width; ?>" height="<?php echo get_custom_header()->height; ?>" alt="">
				</a>
			<?php endif; // End header image check. ?>
			<h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
			<h2 class="site-description"><?php bloginfo( 'description' ); ?></h2>
		</div>
	</header><!-- #masthead -->

	<?php if ( is_page_template('templates/home-page.php') ) {
		get_template_part( 'templates/above', 'home-page' );
	} ?>

	<div class="col-width">
		<div id="content" class="site-content">
