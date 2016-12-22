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
					<label>Number of questions in the block:</label>
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
					<label class="col-sm-8">Computation configuration</label>
					<br>


					<table style="width:90%; margin-left:5%">
						<tr>
							<td style="padding-top:2%"> 
								<label>Reference Value</label>
							</td>
							<td>
								<input id="numeric-reference" type="text"style="width:100%" />
							</td>
						</tr>

						<tr>
							<td style="padding-top:2%"> 
								<label>Condition</label>
							</td>
							<td>
								<select id="numeric-condition">
									<option value="==" SELECTED>	= 	</option>
									<option value="<" SELECTED>		< 	</option>
									<option value="<=" SELECTED>	<= 	</option>
									<option value=">" SELECTED>		> 	</option>
									<option value=">=" SELECTED>	>= 	</option>
								</select>
							</td>
						</tr>
						
						<tr>
							<td style="padding-top:2%"> 
								<label>Inputs</label>
							</td>
							<td>
								<input id="numeric-inputs" type="text" style="width:100%" placeholder="NOW - {user_input_1} + {user_input_2}"/>
							</td>
						</tr>
						
						<tr>
							<td style="padding-top:2%"> 
								<label>Visualization</label>
							</td>
							<td>
								<input id="numeric-visualization" type="text" style="width:100%" disabled/>
							</td>
						</tr>
					</table>
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

// Configure default events for displaying div
function lpConfigDisplay(){

	/* HIDDEN FIELDS NEED TO BE 'TRIGGERED' MANUALLY BEFORE CALLING THIS KIND OF EVENTS */		
	// On graphical node click
	$('#node-editor-id').change(function(){
		lpReset();	
		lpHideDisplay();
		var nodeId = $(this).val();
		if(nodeId != ""){
			dumpGraphicalNode(nodeId);
			$('#node-editor-form').show();
		}
	});
	
	// Div hide / show management
	$('#caseResult').change(function(){		toggleCaseVisibility($(this), '#isResult', '#isNotResult');			});	// Result node	
	$('#caseBlock').change(function(){		toggleCaseVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');	});	// Block node	
	$('#question-type').change(function(){	toggleQuestionTypeVisibility($(this));								});	// Question type	
	$('#caseTarget').change(function(){		toggleTargetConnection($(this));									});	// Target defined

	// Buttons management
	$('#addQuestion').click(function(){	addQuestion();	});
	$('#delQuestion').click(function(){	delQuestion();	});
	$('#addAnswer').click(function(){	addAnswer();	});
	$('#delAnswer').click(function(){	delAnswer();	});
	$('#addTarget').click(function(){	addTarget();	});
}

// Hide all the left panel
function lpHideDisplay(){
	$('#node-editor-form').hide();
	$('#isResult').hide();
	$('#isNotResult').hide();
	$('#isBlock').hide();
	$('#isNotBlock').hide();
	$('#caseNumeric').hide();
	// $('#computationEnabled').hide();
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

// Display specific predefined answers according to selected type
function toggleQuestionTypeVisibility(questionElt){

	// Specific case for numeric type
	if(questionElt.val() == "numeric"){
		$('#caseNumeric').show();
		injectDefaultAnswers(2, ['True', 'False'], true);
	}
	else{
		$('#caseNumeric').hide();

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

	if(nb == 0){
		// Flush default answers section
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

// Add a question to a block
function addQuestion(){
	var nb = parseInt($('#block-questions-number').html());
	nb++;
	$('#block-questions-number').html(nb);
}

// Delete a question from a block
function delQuestion(){
	var nb = parseInt($('#block-questions-number').html());
	if(nb>1)
		nb--;
	$('#block-questions-number').html(nb);
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
	// Remove only if more than 2 elements
	if($('#question-answers').children().length >= 2){
		$('#question-answers > input:last').remove();
		$('#question-answers > label:last').remove();
		$('#question-answers > br:last').remove();
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
		// Tag names displayed start at 1
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

// Macro to Retrieve specific section of html code based on common id pattern : id-section-#index
function retrieveSection(tag, sectionId){
	var s = [],
		selector = tag+'[id^="'+sectionId+'"]';

	$(selector).each(function(idx){
		s.push($('#'+sectionId+idx)[0]);
	});
	return s;
}



/*

	JS binding with model
	--> to deport somewhere else ?

*/



/* Local nodeData and associated model */
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
// 		clusterNode: "",
// 		title: "",
// 		type: "",
// 		answers: [],
// 		computation: {
// 			reference: 0,
// 			condition: "==",
// 			formula: ""
// 		}
// 	}
// };


/* Format function to ensure local nodeData fits what has been received */
function resultFormat(){
	nodeData.block.title = "";
	nodeData.block.nbQuestions = 0;
	nodeData.isClustered = false;
	nodeData.question.clusterNode = "";
	nodeData.question.title = "";
	nodeData.question.type = "";
	nodeData.question.answers = [];
	numericFormat();
}

function blockFormat(){
	nodeData.result.text = "";
	nodeData.isClustered = false;
	nodeData.question.clusterNode = "";
	nodeData.question.title = "";
	nodeData.question.type = "";
	nodeData.question.answers = [];
	numericFormat();
}

function questionFormat(){
	nodeData.result.text = "";
	nodeData.block.title = "";
	nodeData.block.nbQuestions = 0;
}

function numericFormat(){
	nodeData.computation.reference = 0;
	nodeData.computation.condition = "==";
	nodeData.computation.formula = "";
}

/* Dump the leftPanelHtml template to update the local nodeData variable and to return it*/
function dumpEditedNode(){

	nodeData.isResult = $('#isResult').is(":visible");
	nodeData.isBlock = $('#isBlock').is(":visible");

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

			// If it's not a numeric type, ensure formatting is done
			if(nodeData.question.type != "numeric"){
				numericFormat();
			}
			else{
				console.log("dump numeric case");
			}

			var answers = retrieveSection('input', 'question-def-answers-'),
				labels = retrieveSection('select', 'target-connections-answersList-'),
				targets = retrieveSection('select', 'target-connections-nodesList-');

			// Generate answers for graphical editor
			answers.forEach(function(elt, idx){
				var answer = {
					target: undefined,
					label: elt.value != "" ? elt.value : elt.placeholder
				};

				/* Look for existing link with existing target based on associated label */
				var associatedLabel = $('label[for="'+elt.id+'"]').text();
				$.each(labels, function(i){
					l = labels[i];

					// A link exists
					if(l.value == associatedLabel){
						var lineIdx = l.id.split('target-connections-answersList-')[1];
						answer.target = targets[i].value != "" ? targets[i].value : undefined;
					}
				});

				// Push the generated answer 
				nodeData.question.answers[idx] = answer;
			});
		}
	}
	return nodeData;
}

/* Update local nodeData based on id received and fill in leftPanelHtml template */
function dumpGraphicalNode(nodeId){

	nodeData = questionNodes[nodeId];

	/* Result case */
	if(nodeData.isResult){
		$('#caseResult').val("yes");
		$('#result-text').val(nodeData.result.text);
	}
	else{
		$('#caseResult').val("no");
	}
	toggleCaseVisibility($('#caseResult'), '#isResult', '#isNotResult');

	
	/* Block case */
	if(nodeData.isBlock){
		$('#caseBlock').val("yes");
		$('#block-title').val(nodeData.block.title);
		$('#block-questions-number').val(nodeData.block.nbQuestions);
	}
	else{
		$('#caseBlock').val("no");
	}
	toggleCaseVisibility($('#caseBlock'), '#isBlock', '#isNotBlock');

	
	/* Question case */
	if(nodeData.question){
		$('#question-title').val(nodeData.question.title);
		$('#question-type').val(nodeData.question.type);



		toggleQuestionTypeVisibility($('#question-type'));
		dumpAnswers();

		if(nodeData.isClustered){
			// Disable redirection if clustered node
			$('label[for="caseTarget"]').hide();
			$('#caseTarget').hide();
		}
		else{
			// Or dump links and enable redirection
			dumpLinks();
			$('label[for="caseTarget"]').show();
			$('#caseTarget').show();		
		}
	}
}


/* Dumping function insuring you have eough default types */
function dumpAnswers(){

	// Default answers section and palceholders
	var answers = nodeData.question.answers.map(function(a){	return a.label;	 });
	var placeholders = [];
	$('#question-answers > input').each(function(){		placeholders.push( $(this).attr('placeholder') );	});

	// Add placeholders if necessary
	var diff = placeholders.length - answers.length;
	if(diff > 0){
		var start = answers.length;
		for(var i = start; i < (start+diff); i++){
			answers.push(placeholders[i]);
		}
	}
	
	// Inject html
	var increasable = nodeData.question.type == "numeric" || nodeData.question.type == "list";
	injectDefaultAnswers(answers.length, answers, increasable);
}


/* Dump links existing for default answers already set up */
function dumpLinks(){
	$.map(nodeData.question.answers, function(a, index){
		if(a.target != undefined){
			if($('#target-connections').is(":visible") == false){
				$('#caseTarget').val("yes");
				toggleTargetConnection($('#caseTarget'));	// implicitely calling addTarget() function
			}
			else{
				addTarget();					
			}

			var associatedLabel = $('label[for="question-def-answers-'+index+'"]').text();
			$('#target-connections-answersList-'+index).val(associatedLabel).attr('disabled', 'disabled');
			$('#target-connections-nodesList-'+index).val(a.target).attr('disabled', 'disabled');
		}
	});		
}

