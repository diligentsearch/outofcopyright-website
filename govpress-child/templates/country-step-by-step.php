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
            var actualInput;
            function submit(){

                $(".alert").hide();
                if($("#"+actualInput).val() != ""){
                    var responses = new Object();
                    var errors = [];

                    
                    for(var i = 0; i < inputs.length; i++){
                        $("#"+inputs[i]).hide;
                        if($("#"+inputs[i]).val() != ""){
                            var response = $("#"+inputs[i]).val();
                            eval("responses."+inputs[i]+" = response;");
                        }
                        var trad = getTraduction($("#langues").val(), inputs[i]);
                        errors[inputs[i]] = trad+' missing';
                    }

                    responses = JSON.stringify(responses);
                    var result = walk($( "#typeOfWork" ).val(), responses, 'master');

                    if(result.error == 3){
                        $("#error").html("Response is not a number.");
                        $(".alert-warning").show();
                    }
                    else{
                        if(result.error == 1){
                            console.log(result);
                            $(".questionPart").hide();
                            newQuestion(result.waiting_response);
                            
                        }else{
                            $("#result").html(result);
                            $(".alert-success").show();
                            $(".questionPart").hide();
                        }
                    }
                    
                    $("#next").hide();
                }
                
            }

            function reset(){
                $("#next").hide();
                $("#reset").hide();
                $(".alert-success").hide();
                $("#forms").html("");
                $("#typeOfWork").val("");
                $( "#langues" ).removeAttr("disabled","");
            }

            $(document).on('change','.questionInput',function(){
                changeInput();
            });

            

            function changeInput(){
                if($("#"+actualInput).val() != ""){
                    $("#next").show();
                }else{
                    $("#next").hide();
                }
            }
            
            $(document).on('change','#typeOfWork',function(){
                $("#forms").html("");

                if($("#typeOfWork").val() != ""){
                    $("#langues").prop("disabled", "disabled");
                }else{
                    $( "#langues" ).removeAttr("disabled","");
                }

                if($( "#typeOfWork" ).val() != ""){
                    $.get( "https://rawgit.com/outofcopyright/outofcopyright-files/master/<?php echo $key_country; ?>/"+$("#langues").val()+".json")
                    .done(function( dataTrad ) {
                        traductionData = dataTrad;
                        inputs = getInputs($( "#typeOfWork" ).val());
                        if(inputs.length > 0){
                            newQuestion(inputs[0]);
                        }
                        $("#reset").show();
                    });
                }else{
                    reset();
                }
                
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

                    var lang = getUrlVars()["lang"];
                    if(lang !== undefined){
                        lang = lang.toUpperCase();
                    }else{
                        lang = 'EN';
                    }

                    for(var i = 0; i < file.language.length; i++){
                        $('#langues')
                             .append($("<option></option>")
                             .attr("value",file.language[i].toUpperCase())
                             .text(file.language[i].toUpperCase())); 
                    }
                    if($('#langues').find('option[value="'+lang+'"]').length > 0){
                        $('#langues').find('option[value="'+lang+'"]').prop('selected', true); 
                    }else{
                        $('#langues').find('option[value="'+file.default_language.toUpperCase()+'"]').prop('selected', true); 
                    }
                    
                    changeLangue();
                });

                $('.close').click(function(){
                    $(".alert").hide();
                });
            });

            $(document).on('change','#langues',function(){
                changeLangue();

            });

            function changeLangue(){
                $.get( "https://rawgit.com/outofcopyright/outofcopyright-files/master/<?php echo $key_country; ?>/"+$("#langues").val()+".json")
                .done(function( dataTrad ) {
                    traductionData = dataTrad;
                    console.log("change");
                    $("#labelTypeOfWork").text(getTraduction($("#langues").val(), 'labelTypeOfWork'));
                    $("#labelLangue").text(getTraduction($("#langues").val(), 'labelLangue'));
                });
            }

            function newQuestion(input){
                var trad = getTraduction($("#langues").val(), 'question_'+input);
                var datapoint = getResponseById(input);
                var inputHTML= "";
                actualInput = input;
                switch(datapoint.type) {
                    case 'numeric':
                        inputHTML = '<input type="text" class="col-sm-12 questionInput" name="'+input+'" id="'+input+'" placeholder="'+trad+'" onkeypress="changeInput()"/>';
                        break;
                    case 'list':
                        inputHTML = '<select name="'+input+'" id="'+input+'" class="form-control questionInput" style=" margin-bottom: 15px; ">'
                        inputHTML += '<option value="">Select a response</option>';
                        for(var j = 0; j < datapoint.set.length; j++){
                            inputHTML += '<option value="'+datapoint.set[j]+'">'+getTraduction($("#langues").val(), datapoint.set[j])+'</option>';
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
                $("#next").hide();
            }

            //Récupération des éléments get de l'URL
            function getUrlVars() {
                var vars = {};
                var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
                    vars[key] = value.replace("#", "");;
                });
                return vars;
            }

        </script>
        <h1 style="font-size: 25px;"><?php echo $key_country; ?></h1>
        <br/>
        <h2>Calculate</h2>
        <br/>
        <div class="row margin-left margin-top margin-bottom margin-right">
            <div class="row">
                <div class="col-sm-4">
                    <label class="control-label" id="labelLangue">Langue : </label>
                </div>
                <div class="col-sm-8">
                    <select name="langues" id="langues" class="form-control">
                        <option value="">Select a langue</option>
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-4">
                    <label class="control-label" id="labelTypeOfWork">Type of work : </label>
                </div>
                <div class="col-sm-8">
                    <select name="typeOfWork" id="typeOfWork" class="form-control">
                        <option value="">Select type of work</option>
                    </select>
                </div>
            </div>
            <div id="forms">
            </div>
            <div class="row">
                <div class="col-sm-4">
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
            <div class="alert alert-dismissable alert-warning margin-top" style="display:none;">
                <button type="button" class="close" data-dismiss="alert">×</button>
                <h4>Warning!</h4>
                <p id="error"></p>
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
