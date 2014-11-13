<?php get_header(); 
get_template_part('home','slideshow'); 
get_template_part('home','services'); 
$wl_theme_options = weblizar_get_options();
if($wl_theme_options['portfolio_home'] != "off") {
get_template_part('home','portfolio'); 
}
get_template_part('home','blog'); 
get_footer(); ?>