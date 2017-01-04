html_dataModelEditor = `
<div style="text-align:center">
	<h3>Data model editor</h3>
	<small>Use this panel to view and edit the data model to use for the creation of decision trees</small>
</div>

<ul id="breadcrumb" class="breadcrumb">
	<li><a onclick="getCountry()">Choose a Country</a></li>
	<li style="display: none"><a onclick="getWork()">Choose a type of Work</a></li>
	<li style="display: none"><a onclick="getData()">Data</a></li>
</ul>

<div id="select-country" style="display: none">

</div>

<div id="select-work" style="display: none">

</div>

<div id="display-data-model" style="display: none">

	<div>
		<label>User inputs:</label>
		<ul id="data-userInputs" class="list-group">		
		</ul>
		<button class="btn btn-default" onclick="add('userInput')" style="text-align:right">Add</button>
	</div>

	<div>
		<label>References values:</label>
		<ul id="data-referenceValues" class="list-group">
		</ul>
		<button class="btn btn-default" onclick="add('referenceValue')" style="text-align:right">Add</button>
	</div>

	<div>
		<label>Results to display:</label>
		<ul id="data-results" class="list-group">
		</ul>
		<button class="btn btn-default" onclick="add('result')" style="text-align:right">Add</button>
	</div>

	<div>
		<label>Questions already prepared:</label>
		<ul id="data-questions" class="list-group">
		</ul>
		<button class="btn btn-default" onclick="add('question')" style="text-align:right">Add</button>
	</div>

	<div>
		<label>Available blocks of questions:</label>
		<ul id="data-blocks" class="list-group">
		</ul>
		<button class="btn btn-default" onclick="add('block')" style="text-align:right">Add</button>
	</div>
</div>

`;




countries = ['Netherlands', 'Germany'];
selectedCountry = '';
works = ['Audiovisual', 'painting'];
selectedWork = '';
data = [];





function injectDataModelEditor(){
	$('#data-model-editor').html(html_dataModelEditor);
}


function getCountry(){
	// Ajax call to get data from server
	// countries = ....

	var countriesHtml = '<ul class="list-group">';
	for (var i = countries.length - 1; i >= 0; i--) {
		countriesHtml += '<li class="list-group-item" onclick="getWork('+i+')">'+countries[i]+'</li>';
	}
	countriesHtml += '</ul>';
	$('#select-country').html(countriesHtml);

	selectedCountry = '';
	$('#breadcrumb li:nth-child(1) a').text("Choose a Country");
	selectedWork = '';
	$('#breadcrumb li:nth-child(2) a').text("Choose a type of Work");
	$('#breadcrumb').children().hide();
	$('#breadcrumb li:first-child').show();
	$('#select-country').show();
}


function getWork(countryIdx){
	// Hide unecessary divs
	$('#select-country').hide();


	selectedCountry = countries[countryIdx];
	// Ajax call to get works from server for this country
	// works = ...

	var worksHtml = '<ul class="list-group">';
	for (var i = works.length - 1; i >= 0; i--) {
		worksHtml += '<li class="list-group-item" onclick="getData('+i+')">'+works[i]+'</li>';
	}
	$('#select-work').html(worksHtml);

	$('#breadcrumb li:nth-child(1) a').text(selectedCountry);
	$('#breadcrumb').children().show();
	$('#breadcrumb li:last-child').hide();
	$('#select-work').show();
}

function getData(workIdx){
	// Hide unecessary divs
	$('#select-work').hide();

	selectedWork = works[workIdx];
	// Ajax call to get data for a specific work
	// data = ...

	// Great mess begins here...


	$('#breadcrumb li:nth-child(2) a').text(selectedWork);
	$('#breadcrumb').children().show();
	$('#display-data-model').show();
}


function add(elementType){
	switch(elementType){
		case 'userInput':
			$('#add-userInputModal').modal('show');
			break;
		case 'referenceValue':
			$('#add-refValueModal').modal('show');
			break;
		case 'result':
			$('#add-resultModal').modal('show');
			break;
		case 'question':
			$('#add-questionModal').modal('show');
			break;
		case 'block':
			$('#add-blockModal').modal('show');
			break;
	}
}


userInputs = [];
// called from specific modal
function injectUserInputData(index, userInputElt){
	// Insert data at given position if there are already in
	if(index != -1){
		// Rewrite 
		userInputs[index] = userInputElt;
		index++;
	}
	else{
		// Push and add html content
		index = userInputs.push(userInputElt);
		var userInputHtml = '<li class="list-group-item"></li>';
		$('#data-userInputs').append(userInputHtml);	
	}
	
	// Update html
	$('#data-userInputs li:nth-child('+index+')').text(userInputElt.name);
	$('#data-userInputs li:nth-child('+index+')').click(function(){
		loadUserInput(index-1, userInputElt);
	});
}


referenceValues = [];
// called from specific modal
function injectRefValueData(index, refValueElt){
	// Insert data at given position if there are already in
	if(index != -1){
		// Rewrite 
		referenceValues[index] = refValueElt;
		index++;
	}
	else{
		// Push and add html content
		index = referenceValues.push(refValueElt);
		var refValueHtml = '<li class="list-group-item"></li>';
		$('#data-referenceValues').append(refValueHtml);	
	}
	
	// Update html
	$('#data-referenceValues li:nth-child('+index+')').text(refValueElt.name);
	$('#data-referenceValues li:nth-child('+index+')').click(function(){
		loadRefValue(index-1, refValueElt);
	});
}


results = [];
// called from specific modal
function injectResultData(index, resultElt){
		// Insert data at given position if there are already in
	if(index != -1){
		// Rewrite 
		results[index] = resultElt;
		index++;
	}
	else{
		// Push and add html content
		index = results.push(resultElt);
		var resultHtml = '<li class="list-group-item"></li>';
		$('#data-results').append(resultHtml);	
	}
	
	// Update html
	$('#data-results li:nth-child('+index+')').text(resultElt.name);
	$('#data-results li:nth-child('+index+')').click(function(){
		loadResult(index-1, resultElt);
	});
}



questions = [];
// called from specific modal
function injectQuestionData(index, questionElt){
		// Insert data at given position if there are already in
	if(index != -1){
		// Rewrite 
		questions[index] = questionElt;
		index++;
	}
	else{
		// Push and add html content
		index = questions.push(questionElt);
		var questionHtml = '<li class="list-group-item"></li>';
		$('#data-questions').append(questionHtml);	
	}
	
	// Update html
	$('#data-questions li:nth-child('+index+')').text(questionElt.name);
	$('#data-questions li:nth-child('+index+')').click(function(){
		loadQuestion(index-1, questionElt);
	});
}


blocks = [];
// Called from specific modal
function injectBlockData(index, blockElt){
	// Insert data at given position if there are already in
	if(index != -1){
		// Rewrite 
		blocks[index] = blockElt;
		index++;
	}
	else{
		// Push and add html content
		index = blocks.push(blockElt);
		var blockHtml = '<li class="list-group-item"></li>';
		$('#data-blocks').append(blockHtml);	
	}
	
	// Update html
	$('#data-blocks li:nth-child('+index+')').text(blockElt.name);
	$('#data-blocks li:nth-child('+index+')').click(function(){
		loadBlock(index-1, blockElt);
	});
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



















