<?php
 if ( function_exists( 'add_image_size' ) ) 
 { 
	/*** slider ***/
	add_image_size('home_slider_thumb',1580,450,true);
	
	/*** portfolio  ***/
	add_image_size('home_portfo_thumb',260,160,true);
	
	//Home Thumb
	add_image_size('home_post_thumb',340,210,true);
		
	//Blogs thumbs
	add_image_size('wl_page_thumb',730,350,true);	
	add_image_size('blog_2c_thumb',570,350,true); //2-Column
		
}
// code for image resize for according to image layout
add_filter( 'intermediate_image_sizes', 'weblizar_image_presets');
function weblizar_image_presets($sizes){
   $type = get_post_type($_REQUEST['post_id']);	
    foreach($sizes as $key => $value){		
		if($type=='weblizar_portfolio' && $value != 'home_portfo_thumb')
		{ unset($sizes[$key]);  }
		
		elseif($type=='weblizar_slider' && $value != 'home_slider_thumb')
		{ unset($sizes[$key]);  }
		
		elseif($type=='post' && $value != 'home_post_thumb' && $value != 'blog_2c_thumb' )
		{ unset($sizes[$key]);  }		
		
		elseif($type=='page' && $value != 'wl_page_thumb')
		{ unset($sizes[$key]);  }
		
		elseif($type=='weblizar_team' && $value != 'about_team_thumb')
		{ unset($sizes[$key]);  }		
		
		}		
    return $sizes;	 
}
?>