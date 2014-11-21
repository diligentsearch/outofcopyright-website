<?php
/**
 * Template Name: Country
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
                }else{
                    $("#result").html(result);
                    $(".alert-success").show();
                }

                console.log(result);
            }
            $(document).on('change','#typeOfWork',function(){
                $.get( "https://rawgit.com/outofcopyright/outofcopyright-files/master/<?php echo $key_country; ?>/"+file.default_language+".json")
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
                $("#secondary").hide();
                $.get( "https://rawgit.com/outofcopyright/outofcopyright-files/master/<?php echo $key_country; ?>/<?php echo $key_country; ?>.json")
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
                $('.close').click(function(){
                    $(".alert").hide();
                });
            });
        </script>
        <h1 style="font-size: 25px;"><?php echo $key_country; ?></h1>
        <br/>
        <h2>Calculate</h2>
        <br/>
        <div class="row margin-left margin-top margin-bottom margin-right">
            <div class="row">
                <div class="col-sm-2">
                    <label class="control-label">Type of work : </label>
                </div>
                <div class="col-sm-10">
                    <select name="typeOfWork" id="typeOfWork" class="form-control">
                        <option value="">Select type of work</option>
                    </select>
                </div>
            </div>
            <div id="forms">
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <input type="button" name="submit" value="Submit" class="btn btn-primary" onclick="submit();" />
                </div>
            </div>
            <div class="alert alert-dismissable alert-warning margin-top" style="display:none;">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <h4>Warning!</h4>
                <p id="error"></p>
            </div>
            <div class="alert alert-dismissable alert-success margin-top" style="display:none;">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <p id="result"></p>
            </div>
            <div class="alert alert-dismissable alert-danger margin-top" style="display:none;">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <p id="resultdanger"></p>
            </div>
        </div>
        <?php
        if (have_posts()) :
           while (have_posts()) :
              the_post();
                 the_content();
           endwhile;
        endif;
        ?>
		</div><!-- #content -->
       
	</div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();
