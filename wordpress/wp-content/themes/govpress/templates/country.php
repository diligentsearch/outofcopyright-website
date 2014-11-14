<?php
/**
 * Template Name: Countries list
 *
 * @package WordPress
 * @subpackage Twenty_Fourteen
 * @since Twenty Fourteen 1.0
 */
get_header(); 

$key_country = get_post_meta( get_the_ID(), 'country', true );
                
?>

	<div id="primary" class="content-area">
		<div id="content" class="site-content" role="main">
        <script>
            var inputs;
            function submit(){

                $(".alert").hide();

                var responses = new Object();
                var errors = [];

                for(var i = 0; i < inputs.length; i++){
                    if($("#"+inputs[i]).val() != ""){
                        var response = $("#"+inputs[i]).val();
                        eval("responses."+inputs[i]+" = response;");
                    }
                    var trad = getTraduction(file.default_language, inputs[i]);
                    errors[inputs[i]] = trad+' missing';
                }

                responses = JSON.stringify(responses);
                var result = walk($( "#typeOfWork" ).val(), responses);

                if(result.error == 1){
                    $("#error").html(errors[result.waiting_response]);
                    $(".alert-warning").show();
                }
                
                $("#result").html(result);
                $(".alert-success").show();

                console.log(result);
            }
            $(document).on('change','#typeOfWork',function(){
                $.post( "/node", { country: '<?php echo $key_country; ?>', name: file.default_language+'.json', action: 'read' } )
                .done(function( dataTrad ) {
                    traductionData = dataTrad;
                    $( "#forms" ).html('');
                    if($( "#typeOfWork" ).val() != ''){
                        inputs = getInputs($( "#typeOfWork" ).val());
                        console.log(inputs);
                        for(var i = 0; i < inputs.length; i++){
                            var trad = getTraduction(file.default_language, 'question_'+inputs[i]);
                            var datapoint = getResponseById(inputs[i]);
                            var inputHTML= "";
                            switch(datapoint.type) {
                                case 'numeric':
                                    inputHTML = '<input type="text" class="col-sm-12" name="'+inputs[i]+'" id="'+inputs[i]+'" placeholder="'+trad+'"/>';
                                    break;
                                case 'list':
                                    inputHTML = '<select name="'+inputs[i]+'" id="'+inputs[i]+'" class="form-control">'
                                    inputHTML += '<option value="">Select a response</option>';
                                    for(var j = 0; j < datapoint.set.length; j++){
                                        inputHTML += '<option value="'+datapoint.set[j]+'">'+datapoint.set[j]+'</option>';
                                    }
                                    inputHTML += '</select>';
                                    break;
                                default:
                                    inputHTML = '';
                            } 

                            $("#forms").append('\
                                <div class="row margin-top">\
                                    <div class="col-sm-2">\
                                        <label for="'+inputs[i]+'" class="control-label">'+trad+'</label>\
                                    </div>\
                                    <div class="col-sm-10">\
                                        '+inputHTML+'\
                                    </div>\
                                </div>\
                                ');
                        }
                    }
                });
            });   

            $(function() {
                
                $.post( "/node", { country: '<?php echo $key_country; ?>', name: '<?php echo $key_country; ?>.json', action: 'read' } )
                .done(function( data ) {
                    file = data;



                    //getInputs(id_subgraph);

                    var listSubgraph = getListSubgraph();

                    for(var i = 0; i < listSubgraph.length; i++){
                        $('#typeOfWork')
                             .append($("<option></option>")
                             .attr("value",i)
                             .text(listSubgraph[i])); 
                    }
                });
            });
        </script>

		</div><!-- #content -->
	</div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();
