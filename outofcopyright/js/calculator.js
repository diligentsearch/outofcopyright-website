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
		var result = walk($( "#typeOfWork" ).val(), responses);

		console.log("typeOfWork : ", $( "#typeOfWork" ).val());
		console.log("RESPONSE" , responses);
		console.log("RESULT " , result);

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
	});
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
	if($( "#typeOfWork" ).val() != ""){
		$.post( "/node", { country: 'Netherlands', name: $("#langues").val()+'.json', action: 'read', branch: 'master' } )
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

	$.post( "/node", { country: 'Netherlands', name: 'Netherlands.json', action: 'read', branch: 'master' } )
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

