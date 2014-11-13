<!-- enigma Callout Section -->
<?php $wl_theme_options = weblizar_get_options(); ?>
<!-- Footer Widget Secton -->
<div class="enigma_footer_widget_area">	
	<div class="container">
		<div class="row">
			<?php 
			if ( is_active_sidebar( 'footer-widget-area' ) ){ 
				dynamic_sidebar( 'footer-widget-area' );
			} else 
			{ 
			$args = array(
			'before_widget' => '<div class="col-md-3 col-sm-6 enigma_footer_widget_column">',
			'after_widget'  => '</div>',
			'before_title'  => '<h3 class="enigma_footer_widget_title">',
			'after_title'   => '<div id="" class="enigma-footer-separator"></div></h3>' );
			the_widget('WP_Widget_Pages', null, $args);			
			} ?>
		</div>		
	</div>
	
	
</div>

<div class="enigma_footer_area">
		<div class="container">
			<div class="col-md-12">
			<p class="enigma_footer_copyright_info">
			<?php if($wl_theme_options['footer_customizations']) { echo $wl_theme_options['footer_customizations']; }
			if($wl_theme_options['developed_by_text']) { echo "|" .$wl_theme_options['developed_by_text']; } ?>
			<a target="_blank" rel="nofollow" href="<?php if($wl_theme_options['developed_by_link']) { echo $wl_theme_options['developed_by_link']; } ?>"><?php if($wl_theme_options['developed_by_weblizar_text']) { echo $wl_theme_options['developed_by_weblizar_text']; } ?></a></p>
			
			
			<?php if($wl_theme_options['footer_section_social_media_enbled'] == 'on') { ?>
			<div class="enigma_footer_social_div">
				<ul class="social">
					<?php if($wl_theme_options['fb_link']!='') { ?>
					   <li class="facebook" data-toggle="tooltip" data-placement="top" title="Facebook"><a  href="<?php echo esc_url($wl_theme_options['fb_link']); ?>"><i class="fa fa-facebook"></i></a></li>
					<?php } if($wl_theme_options['twitter_link']!='') { ?>
					<li class="twitter" data-toggle="tooltip" data-placement="top" title="Twitter"><a href="<?php echo esc_url($wl_theme_options['twitter_link']) ; ?>"><i class="fa fa-twitter"></i></a></li>				
					<?php } if($wl_theme_options['linkedin_link']!='') { ?>
					<li class="linkedin" data-toggle="tooltip" data-placement="top" title="Linkedin"><a href="<?php echo esc_url($wl_theme_options['linkedin_link']) ; ?>"><i class="fa fa-linkedin"></i></a></li>
					<?php } if($wl_theme_options['youtube_link']!='') { ?>
					<li class="youtube" data-toggle="tooltip" data-placement="top" title="Youtube"><a href="<?php echo esc_url($wl_theme_options['youtube_link']) ; ?>"><i class="fa fa-youtube"></i></a></li>
	                <?php } ?>
					</ul>
			</div>
			<?php } ?>
			</div>		
		</div>		
		<?php if($wl_theme_options['custom_css']) ?>
		<style type="text/css">
			<?php { echo $wl_theme_options['custom_css']; } ?>
		</style>
</div>	
<!-- /Footer Widget Secton -->
</div>
<a href="#" title="Go Top" class="enigma_scrollup" style="display: inline;"><i class="fa fa-chevron-up"></i></a>
<?php wp_footer(); ?>
</body>
</html>