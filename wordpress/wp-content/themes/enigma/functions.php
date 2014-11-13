<?php /*	*Theme Name	: Enigma
	*Theme Core Functions and Codes
*/
	/**Includes required resources here**/
	define('WL_TEMPLATE_DIR_URI', get_template_directory_uri());
	define('WL_TEMPLATE_DIR', get_template_directory());
	define('WL_TEMPLATE_DIR_CORE' , WL_TEMPLATE_DIR . '/core');
	
	require( WL_TEMPLATE_DIR_CORE . '/menu/wp_bootstrap_navwalker.php' );
	require( WL_TEMPLATE_DIR_CORE . '/scripts/css_js.php' ); //Enquiring Resources here	
	require( WL_TEMPLATE_DIR_CORE . '/image_crop.php'); //Resize Images
	require( WL_TEMPLATE_DIR_CORE . '/comment-function.php' );
	require( WL_TEMPLATE_DIR_CORE . '/flickr-widget.php' );
	
	//Sane Defaults
	function weblizar_default_settings()
{
	$ImageUrl = WL_TEMPLATE_DIR_URI ."/images/1.png";
	$ImageUrl2 = WL_TEMPLATE_DIR_URI ."/images/2.png";
	$ImageUrl3 = WL_TEMPLATE_DIR_URI ."/images/3.png";
	$ImageUrl4 = WL_TEMPLATE_DIR_URI ."/images/portfolio1.png";
	$ImageUrl5 = WL_TEMPLATE_DIR_URI ."/images/portfolio2.png";
	$ImageUrl6 = WL_TEMPLATE_DIR_URI ."/images/portfolio3.png";
	$ImageUrl7 = WL_TEMPLATE_DIR_URI ."/images/portfolio4.png";
	$ImageUrl8 = WL_TEMPLATE_DIR_URI ."/images/portfolio5.png";
	$ImageUrl9 = WL_TEMPLATE_DIR_URI ."/images/portfolio6.png";
	$wl_theme_options=array(
			//Logo and Fevicon header			
			'upload_image_logo'=>'',
			'height'=>'55',
			'width'=>'150',
			'text_title'=>'off',
			'upload_image_favicon'=>'',			
			'custom_css'=>'',
			'slide_image_1' => $ImageUrl,
			'slide_title_1' => 'Slide Title',
			'slide_desc_1' => 'tudi v priljubljenih programih za namizno založništvo kot',
			'slide_btn_text_1' => 'Read More',
			'slide_btn_link_1' => '#',
			'slide_image_2' => $ImageUrl2,
			'slide_title_2' => 'Lorem Ipsuma',
			'slide_desc_2' => 'kombinacijo znakov neznani tiskar združil v vzorčno',
			'slide_btn_text_2' => 'Read More',
			'slide_btn_link_2' => '#',
			'slide_image_3' => $ImageUrl3,
			'slide_title_3' => ' zgolj naključno e',
			'slide_desc_3' => 'nenačrtovano ali namenoma, z različnimi š',
			'slide_btn_text_3' => 'Read More',
			'slide_btn_link_3' => '#',			
			'blog_title'=>'Latest Blog',			
			'fc_title' => 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ',
			'fc_btn_txt' => 'More Features',
			'fc_btn_link' =>'#',
			//Social media links
			'header_social_media_in_enabled'=>'on',
			'footer_section_social_media_enbled'=>'on',
			'twitter_link' =>"https://twitter.com/",
			'fb_link' =>"https://facebook.com",
			'linkedin_link' =>"http://linkedin.com/",
			'youtube_link' =>"https://youtube.com/",
			
			'email_id' => 'enigma@mymail.com',
			'phone_no' => '0159753586',
			'footer_customizations' => ' &#169; 2014 Enigma Theme',
			'developed_by_text' => 'Theme Developed By',
			'developed_by_weblizar_text' => 'Weblizar Themes',
			'developed_by_link' => 'http://weblizar.com/',
			
			'home_service_heading' => 'Our Services',
			'service_1_title'=>"Idea",
			'service_1_icons'=>"fa fa-google",
			'service_1_text'=>"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in.",
			'service_1_link'=>"#",
			
			'service_2_title'=>"Records",
			'service_2_icons'=>"fa fa-database",
			'service_2_text'=>"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in.",
			'service_2_link'=>"#",
			
			'service_3_title'=>"WordPress",
			'service_3_icons'=>"fa fa-wordpress",
			'service_3_text'=>"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in.",
			'service_3_link'=>"#",			

			//Portfolio Settings:
			'portfolio_home'=>'on',
			'port_heading' => 'Recent Works',
			'port_1_img'=> $ImageUrl4,
			'port_1_title'=>'modsætning',
			'port_1_link'=>'#',
			'port_2_img'=> $ImageUrl5,			
			'port_2_title'=>'udgaver',
			'port_2_link'=>'#',
			'port_3_img'=> $ImageUrl6,
			'port_3_title'=>'udgaver',
			'port_3_link'=>'#',
			'port_4_img'=> $ImageUrl7,
			'port_4_title'=>'udgaver',
			'port_4_link'=>'#'
			
		);
		return apply_filters( 'enigma_options', $wl_theme_options );
}
	function weblizar_get_options() {
    // Options API
    return wp_parse_args( 
        get_option( 'enigma_options', array() ), 
        weblizar_default_settings() 
    );    
	}
	//wp title tag starts here
	function weblizar_head( $title, $sep )
	{	global $paged, $page;		
		if ( is_feed() )
			return $title;
		// Add the site name.
		$title .= get_bloginfo( 'name' );
		// Add the site description for the home/front page.
		$site_description = get_bloginfo( 'description' );
		if ( $site_description && ( is_home() || is_front_page() ) )
			$title = "$title $sep $site_description";
		// Add a page number if necessary.
		if ( $paged >= 2 || $page >= 2 )
			$title = "$title $sep " . sprintf( _e( 'Page', 'weblizar' ), max( $paged, $page ) );
		return $title;
	}	
	add_filter( 'wp_title', 'weblizar_head', 10,2 );
	/*After Theme Setup*/
	add_action( 'after_setup_theme', 'weblizar_head_setup' ); 	
	function weblizar_head_setup()
	{	
		global $content_width;
		//content width
		if ( ! isset( $content_width ) ) $content_width = 550; //px
	
		// Load text domain for translation-ready
		load_theme_textdomain( 'weblizar', WL_TEMPLATE_DIR_CORE . '/lang' );	
		
		add_theme_support( 'post-thumbnails' ); //supports featured image
		// This theme uses wp_nav_menu() in one location.
		register_nav_menu( 'primary', __( 'Primary Menu', 'weblizar' ) );
		// theme support 	
		$args = array('default-color' => '000000',);
		add_theme_support( 'custom-background', $args); 
		add_theme_support( 'automatic-feed-links'); 
		require_once('options-reset.php');//Reset Theme Options Here
		require( WL_TEMPLATE_DIR_CORE . '/theme-options/option-panel.php' ); // for Options Panel		
	}
	

	// Read more tag to formatting in blog page 
	function weblizar_content_more($more)
	{  global $post;							
	   return '<div class="blog-post-details-item"><a class="enigma_blog_read_btn" href="'.get_permalink().'"><i class="fa fa-plus-circle"></i>Read More</a></div>';
	}   
	add_filter( 'the_content_more_link', 'weblizar_content_more' );
	
	
	// Replaces the excerpt "more" text by a link
	function weblizar_excerpt_more($more) {
       global $post;
	return '';
	}
	add_filter('excerpt_more', 'weblizar_excerpt_more');
	/*
	* Weblizar widget area
	*/
	add_action( 'widgets_init', 'weblizar_widgets_init');
	function weblizar_widgets_init() {
	/*sidebar*/
	register_sidebar( array(
			'name' => __( 'Sidebar', 'weblizar' ),
			'id' => 'sidebar-primary',
			'description' => __( 'The primary widget area', 'weblizar' ),
			'before_widget' => '<div class="enigma_sidebar_widget">',
			'after_widget' => '</div>',
			'before_title' => '<div class="enigma_sidebar_widget_title"><h2>',
			'after_title' => '</h2></div>'
		) );

	register_sidebar( array(
			'name' => __( 'Footer Widget Area', 'weblizar' ),
			'id' => 'footer-widget-area',
			'description' => __( 'footer widget area', 'weblizar' ),
			'before_widget' => '<div class="col-md-3 col-sm-6 enigma_footer_widget_column">',
			'after_widget' => '</div>',
			'before_title' => '<h3 class="enigma_footer_widget_title">',
			'after_title' => '<div id="" class="enigma-footer-separator"></div></h3>',
		) );             
	}
	
	/* Breadcrumbs  */
	function weblizar_breadcrumbs() {
    $delimiter = '';
    $home = 'Home'; // text for the 'Home' link
    $before = '<li>'; // tag before the current crumb
    $after = '</li>'; // tag after the current crumb
    echo '<ul class="breadcrumb">';
    global $post;
    $homeLink = home_url();
    echo '<li><a href="' . $homeLink . '">' . $home . '</a></li>' . $delimiter . ' ';
    if (is_category()) {
        global $wp_query;
        $cat_obj = $wp_query->get_queried_object();
        $thisCat = $cat_obj->term_id;
        $thisCat = get_category($thisCat);
        $parentCat = get_category($thisCat->parent);
        if ($thisCat->parent != 0)
            echo(get_category_parents($parentCat, TRUE, ' ' . $delimiter . ' '));
        echo $before . 'Archive by category "' . single_cat_title('', false) . '"' . $after;
    } elseif (is_day()) {
        echo '<li><a href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a></li> ' . $delimiter . ' ';
        echo '<li><a href="' . get_month_link(get_the_time('Y'), get_the_time('m')) . '">' . get_the_time('F') . '</a></li> ' . $delimiter . ' ';
        echo $before . get_the_time('d') . $after;
    } elseif (is_month()) {
        echo '<li><a href="' . get_year_link(get_the_time('Y')) . '">' . get_the_time('Y') . '</a></li> ' . $delimiter . ' ';
        echo $before . get_the_time('F') . $after;
    } elseif (is_year()) {
        echo $before . get_the_time('Y') . $after;
    } elseif (is_single() && !is_attachment()) {
        if (get_post_type() != 'post') {
            $post_type = get_post_type_object(get_post_type());
            $slug = $post_type->rewrite;
            echo '<li><a href="' . $homeLink . '/' . $slug['slug'] . '/">' . $post_type->labels->singular_name . '</a></li> ' . $delimiter . ' ';
            echo $before . get_the_title() . $after;
        } else {
            $cat = get_the_category();
            $cat = $cat[0];
            //echo get_category_parents($cat, TRUE, ' ' . $delimiter . ' ');
            echo $before . get_the_title() . $after;
        }
    } elseif (!is_single() && !is_page() && get_post_type() != 'post') {
        $post_type = get_post_type_object(get_post_type());
        echo $before . $post_type->labels->singular_name . $after;
    } elseif (is_attachment()) {
        $parent = get_post($post->post_parent);
        $cat = get_the_category($parent->ID);
        $cat = $cat[0];
        echo get_category_parents($cat, TRUE, ' ' . $delimiter . ' ');
        echo '<li><a href="' . get_permalink($parent) . '">' . $parent->post_title . '</a></li> ' . $delimiter . ' ';
        echo $before . get_the_title() . $after;
    } elseif (is_page() && !$post->post_parent) {
        echo $before . get_the_title() . $after;
    } elseif (is_page() && $post->post_parent) {
        $parent_id = $post->post_parent;
        $breadcrumbs = array();
        while ($parent_id) {
            $page = get_page($parent_id);
            $breadcrumbs[] = '<li><a href="' . get_permalink($page->ID) . '">' . get_the_title($page->ID) . '</a></li>';
            $parent_id = $page->post_parent;
        }
        $breadcrumbs = array_reverse($breadcrumbs);
        foreach ($breadcrumbs as $crumb)
            echo $crumb . ' ' . $delimiter . ' ';
        echo $before . get_the_title() . $after;
    } elseif (is_search()) {
        echo $before . 'Search results for "' . get_search_query() . '"' . $after;
    } elseif (is_tag()) {
        echo $before . 'Posts tagged "' . single_tag_title('', false) . '"' . $after;
    } elseif (is_author()) {
        global $author;
        $userdata = get_userdata($author);
        echo $before . 'Articles posted by ' . $userdata->display_name . $after;
    } elseif (is_404()) {
        echo $before . 'Error 404' . $after;
    }
    if (get_query_var('paged')) {
        if (is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author())
            echo ' (';
        //echo __('Page', 'weblizar') . ' ' . get_query_var('paged');
        if (is_category() || is_day() || is_month() || is_year() || is_search() || is_tag() || is_author())
            echo ')';
    }
    echo '</ul>';
	}
	
	
	//PAGINATION
		function weblizar_pagination($pages = '', $range = 2)
{  
     $showitems = ($range * 2)+1;  

     global $paged;
     if(empty($paged)) $paged = 1;

     if($pages == '')
     {
         global $wp_query;
         $pages = $wp_query->max_num_pages;
         if(!$pages)
         {
             $pages = 1;
         }
     }   

     if(1 != $pages)
     {
         echo "<div class='enigma_blog_pagination'><div class='enigma_blog_pagi'>";
         if($paged > 2 && $paged > $range+1 && $showitems < $pages) echo "<a href='".get_pagenum_link(1)."'>&laquo;</a>";
         if($paged > 1 && $showitems < $pages) echo "<a href='".get_pagenum_link($paged - 1)."'>&lsaquo;</a>";

         for ($i=1; $i <= $pages; $i++)
         {
             if (1 != $pages &&( !($i >= $paged+$range+1 || $i <= $paged-$range-1) || $pages <= $showitems ))
             {
                echo ($paged == $i)? "<a class='active'>".$i."</a>":"<a href='".get_pagenum_link($i)."'>".$i."</a>";
             }
         }

         if ($paged < $pages && $showitems < $pages) echo "<a href='".get_pagenum_link($paged + 1)."'>&rsaquo;</a>";  
         if ($paged < $pages-1 &&  $paged+$range-1 < $pages && $showitems < $pages) echo "<a href='".get_pagenum_link($pages)."'>&raquo;</a>";
         echo "</div></div>";
     }
}
	/*===================================================================================
	* Add Author Links
	* =================================================================================*/
	function weblizar_author_profile( $contactmethods ) {	
	
	$contactmethods['youtube_profile'] = 'Youtube Profile URL';	
	$contactmethods['twitter_profile'] = 'Twitter Profile URL';
	$contactmethods['facebook_profile'] = 'Facebook Profile URL';
	$contactmethods['linkedin_profile'] = 'Linkedin Profile URL';
	
	return $contactmethods;
	}
	add_filter( 'user_contactmethods', 'weblizar_author_profile', 10, 1);
	/*===================================================================================
	* Add Class Gravtar
	* =================================================================================*/
	add_filter('get_avatar','weblizar_gravatar_class');

	function weblizar_gravatar_class($class) {
    $class = str_replace("class='avatar", "class='author_detail_img", $class);
    return $class;
	}	
	/****--- Navigation for Author, Category , Tag , Archive ---***/
	function weblizar_navigation() { ?>
	<div class="enigma_blog_pagination">
	<div class="enigma_blog_pagi">
	<?php posts_nav_link(); ?>
	</div>
	</div>
	<?php }	
?>