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
                    var trad = getTraduction($("#langues").val(), inputs[i]);
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
                $.get( "https://rawgit.com/outofcopyright/outofcopyright-files/master/<?php echo $key_country; ?>/"+$("#langues").val()+".json")
                .done(function( dataTrad ) {
                    traductionData = dataTrad;
                    chargeForms();
                });
            }); 

            function chargeForms(){
                $( "#forms" ).html('');
                if($( "#typeOfWork" ).val() != ''){
                    inputs = getInputs($( "#typeOfWork" ).val());
                    console.log(inputs);
                    for(var i = 0; i < inputs.length; i++){
                        var trad = getTraduction($("#langues").val(), 'question_'+inputs[i]);
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
                                <div class="col-sm-4">\
                                    <label for="'+inputs[i]+'" class="control-label">'+trad+'</label>\
                                </div>\
                                <div class="col-sm-8">\
                                    '+inputHTML+'\
                                </div>\
                            </div>\
                            ');
                    }
                }
            }

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
                $("#waitingPart").show();
                $("#calculatorPart").hide();
                changeLangue();
                chargeForms();

            });

            function changeLangue(){
                $.post( "/node", { country: 'Belgium', name: $("#langues").val()+'.json', action: 'read', branch: 'master' } )
                .done(function( dataTrad ) {
                    traductionData = dataTrad;
                    console.log("change");
                    $("#labelTypeOfWork").text(getTraduction($("#langues").val(), 'labelTypeOfWork'));
                    $("#labelLangue").text(getTraduction($("#langues").val(), 'labelLangue'));
                    $("#waitingPart").hide();
                    $("#calculatorPart").show();
                });
                

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
        <div class="row margin-left margin-top margin-bottom margin-right" id="calculatorPart" style="display:none;">
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
        <div id="waitingPart">
            <img src="/wp-content/themes/govpress-child/lib/pictures/ajax-loader.gif">
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
