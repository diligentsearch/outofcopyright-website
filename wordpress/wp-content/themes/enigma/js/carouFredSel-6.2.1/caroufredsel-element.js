  var caroufredsel = function () {
				 
			   // jQuery CarouFredSel  For blog
           
                
				
				jQuery('#enigma_blog_section').carouFredSel({
					width: '100%',
                    responsive: true,
                   scroll : {
						items : 1,
						duration : 2000,
						timeoutDuration : 2000
					},
                    circular: true,
					direction: 'left',
                    items: {
						height: 'variable',
                        visible: {
                            min: 1,
                            max: 3
                        },
						
                    },
                     prev: '#port-prev',
                    next: '#port-next',
                    auto: {
                        play: true
                    }
                });
         
			
          
			
			
			   
           
           
				
            
			
		}
		jQuery(window).resize(function () {
                caroufredsel();
            });   
			jQuery(window).load(function () {
                caroufredsel();
            });		