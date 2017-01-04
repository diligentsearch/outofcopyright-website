html_result = `
<div id="add-resultModal" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" onclick="dismissResultModal()" aria-hidden="true">&times;</button>
				<h4 class="modal-title">Add a new result to your decision tree</h4>
			</div>

			<div class="modal-body">
				<div class="form-group">
					<label for="result-reference">Result identifier: </label>
					<br>
					<input id="result-reference" type="text" style="width:100%"/>					
				</div>

				<div class="form-group">
					<label for="result-content">Result to display: </label>
					<br>
					<textarea id="result-content" type="text" style="min-width:100%; max-width:100%"/>					
				</div>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-default" onclick="dismissResultModal()">Close</button>

				<button type="button" class="btn btn-primary" onclick="dumpResult()">Save changes</button>
			</div>
		</div>
	</div>
</div>

`;

function injectResultModal(){
	$('#modal-section').append(html_result);
};

currentResIdx = -1;
function loadResult(resIdx, resElt){
	currentResIdx = resIdx;
	$('#result-reference').val(resElt.name);
	$('#result-content').val(resElt.content);
	$('#add-resultModal').modal('show');
}


function dumpResult(){
	var error_log = "";
	if($('#result-reference').val() == ''){
		error_log += "Reference to this result is empty\n";
	}
	if($('#result-content').val() == ''){
		error_log += "Reference content is not set\n";
	}
	if(error_log != ""){
		alert(error_log);
		return;
	}

	var res = new ResultElt();
	injectResultData(currentResIdx, res);
	
	dismissResultModal();	
};

function dismissResultModal(){
	$('#result-reference').val('');
	$('#result-content').val('');
	if(currentResIdx != -1){
		currentResIdx = -1;
	}
	$('#add-resultModal').modal('hide');
};

function ResultElt(){
	this.name	 	= $('#result-reference').val();
	this.content 	= $('#result-content').val();
};
