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



			<div id="isBlock">
				<div class="form-group col-sm-12">
					<label for="block-title">Block introduction text: </label>
					<br>
					<input id="block-title" type="text" style="width:100%"/>					
				</div>

				<div class="form-group col-sm-12">
					<label>Number of questions :</label>
					<div id="block-questions-number">1</div>
					<div id="block-questions-management" class="col-sm-3" style="position:absolute; bottom:0; right:0" >
						<button id="addQuestion" type="button">+</button>
						<button id="delQuestion" type="button">-</button>
					</div>
				</div>
			</div>


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

					<div id="question-answers" class="col-sm-9">
					</div>
					<div id="question-answers-management" class="col-sm-3" style="position:absolute; bottom:0; right:0" >				
						<button id="addAnswer" type="button">+</button>
						<button id="delAnswer" type="button">-</button>
					</div>
				</div>

				<div class="form-group" style="position:relative">
					<label for="caseTarget" class="col-sm-8" >Connect answers to existing nodes ?</label>
					<div class="col-sm-4 text-right">
						<select id="caseTarget">
							<option value="no" SELECTED>No </option>
							<option value="yes">		Yes</option>
						</select>				
					</div>
					<br>


					<div id="targetDefined">
						<br>
						<div id="target-connections" class="col-sm-9">
						</div>
						<div id="target-connections-management" class="col-sm-3" style="position:absolute; bottom:0; right:0" >
							<button id="addTarget" type="button">+</button>
						</div>
					</div>
				</div>

			</div>




		</div>

		<button id="node-editor-generate" type="button" class="btn btn-default">Generate</button>
		<button id="node-editor-delete" type="button" class="btn btn-default">Delete this node</button>
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
	$('#targetDefined').hide();
	$('#question-answers-management').hide();

}

// Reset all fields
function lpReset(){
	$('#node-editor-form').find("input").val("");
	$('#node-editor-form').find("select[id^=case]").val("no");
	$('#question-type').val("text");
	injectDefaultAnswers(0);
	$('#target-connections').html('');
}

// Set current display
function lpDisplay(){
	toggleCaseVisibility($('#caseResult'), '#isResult', '#isNotResult');
	toggleCaseVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');
	toggleTargetConnection($('#caseTarget'));
	toggleQuestionTypeVisibility($('#question-type'));
	toggleComputationVisibility($('#isComputation'), '#computationEnabled');
}

// Configure default events for displaying div
function lpConfigDisplay(){

	// Form visiibility
	$('#node-editor-id').change(function(){
		/* HIDDEN FIELDS NEED TO BE 'TRIGGERED' MANUALLY BEFORE CALLING THIS KIND OF EVENTS */		
		
		// Reset form on ID change
		lpReset();	
		lpHideDisplay();
		var nodeId = $(this).val();
		if(nodeId != ""){
			dumpQuestionNode(nodeId);
			$('#node-editor-form').show();
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

	// Default question numbers management
	$('#addQuestion').click(function(){	addQuestion();	});
	$('#delQuestion').click(function(){	delQuestion();	});

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

	// Target defined
	$('#caseTarget').change(function(){
		toggleTargetConnection($(this));
	});

	// Default target button management
	$('#addTarget').click(function(){	addTarget();	});
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
		injectDefaultAnswers(2, ['true', 'false'], true);
	}
	else{
		$('#caseNumeric').hide();
		$('#isComputation').hide();

		// Check other types
		switch(questionElt.val()){
			case "text" :				
				injectDefaultAnswers(1, ['Set']);
				break;
			case "check" :
				injectDefaultAnswers(2, ['Checked', 'Not checked']);
				break;
			case "bool" :
				injectDefaultAnswers(2, ['True', 'False']);
				break;
			case "list" :
				injectDefaultAnswers(3, ['First choice', 'Second choice', 'Third choice'], true);
			default:
				break;
		}
	}
}

// Insert the given number of label/input for the default answers section
function injectDefaultAnswers(nb, placeholder, increasable){

	// Flush default answers section
	if(nb == 0){
		$('#question-answers').html('');
		return;
	}

	// Inject as many answers as needed
	var lastId,
		answers = "";

	for(var i=0; i < nb; i++){
		var j = i+1;		
		var answer = `
			<br>
			<label for="question-def-answers-`+i+`">#`+j+`</label>
			<input id="question-def-answers-`+i+`" type="text" placeholder="`+placeholder[i]+`" style="width:80%;">
		`;
		lastId = "#question-def-answers-"+i;
		answers += answer;		
	}
	$('#question-answers').html(answers);

	if(increasable){
		$('#question-answers-management').show();
	}else{
		$('#question-answers-management').hide();
	}

}

// Insert one more answer in the default answers section
function addAnswer(){
	var i = $('#question-answers > input').length;
	var j = i+1;
	$('#question-answers').append(`
		<br>
		<label for="question-def-answers-`+i+`">#`+j+`</label>
		<input id="question-def-answers-`+i+`" type="text" placeholder="Output value" style="width:80%;">
	`);
}


// Remove the last inserted answer
function delAnswer(){	
	if($('#question-answers').children().length >= 2){
		// Remove only if more than 2 elements
		$('#question-answers > input:last').remove();
		$('#question-answers > label:last').remove();
		$('#question-answers > br:last').remove();
	}	
}


// Display the target connection section
function toggleTargetConnection(targetElt){
	if(targetElt.val() == "yes"){
		$('#targetDefined').show();
		addTarget();
	}
	else{
		$('#targetDefined').hide();
	}
}


// Add a line to enable an answer to point to an existing node
function addTarget(){
	// 2 select tags for one target
	var nbSelect = $('#target-connections > select').length,
		lineIdx = nbSelect / 2; 

	// Retrieve the answers section
	var answers = retrieveSection('input', 'question-def-answers-');

	// Check if request is pertinent
	if(lineIdx < answers.length){
		// Generate 2 select tags on a specific line	
		$('#target-connections').append(`
			<label for="target-connections-answersList-`+lineIdx+`" class="col-sm-3">Answer</label>
			<select id="target-connections-answersList-`+lineIdx+`" class="col-sm-3">
			</select>

			<label for="target-connections-nodesList-`+lineIdx+`" class="col-sm-3">Target</label>
			<select id="target-connections-nodesList-`+lineIdx+`" class="col-sm-3">
			</select>
			<br>
		`);


		// Insert answers labels into first select tag
		// Tag names starting at 1
		for(var i=1; i<=answers.length; i++){
			$('#target-connections-answersList-'+lineIdx).append(`
				<option value=#`+i+`>#`+i+`</option>
			`);
		}

		// Insert nodes into second select tag if it's not the current one
		for(var targetId in questionNodes){
			if(targetId != $('#node-editor-id').val()){
				$('#target-connections-nodesList-'+lineIdx).append(`
					<option value="`+targetId+`">`+targetId+`</option>
				`);				
			}
		}

		// Handle dynamic display on selected value for both select tags
		$('#target-connections-nodesList-'+lineIdx, '#target-connections-answersList-'+lineIdx).on('change', function(e){
			$(this).find('option[value="'+$(this).val()+'"]').prop('selected', true);
			$(this).find('option[value="'+$(this).val()+'"]').attr('selected', true);
		});

		// Force default value
		$('#target-connections-answersList-'+lineIdx).val('#1');
		$('#target-connections-nodesList-'+lineIdx).val('lvl_0');
	} 
}


function addQuestion(){
	var nb = parseInt($('#block-questions-number').html());
	nb++;
	$('#block-questions-number').html(nb);
}


function delQuestion(){
	var nb = parseInt($('#block-questions-number').html());
	if(nb>1)
		nb--;
	$('#block-questions-number').html(nb);
}



// 
// 
// Bind to JS model
// 
// 





// Retrive specific section of html code based on common id pattern : id-section-#index
function retrieveSection(tag, sectionId){
	var s = [],
		selector = tag+'[id^="'+sectionId+'"]';

	$(selector).each(function(idx){
		s.push($('#'+sectionId+idx)[0]);
	});
	return s;
}








nodeData = {};
// nodeData = {
// 	id: undefined,
// 	isResult: false,
// 	isBlock: false,
// 	isClustered: false,
// 	result: {
// 		text: ""
// 	},
// 	block: {
// 		title: "",
// 		nbQuestions: 0
// 	},
// 	question: {
// 		title: "",
// 		type: "",
// 		answers: []
// 	}
// };

function resultFormat(){
	nodeData.block.title = "";
	nodeData.block.nbQuestions = 0;
	nodeData.isClustered = false;
	nodeData.question.title = "";
	nodeData.question.type = "";
	nodeData.question.answers = [];
}

function blockFormat(){
	nodeData.result.text = "";
	nodeData.isClustered = false;
	nodeData.question.title = "";
	nodeData.question.type = "";
	nodeData.question.answers = [];
}

function questionFormat(){
	nodeData.result.text = "";
	nodeData.block.title = "";
	nodeData.block.nbQuestions = 0;
}

// Get form data and send it to the graphical editor
function editorDumper(){

	// update local nodeData object
	nodeData.isResult = $('#isResult').is(":visible");
	nodeData.isBlock = $('#isBlock').is(":visible");


	// According to characteristics, inject required data
	if(nodeData.isResult) {
		resultFormat();
		nodeData.result.text = $('#result-text').val();
	}
	else {
		if(nodeData.isBlock){
			blockFormat();
			nodeData.block.title = $('#block-title').val();
			nodeData.block.nbQuestions = parseInt($('#block-questions-number').html());
		}
		else{
			questionFormat();
			nodeData.question.title =  $('#question-title').val();
			nodeData.question.type = $('#question-type').val();

			var answers = retrieveSection('input', 'question-def-answers-'),
				labels = retrieveSection('select', 'target-connections-answersList-'),
				targets = retrieveSection('select', 'target-connections-nodesList-');

			answers.forEach(function(elt, idx){
				// Generate default answer
				var answer = {
					target: undefined,
					label: elt.value != "" ? elt.value : elt.placeholder
				};

				/* Look for existing link with existing target */

				// Get back the name of the corresponding label and look for it into the select tags
				var associatedLabel = $('label[for="'+elt.id+'"]').text();
				$.each(labels, function(i){
					l = labels[i];

					// A link exists
					if(l.value == associatedLabel){
						var lineIdx = l.id.split('target-connections-answersList-')[1];
						answer.target = targets[i].value != "" ? targets[i].value : undefined;
					}
				});

				nodeData.question.answers[idx] = answer;
			});
		}
	}
	return nodeData;
}



// Preset form to match what is written inside this current question node
function dumpQuestionNode(nodeId){

	nodeData = questionNodes[nodeId];

	// Result case
	if(nodeData.isResult){
		$('#caseResult').val("yes");
		$('#result-text').val(nodeData.result.text);
	}
	else{
		$('#caseResult').val("no");
	}
	toggleCaseVisibility($('#caseResult'), '#isResult', '#isNotResult');

	// Block case
	if(nodeData.isBlock){
		$('#caseBlock').val("yes");
		$('#block-title').val(nodeData.block.title);
		$('#block-questions-number').val(nodeData.block.nbQuestions);
	}
	else{
		$('#caseBlock').val("no");
	}
	toggleCaseVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');




	// Question block :
	if(nodeData.question){
		$('#question-title').val(nodeData.question.title);
		$('#question-type').val(nodeData.question.type);
		toggleQuestionTypeVisibility($('#question-type'));
		// toggleComputationVisibility($('#isComputation'), '#computationEnabled');

		// Default answers section
		var placeholders = nodeData.question.answers.map(function(a){
			return a.label;
		});
		if(placeholders.length > 0){
			var increasable = nodeData.question.type == "numeric" || nodeData.question.type == "list";
			injectDefaultAnswers(placeholders.length, placeholders, increasable);
		}

		// Disable redirection if clustered node
		if(nodeData.isClustered){
			$('label[for="caseTarget"]').hide();
			$('#caseTarget').hide();
		}
		else{
			// Look for targets on answers
			$.map(nodeData.question.answers, function(a, index){
				if(a.target != undefined){
					if($('#target-connections').is(":visible") == false){
						$('#caseTarget').val("yes");
						toggleTargetConnection($('#caseTarget'));
					}
					else{
						addTarget();					
					}

					var associatedLabel = $('label[for="question-def-answers-'+index+'"]').text();
					$('#target-connections-answersList-'+index).val(associatedLabel).attr('disabled', 'disabled');
					$('#target-connections-nodesList-'+index).val(a.target).attr('disabled', 'disabled');
				}
			});		
			$('label[for="caseTarget"]').show();
			$('#caseTarget').show();		
		}

	}
	
}

