<?php
/**
 * Template Name: Country step
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
            $(".questionPart").hide();
            for(var i = 0; i < inputs.length; i++){
                $("#"+inputs[i]).hide
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
                console.log(result);
                newQuestion(result.waiting_response);
            }else{
                $("#next").hide();
                $("#result").html(result);
                $(".alert-success").show();
            }
        }

        function reset(){
            $("#next").hide();
            $("#reset").hide();
            $(".alert-success").hide();
            $("#forms").html("");
            $("#typeOfWork").val("");
        }
        
        $(document).on('change','#typeOfWork',function(){
            $("#forms").html("");
            if($( "#typeOfWork" ).val() != ""){
                $.post( "/node", { country: 'Belgium', name: file.default_language+'.json', action: 'read' } )
                .done(function( dataTrad ) {
                    traductionData = dataTrad;
                    inputs = getInputs($( "#typeOfWork" ).val());
                    if(inputs.length > 0){
                        newQuestion(inputs[0]);
                    }
                    $("#next").show();
                    $("#reset").show();
                });
            }else{
                reset();
            }
            
          });   

        $(function() {

            $("#secondary").hide();

            $.post( "/node", { country: 'Belgium', name: 'Belgium.json', action: 'read' } )
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

        function newQuestion(input){
            var trad = getTraduction(file.default_language, 'question_'+input);
            var datapoint = getResponseById(input);
            var inputHTML= "";
            switch(datapoint.type) {
                case 'numeric':
                    inputHTML = '<input type="text" class="col-sm-12" name="'+input+'" id="'+input+'" placeholder="'+trad+'"/>';
                    break;
                case 'list':
                    inputHTML = '<select name="'+input+'" id="'+input+'" class="form-control">'
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
                <div class="row margin-top questionPart">\
                    <div class="col-sm-4">\
                        <label for="'+input+'" class="control-label">'+trad+'</label>\
                    </div>\
                    <div class="col-sm-8">\
                        '+inputHTML+'\
                    </div>\
                </div>\
                ');
        }
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
                <div class="col-sm-2">
                    <input type="button" id="reset" name="submit" value="Reset" class="btn btn-primary" onclick="reset();" style="display:none;" />
                </div>
                <div class="col-sm-2">
                    <input type="button" id="next" name="submit" value="Next" class="btn btn-primary" onclick="submit();" style="display:none;" />
                </div>
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
