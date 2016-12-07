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

$(document).on('change','#langues',function(){
	changeLangue();
});

function changeLangue(){
	$.post( "/node", { country: 'Netherlands', name: $("#langues").val()+'.json', action: 'read', branch: 'master' } )
	.done(function( dataTrad ) {
		traductionData = dataTrad;
		console.log("change");
		$("#labelTypeOfWork").text(getTraduction($("#langues").val(), 'labelTypeOfWork'));
		$("#labelLangue").text(getTraduction($("#langues").val(), 'labelLangue'));
		console.log(cleaningTranslation(traductionData));
		console.log(missingTranslation(traductionData));
	});
}

$(document).on('change','#typeOfWork',function(){
	$.post( "/node", { country: 'Netherlands', name: $("#langues").val()+'.json', action: 'read', branch: 'master' } )
	.done(function( dataTrad ) {
		traductionData = dataTrad;
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
						console.log(datapoint);
						for(var j = 0; j < datapoint.set.length; j++){
							inputHTML += '<option value="'+getTraduction($("#langues").val(), datapoint.set[j])+'">'+getTraduction($("#langues").val(), datapoint.set[j])+'</option>';
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


//Récupération des éléments get de l'URL
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value.replace("#", "");;
	});
	return vars;
}


$(function() {

	$.post( "/node", { country: 'Netherlands', name: 'Netherlands.json', action: 'read', branch: 'master' } )
	.done(function( data ) {
		file = data;

		console.log("File outside : ", file);



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
