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

		<div id="isResult">
			<div class="form-group col-sm-12">
				<label for="result-text">Result to display: </label>
				<br>
				<input id="result-text" type="text" style="width:100%"/>				
			</div>
		</div>


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

				<div id="caseNumeric" class="form-group">
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



// Inject it to your html file
function injectLeftPanel(){
	$('#editor-left-panel').html(leftPanelHtml);
	lpConfigDisplay();
	lpHideDisplay();
	lpReset();	
	lpDisplay();
}


// Hide all the left panel
function lpHideDisplay(){
	$('#node-editor-form').hide();
	$('#isResult').hide();
	$('#isNotResult').hide();
	$('#isBlock').hide();
	$('#isNotBlock').hide();
	$('#caseNumeric').hide();
	$('#isComputation').hide();
	$('#computationEnabled').hide();
	$('#isTargetDefined').hide();
}

// Reset all fields
function lpReset(){
	$('#node-editor-form').find("input").val("");
	$('#node-editor-form').find("select[id^=case]").val("no");
	$('#question-type').val("text");
	injectDefaultAnswers(0);
}

// Set current display
function lpDisplay(){
	toggleCaseVisibility($('#caseResult'), '#isResult', '#isNotResult');
	toggleCaseVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');
	toggleQuestionTypeVisibility($('#question-type'));
	toggleComputationVisibility($('#isComputation'), '#computationEnabled');
}

// Configure default events for displaying div
function lpConfigDisplay(){

	// Form visiibility
	$('#node-editor-id').change(function(){
		/* HIDDEN FIELDS NEED TO BE 'TRIGGERED' MANUALLY BEFORE CALLING THIS KIND OF EVENTS */		
		lpReset();	// Reset form on ID change
		if($(this).val() == ""){
			lpHideDisplay();
		}
		else{
			var key = $(this).val();
			dumpQuestionNode(key);
			$('#node-editor-form').show();
			lpDisplay();
		}
	});
	
	// Result node
	$('#caseResult').change(function(){
		toggleCaseVisibility($(this), '#isResult', '#isNotResult');
	});

	// Block node
	$('#caseBlock').change(function(){
		toggleCaseVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');
	});

	// Potential existing target of node
	$('#isNotResult').is(":visible") == true ? $('#isTargetDefined').show() : $('#isTargetDefined').hide();

	// Question type
	$('#question-type').change(function(){
		toggleQuestionTypeVisibility($(this));
	});

	// Numeric type : handle computation
	$('#isComputation').change(function(){
		toggleComputationVisibility($(this), '#computationEnabled');
	});	

	// Default answers button management
	$('#addAnswer').click(function(){	addAnswer();	});
	$('#delAnswer').click(function(){	delAnswer();	});
}






// Display or not the specific question for a numeric type
function toggleComputationVisibility(currentElt, idSelector){
	if(currentElt.val() == "yes"){
		$(idSelector).show();
	}else{
		$(idSelector).hide();
	}
}

// Display / Hide div for cases (yes / no option to display element)
function toggleCaseVisibility(currentElt, ifIdSelector, elseIdSelector){
	if(currentElt.val() == "yes"){
		$(ifIdSelector).show();
		$(elseIdSelector).hide();
	}else{
		$(ifIdSelector).hide();
		$(elseIdSelector).show();
	}
}

// Display specific predefined answers according to selected type
function toggleQuestionTypeVisibility(questionElt){

	// Specific case for numeric type
	if(questionElt.val() == "numeric"){
		$('#caseNumeric').show();
		$('#isComputation').show();	
		injectDefaultAnswers(2, ['true', 'false']);
	}
	else{
		$('#caseNumeric').hide();
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

// Insert the given number of label/input for the default answers section
function injectDefaultAnswers(nb, placeholder){

	// Flush default answers section
	if(nb == 0){
		$('#question-answers').html('');
		return;
	}

	// Inject as many answers as needed
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

// Insert one more answer in the default answers section
function addAnswer(){
	var i = $('#question-answers > input').length;

	$('#question-answers').append(`
		<br>
		<label for="question-def-answers-`+i+`">#`+i+`</label>
		<input id="question-def-answers-`+i+`" type="text">
	`);
}


// Remove the last inserted answer
function delAnswer(){
	// Stop condition : always one answer available
	if($('#question-answers').children().length == 2){
		return;
	}

	$('#question-answers > input:last').remove();
	$('#question-answers > label:last').remove();
	$('#question-answers > br:last').remove();
}


// Get form data for the graphical editor
function editorDumper(){

	// Create the data and get back main characteritics
	var nodeData = {
		id: $('#node-editor-id').val(),
		isResult: $('#isResult').is(":visible"),
		isBlock: $('#isBlock').is(":visible")
	}

	// According to characteritics, inject required data
	if(nodeData.isResult) {
		nodeData['text'] = $('#result-text').val();
	}
	else {
		if(nodeData.isBlock){

		}
		else{
			// Classical case
			nodeData['question'] = {
				title: $('#question-title').val(),
				type: $('#question-type').val(),
				answers: []
			}

			// Retrieve the answers section
			var s = [];
			$('input[id^="question-def-answers-"]').each(function(idx){
				s.push($('#question-def-answers-'+idx)[0]);
			});
			s.forEach(function(elt){
				var answer = elt.value != "" ? elt.value : elt.placeholder;
				nodeData.question.answers.push(answer);
			});
		}
	}	

	return nodeData;
}



// Preset form to match what is written inside this current question node
function dumpQuestionNode(questionKey){

	var nodeData = questionNodes[questionKey];	

	// Result case
	if(nodeData.isResult){
		$('#caseResult').val("yes");
		$('#result-text').val(nodeData.text);
	}
	else{
		$('#caseResult').val("no");
	}

	// Block case
	if(nodeData.isBlock){
		$('#caseBlock').val("yes");
	}
	else{
		$('#caseBlock').val("no");
	}

	// Question block :
	if(nodeData.question){
		$('#question-title').val(nodeData.question.title);
		$('#question-type').val(nodeData.question.type);

		for(var i=0; i<nodeData.question.answers.length; i++){
			addAnswer();
			var answer = nodeData.question.answers[i];
			$('#question-def-answers-'+i).val(answer);

			console.log("answer inserted is : ", answer, "in : ", $('#question-def-answers-'+i));
		}		
	}
}






// node-editor
// caseResult
// isResult
// result-text
// isNotResult
// caseBlock
// isBlock
// isNotBlock
// question-title
// question-type
// caseNumeric
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

