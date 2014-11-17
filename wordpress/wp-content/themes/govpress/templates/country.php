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
                $("#secondary").hide();
                
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
                $('.close').click(function(){
                    $(".alert").hide();
                });
            });
        </script>
        <h1 style="font-size: 25px;"><?php echo $key_country; ?></h1>
        <br/>
        <h2>Introduction</h2>
        <br/>
        <p>After choosing a type of work the term of protection of which you want to calculate, followed by a form that contains all the information required to complete the calculation. This version illustrates the possibilities of an API-based calculator by identifying all the data required to complete a full calculation.</p>
        <p>It should be noted that multiple layers of rights (whether of copyright, neighbouring or related rights or sui generis rights) might apply to the same information product. Please make sure that you correctly identify and apply the Public Domain Calculators to all subject matter that qualifies for protection.</p>
        <p>Where an event is mentioned in the calculator as the starting point for the calculation of a set number of years, for the purposes of the calculator, the event should be taken as occurring on the first day of January of the year following that in which it actually took place.</p>
        <p>Click here for a visual representation of this decision proces.</p>
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

        <h2>Note</h2>
        <br/>
        <p>Please note that a single item might be protected by multiple layers of rights. For example, a CD will often comprise four layers of rights: if it contains music, that may be covered by copyright; any lyrics accompanying the music may also qualify for copyright protection, while the performers (musicians and singers or any other performer) as well as the phonogram producer may be protected by related rights. Similarly, a book may consist of text and illustrations, both of which may be protected by copyright. If an illustration is a photograph of a painting, a third layer of protection may be added. The term of protection of all relevant rights should be examined in order to determine whether the item as a whole is in the Public Domain or not. Please make sure you correctly identify and apply the Public Domain Helper Tool to all subject matter that qualifies for protection.</p>
        <p>To this end, please also keep in mind that in accordance with Belgian law and for the purposes of this Public Domain Calculator:</p>
        <ul>
            <li>A volume, part, instalment, issue or episode of a work shall be treated as if they are whole independent works. Individual parts or issues of magazines, newspapers and other periodical works should also be considered to be independent works. The Public Domain Helper Tool should accordingly be applied to each of these individually.</li>
            <li>If a work has been created by two or more persons in collaboration, it is a work of joint authorship. The Public Domain Helper Tool should accordingly be applied to the work as a whole, but not to the individual contributions.</li>
            <li>Individual items included in an (original or unoriginal) database may be independently protected. In this case, the Public Domain Helper Tool should also be applied to each of these individually.</li>
        </ul>
		</div><!-- #content -->
        <div class="entry-content">
        </div>
	</div><!-- #primary -->

<?php
get_sidebar( 'content' );
get_sidebar();
get_footer();
