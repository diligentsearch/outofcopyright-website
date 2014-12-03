var formulaActual = '';
var formulaActualForTest = '';
var formulaInputs= [];


$(function(){

	$( "#datapointsFormula" ).change(function() {
		if($( "#datapointsFormula" ).val() != ""){
			if(formulaActualForTest[formulaActualForTest.length - 1] != 'v'){
				var datapoint = new Object();
				if($( "#datapointsFormula" ).val() == 'NOW'){
					datapoint.id = 'NOW';
				}else{
					datapoint = getResponseById($( "#datapointsFormula" ).val());
					if(datapoint.type != 'static'){
						formulaInputs.push(datapoint.id);
					}
				}
				
		  		$( "#formula" ).append("<div class='spanFormulaDatapoints' style='float:left;'>"+datapoint.id+"</div>");
				formulaActualForTest += 'v';
				formulaActual += datapoint.id + " ";
				testFormula();
				
				$('#datapointsFormula option[value=""]').attr('selected','selected');
				resizeVerticaly();
			}
		}
	});

	$( "#plusFormula" ).click(function() {
		if(formulaActualForTest[formulaActualForTest.length - 1] == 'v'){
			$( "#formula" ).append("<div class='spanFormulaDatapoints' style='float:left;'>+</div>");
  			formulaActualForTest += '+';
  			formulaActual += '+ ';
  			testFormula();
  			resizeVerticaly();
		}
  		
	});

	$( "#minusFormula" ).click(function() {
		if(formulaActualForTest[formulaActualForTest.length - 1] == 'v'){
	  		$( "#formula" ).append("<div class='spanFormulaDatapoints' style='float:left;'>-</div>");
	  		formulaActualForTest += '-';
	  		formulaActual += '- ';
	  		testFormula();
	  		resizeVerticaly();
	  	}
	});

	$( "#superiorFormula" ).click(function() {
		if(formulaActualForTest[formulaActualForTest.length - 1] == 'v'){
	  		$( "#formula" ).append("<div class='spanFormulaDatapoints' style='float:left;'>></div>");
	  		formulaActualForTest += '>';
	  		formulaActual += '> ';
	  		$( "#inferiorFormula" ).attr("disabled","disabled");
	  		$( "#superiorFormula" ).attr("disabled","disabled");
  			testFormula();
  			resizeVerticaly();
  		}
	});

	$( "#inferiorFormula" ).click(function() {
		if(formulaActualForTest[formulaActualForTest.length - 1] == 'v'){
	  		$( "#formula" ).append("<div class='spanFormulaDatapoints' style='float:left;'><</div>");
	  		formulaActualForTest += '<';
	  		formulaActual += '< ';
	  		$( "#inferiorFormula" ).attr("disabled","disabled");
	  		$( "#superiorFormula" ).attr("disabled","disabled");
	  		testFormula();
	  		resizeVerticaly();
	  	}
	});
	$( "#formulaReset" ).click(function() {
  		$( "#formula" ).html('');
  		$('#datapointsFormula option[value=""]').attr('selected','selected');
  		formulaActualForTest = '';
  		formulaActual = '';
  		$(".formulaResult").hide();
  		formulaInputs= [];
  		$( "#inferiorFormula" ).removeAttr("disabled","");
	  	$( "#superiorFormula" ).removeAttr("disabled","");
  		resizeVerticaly();
	});
});

//Test de la formule si elle est correcte
function testFormula(){
	try {
		$(".formulaResult").hide();
		var formulaActualToTest = formulaActualForTest.replace(/v/g, 1);
		var result = eval(formulaActualToTest);
		if(formulaActualToTest.indexOf(">") != -1 || formulaActualToTest.indexOf("<") != -1){
			if(result !== undefined){
				$("#formula-success").show();
			}
		}
		else{
			$("#formula-warning").show();
		}
	
	}
	catch(err) {
		console.log(err);
    	$("#formula-warning").show();
	}
}

function actualFormula(listElement){
	$( "#formula" ).html('');
	for(var i = 0 ; i < listElement.length ; i++){
		$( "#formula" ).append("<div class='spanFormulaDatapoints' style='float:left;'>"+ listElement[i] +"</div>");
	}
}