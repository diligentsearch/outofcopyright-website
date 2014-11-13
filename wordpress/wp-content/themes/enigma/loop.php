<div class="isotope " id="isotope-blog-container">
		<?php 	if ( have_posts()) : 
				$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
				$args = array( 'post_type' => 'post','paged'=>$paged);		
				$post_type_data = new WP_Query( $args );
				while($post_type_data->have_posts()):
				$post_type_data->the_post(); 
				$i='6';
				if(is_page_template('blog-2c.php') || is_page_template('blog-2c-left') || is_page_template('blog-2c-right')) {
				$i='6';
				} elseif (is_page_template('blog-3c.php')) {
				$i='4';
				} elseif (is_page_template('blog-4c.php')) { 
				$i='3';
				}
				?>				
				<div class="col-md-<?php echo $i ?> col-sm-6 enigma_thumb_blog">
				<div class="enigma_blog_thumb_wrapper">
					<div class="enigma_blog_thumb_wrapper_showcase">
						<?php if(has_post_thumbnail()): 
						$img = array("class" => "enigma_img_responsive");
						the_post_thumbnail('blog_2c_thumb',$img);
						endif; ?>
						<div class="enigma_blog_thumb_wrapper_showcase_overlay">
							<div class="enigma_blog_thumb_wrapper_showcase_overlay_inner ">
								<div class="enigma_blog_thumb_wrapper_showcase_icons">
									<a title="<?php the_title_attribute(); ?>" href="<?php the_permalink(); ?>"><i class="fa fa-link"></i></a>
								</div>
							</div>
						</div>
					</div>
					<h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
					
					<?php if(get_the_tag_list() != '') { ?>
						<p class="enigma_tags"><?php the_tags('Tags :&nbsp;', ', ', '<br />'); ?></p>
					<?php } ?>
					<?php the_excerpt( __( 'Read More' , 'weblizar' ) ); ?>
					<a href="<?php the_permalink(); ?>" class="enigma_blog_read_btn"><i class="fa fa-plus-circle"></i><?php _e('Read More','weblizar'); ?></a>		
					<div class="enigma_blog_thumb_footer">
					<ul class="enigma_blog_thumb_date">
						<li><i class="fa fa-user"></i><a href="<?php echo get_author_posts_url( get_the_author_meta( 'ID' ) ); ?>"><?php echo get_the_author(); ?></a></li>
						<li><i class="fa fa-clock-o"></i><?php echo get_the_date('F d ,Y'); ?></li>
						<li><i class="fa fa-comments-o"></i><?php comments_popup_link( '0', '1', '%', '', '-'); ?></li>
					</ul>
					</div>
				</div>
			</div>
			<?php  endwhile; 
			else : ?>
			<div class="col-md-6 col-sm-6 enigma_thumb_blog">
				<div class="enigma_blog_thumb_wrapper">
					
					<h2><a href="#"><?php _e('No Post','weblizar'); ?></a></h2>
					
					<p class="enigma_tags">
						Tags :&nbsp;
						<a href="#">Dummy</a>
						<a href="#">Dummy-2</a>
					   
					</p>
					<p><?php _e('Add you own post. Thos post will be shown here.','weblizar'); ?></p>
					<a href="#" class="enigma_blog_read_btn"><i class="fa fa-plus-circle"></i><?php _e('Read More','weblizar'); ?></a>
					<div class="enigma_blog_thumb_footer">
						<ul class="enigma_blog_thumb_date">
							<li><i class="fa fa-user"></i><a href="#"><?php _e('By Admin','weblizar'); ?></a></li>
							<li><i class="fa fa-clock-o"></i> <?php _e('November 9. 2013','weblizar'); ?></li>
							<li><i class="fa fa-comments-o"></i><a href="#"><?php _e('10','weblizar'); ?></a></li>
						</ul>
					</div>
				</div>
			</div>
			<?php endif; ?>
			
		</div> <!-- isoptope div end here -->
		
		<div class="push-right">
				<hr class="blog-sep header-sep">
		</div>
		<!-- Pagination -->
		<?php weblizar_pagination($post_type_data->max_num_pages) ; ?>    
		<!-- //Pagination -->