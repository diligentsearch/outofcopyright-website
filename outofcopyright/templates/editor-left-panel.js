// This file is a way to simulate template and ensure modularity

leftPanelHtml = `




<div id="node-editor" style="height:100%">

	<h3 class="title">Node Edition</h3>
	<p>Use this panel to set the question you want a response to, and configure expected inputs</p>



	<input id="node-editor-id" type="hidden" value=""/>


	<form class=form-horizontal id="node-editor-form">
		<div class="form-group">
			<label for="caseResult" class="col-sm-8" >Is this node a final result ?</label>
			<div class="col-sm-4 text-right">					
				<select id="caseResult">
					<option value="no" SELECTED>No </option>
					<option value="yes">		Yes</option>
				</select>
			</div>
		</div>

		<div id="isResult">Result case not implemented yet</div>


		<div id="isNotResult">		

			<div class="form-group">
				<label for="caseBlock" class="col-sm-8" >Is this a bloc of questions ?</label>
				<div class="col-sm-4 text-right">
					<select id="caseBlock">
						<option value="no" SELECTED>No </option>
						<option value="yes">		Yes</option>
					</select>				
				</div>
			</div>



			<div id="isBlock">Block case not implemented yet</div>


			<div id="isNotBlock">

				<div class="form-group col-sm-12">
					<label for="question-title">Question title: </label>
					<br>
					<input id="question-title" type="text" style="width:100%"/>
					
				</div>

				<div class="form-group">
					<label for="question-type" class="col-sm-8" >Type of answers for this question: </label>
					<div class="col-sm-4 text-right">
						<select id="question-type">
							<option value="text" SELECTED>	Free text 	</option>
							<option value="check">			Check Box	</option>
							<option value="bool">			Boolean		</option>
							<option value="numeric">		Numeric		</option>
							<option value="list">			List		</option>
						</select>
					</div>			
				</div>

				<div id="ifNumeric" class="form-group">
					<label for="isComputation" class="col-sm-8" >Is a computation required ?</label>
					<div class="col-sm-4 text-right">
						<select id="isComputation">
							<option value="no" SELECTED>No </option>
							<option value="yes">		Yes</option>
						</select>
					</div>
					<br>

					<div id="computationEnabled" class="col-sm-12" style="padding-top:10px">
							
						<label for="refValue" class="col-sm-6" style="padding-top:10px">
							Reference Value
						</label>
						<input id="refValue" type="text"/>
						<br>

						<label for="inValue" class="col-sm-8" style="padding-top:10px">
							Operation applied on input
						</label>
						<div class="col-sm-4 text-right">
							<select id="inValue">
								<option value="==" SELECTED>	= 	</option>
							</select>
						</div>		
						
					</div>
				</div>

				<div id="question-answers-block" class="form-group" style="position:relative">
					<label class="col-sm-12">Default answers : </label>

					<div id="question-answers" class="col-md-8">
					</div>
					<div id="question-answers-management" class="col-sm-4" style="position:absolute; bottom:0; right:0" >				
						<button id="addAnswer" type="button">+</button>
						<button id="delAnswer" type="button">-</button>
					</div>
				</div>

			</div>




			<div class="form-group">
				<label for="isTargetDefined" class="col-sm-8" >Connect to an existing node ?</label>
				<div class="col-sm-4 text-right">
					<select id="isTargetDefined">
						<option value="no" SELECTED>No </option>
						<option value="yes">		Yes</option>
					</select>				
				</div>
			</div>
		</div>

		<button id="node-editor-submit" type="button" class="btn btn-default">Generate</button>
	</form>
</div>




`;




function injectLeftPanel(){
	$('#editor-left-panel').html(leftPanelHtml);
	lpConfigDisplay();
}

function lpHideDisplay(){
	$('#node-editor-form').hide();
	$('#isResult').hide();
	$('#isNotResult').hide();
	$('#isBlock').hide();
	$('#isNotBlock').hide();
	$('#ifNumeric').hide();
	$('#isComputation').hide();
	$('#computationEnabled').hide();
	$('#isTargetDefined').hide();
}



function lpConfigDisplay(){

	lpHideDisplay();


	/* Default visibility and Handle change event */

	// Form invisible while node-editor-id not set
	/* HIDDEN FIELDS NEED TO BE 'TRIGGERED' MANUALLY BEFORE CALLING THIS KIND OF EVENTS */
	$('#node-editor-id').change(function(){
		if($(this).val() == ""){
			$('#node-editor-form').hide();	
		}else{
			// Retrieve data based on the id
			console.log("changed");
			var key = $(this).val();
			questionNodesDumper(key);
			$('#node-editor-form').show();			
		}
	});
	
	// Result 
	toggleBlockVisibility($('#caseResult'), '#isResult', '#isNotResult');
	$('#caseResult').change(function(){
		toggleBlockVisibility($(this), '#isResult', '#isNotResult');
	});

	// Block
	toggleBlockVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');
	$('#caseBlock').change(function(){
		toggleBlockVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');
	});

	// Potential existing target of this node
	$('#isNotResult').is(":visible") == true ? $('#isTargetDefined').show() : $('#isTargetDefined').hide();

	// Question type
	toggleQuestionTypeVisibility($('#question-type'));
	$('#question-type').change(function(){
		toggleQuestionTypeVisibility($(this));
	});

	// Numeric type : handle computation
	toggleComputationVisibility($('#isComputation'), '#computationEnabled');
	$('#isComputation').change(function(){
		toggleComputationVisibility($(this), '#computationEnabled');
	});	

	// Default answers button management
	$('#addAnswer').click(function(){
		addAnswer();
	});
	$('#delAnswer').click(function(){
		delAnswer();
	});

	// Submit button
	// $('#node-editor-submit').click(function(){
	// 	alert('undefined hanlder for node-editor-submit button');
	// });
}

function toggleComputationVisibility(currentElt, idSelector){
	switch(currentElt.val()){
		case "no":
			$(idSelector).hide();
			break;
		case "yes":
			$(idSelector).show();
			break;
		default:
			break;
	}
}

function toggleBlockVisibility(currentElt, ifIdSelector, elseIdSelector){
	switch(currentElt.val()){
		case "no":
			$(ifIdSelector).hide();
			$(elseIdSelector).show();
			break;
		case "yes":
			$(ifIdSelector).show();
			$(elseIdSelector).hide();
			break;
		default:
			break;
	}
}


function toggleQuestionTypeVisibility(questionElt){


	if(questionElt.val() == "numeric"){
		$('#ifNumeric').show();
		$('#isComputation').show();	
		injectDefaultAnswers(2, ['true', 'false']);
	}
	else{
		$('#ifNumeric').hide();
		$('#isComputation').hide();

		// Check other types
		switch(questionElt.val()){
			case "text" :				
				injectDefaultAnswers(1, ['set']);
				break;
			case "check" :
				injectDefaultAnswers(1, ['checked']);
				break;
			case "bool" :
				injectDefaultAnswers(2, ['true', 'false']);
				break;
			case "list" :
				injectDefaultAnswers(2, ['first choice', 'second choice']);
			default:
				break;
		}
	}
}


function injectDefaultAnswers(nb, placeholder){

	if(nb == 0){
		$('#question-answers').html('');
		return;
	}

	var lastId,
		answers = "";

	for(var i=0; i < nb; i++){
		var answer = `
			<br>
			<label for="question-def-answers-`+i+`">#`+i+`</label>
			<input id="question-def-answers-`+i+`" type="text" placeholder="`+placeholder[i]+`">
		`;
		lastId = "#question-def-answers-"+i;
		answers += answer;		
	}

	$('#question-answers').html(answers);
}


function addAnswer(){
	var i = $('#question-answers > input').length;

	$('#question-answers').append(`
		<br>
		<label for="question-def-answers-`+i+`">#`+i+`</label>
		<input id="question-def-answers-`+i+`" type="text">
	`);
}



function delAnswer(){
	if($('#question-answers').children().length == 2){
		return;
	}

	$('#question-answers > input:last').remove();
	$('#question-answers > label:last').remove();
	$('#question-answers > br:last').remove();
}




function editorDumper(){
	// Question data
	nodeData = {
		id : $('#node-editor-id').val(),
		isResult: false,
		isBlock: false,
		question: {
			title: $('#question-title').val(),
			type: $('#question-type').val(),
			answers: []
		}
	};

	var s = [];
	$('input[id^="question-def-answers-"]').each(function(idx){
		s.push($('#question-def-answers-'+idx)[0]);
	});

	s.forEach(function(elt){
		var value = elt.value != "" ? elt.value : elt.placeholder;
		nodeData.question.answers.push(elt.value);
	});


	// Reset all fields
	$('#node-editor-id').val("");
	$('#node-editor-form').find("input").val("");
	injectDefaultAnswers(0);
	lpHideDisplay();

	return nodeData;
}



function questionNodesDumper(questionKey){

	var nodeData = questionNodes[questionKey];
	if(nodeData == undefined)
		return;

	console.log("nodeDataDumper" , nodeData);


	// Preset form to match what is written inside this current question node

	// Result case
	if(nodeData.isResult){
		$('#caseResult').val("yes");
		$('#isResult').show();
		$('#isNotResult').hide();
	}
	else{
		$('#caseResult').val("no");
		$('#isResult').hide();
		$('#isNotResult').show();
	}

	// Block case
	if(nodeData.isBlock){
		$('#caseBlock').val("yes");
		$('#isBlock').show();
		$('#isNotBlock').hide();
	}
	else{
		$('#caseBlock').val("no");
		$('#isBlock').hide();
		$('#isNotBlock').show();
	}

	// question part : the only one don so far
	$('#question-title').val(nodeData.question.title);
	$('#question-type').val(nodeData.question.type);
	$('#question-answers-block').show();	


	injectDefaultAnswers(0);
	for(var i=0; i<nodeData.question.answers.length; i++){
		addAnswer();
		var answer = nodeData.question.answers[i];
		$('#question-def-answers-'+i).val(answer);
	}
}






// node-editor
// caseResult
// isResult
// isNotResult
// caseBlock
// isBlock
// isNotBlock
// question-title
// question-type
// ifNumeric
// isComputation
// computationEnabled
// refValue
// inValue
// question-answers-block
// question-answers
// question-answers-management
// add
// del
// isTargetDefined

