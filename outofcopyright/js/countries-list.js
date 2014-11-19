var country;

var contentFile

$(function() {
	$("#secondary").hide();
	$("html").css("height","1100px");
	displayCountries();

	$screenHeight = $(document).height();

	$( "#changeLog" ).css( "max-height", "500px" );

	$( "#uploadPOFileButton" ).click(function() {
			
	});

	$( "#downloadPOFileButton" ).click(function() {
		$('#languageToDownload').html('');
		$('#languageToDownload').append("<option value=''>Select a language</option>");
		for(var i = 0; i < file.language.length; i++){
			$('#languageToDownload').append("<option value='"+file.language[i]+"'>"+file.language[i]+"</option>");
		}
		$("#downloadPOFileModal").show();
	});

	$( "#downloadLanguage" ).click(function() {
		$.post( "/node", { country: country, name: $("#languageToDownload").val()+".json", action: 'read' } )
		.done(function( dataTrad ) {
			download($("#languageToDownload").val()+'.json', JSON.stringify(dataTrad));
			$("#downloadPOFileModal").hide();
		});
	});

	$( "#uploadPOFileButton" ).click(function() {
		$("#uploadPOFileModal").show();
	});

	$( "#uploadLanguage" ).click(function() {
		if(contentFile != undefined && $("#languageToUpload").val() != ''){
			if( jQuery.inArray( $("#languageToUpload").val(), file.language ) == -1){
				$.post( "/node", { country: country, name: $("#languageToUpload").val()+".json", action: 'write', file: JSON.stringify(contentFile), message: 'New file PO' } );
				file.language.push($("#languageToUpload").val());
				$("#listLanguagesSpan").append(" - "+$("#languageToUpload").val());
			}else{
				$.post( "/node", { country: country, name: $("#languageToUpload").val()+".json", action: 'update', file: JSON.stringify(contentFile), message: 'Update file PO' } );
			}
			$.post( "/node", { country: country, name: country+".json", action: 'update', file: JSON.stringify(file), message: 'New language' } );
		}
		$("#uploadPOFileModal").hide();
	});

	$( ".close" ).click(function() {
		$(".modal").hide();
	});

	$( ".closeButton" ).click(function() {
		$(".modal").hide();
	});

	$( "#addContributorButton" ).click(function() {
		$("#addContributorModal").show();
	});

	$( "#addContributor" ).click(function() {
		if($("#contributorName").val() != ""){
			file.contributors.push($("#contributorName").val());
			updateFile(country, country+'.json', JSON.stringify(file), 'New contributor');
			$('#contributors').append("<tr><td>"+$("#contributorName").val()+"</td></tr>");
		}
		$("#contributorName").val("");
		$("#addContributorModal").hide();
	});

	document.getElementById('fileToUpload').addEventListener('change', readSingleFile, false);

	$("#readonly-modal").click(function() {
		$("#readOnlyModal").show();
	});

	$("#readOnlyLanguage").click(function() {
		window.location.href = "/www/outofcopyright-website/wordpress/?page_id=26&country="+country+"&language="+$("#chooseLanguageReadOnly").val()+"&readonly=true";
	});
	

	$("#mergeInProduction").click(function() {
		$.post( "/node", { branch: 'master', child_branch: country, message: 'Merge '+country+' in master', action: 'merge' } )
	});

});

function displayCountries(){

	var callback = function(countries){
		var classactive = '';
		var style = '';
		for(var i = 0; i < countries.length; i++){
			if(i == 0){
				classactive = ' active';
				loadCountry(countries[i]);
				style = ' style="color:#fff;" ';
			}
			else{
				classactive = '';
				style = '';
			}
			$('#listCountries').append('<li class="country'+classactive+'" id="country-'+countries[i]+'" onclick="loadCountry(\''+countries[i]+'\');" ><a href="#'+countries[i]+'" '+style+'>'+countries[i]+'</a></li>');
		}
    }

    $.post( "/node", { action: 'getCountries' } )
		.done(function( data ) {
			callback(data);
		});
}

function loadCountry(country){

	this.country = country;
	
	console.log("./diagram-editor.html?country="+country);

	$(".active > a").css('color', '#22abd4');
	$( ".country" ).removeClass('active');
	$( "#country-"+country ).addClass('active');
	$(".active > a").css('color', '#fff');

	$( "#flowchart-title").html("FLOWCHART / "+country);

	$.post( "/node", { country: country, name: country+".json", action: 'read' } )
		.done(function( data ) {

		file = data;

		$("#edit-diagram").attr("href", "?page_id=4350&country="+country+"&language="+file.default_language);

		//Display languages available
		var listLanguages = "<span id='listLanguagesSpan'>";
		var options = "<option value=''>Select a language</option>";
		for( var i = 0; i < file.language.length; i++){
			if(i != 0){
				listLanguages += " - ";
			}

			if(file.language[i] == file.default_language){
				listLanguages += '<div id="default-langue" class="display-inherit">'+file.language[i]+'</div>';
			}
			else{
				listLanguages += file.language[i];
			}
			options += "<option value='"+file.language[i]+"'>"+file.language[i]+"</option>";
		}
		listLanguages += "</span>";
		$('#listLanguages').html(listLanguages);
		$("#chooseLanguageReadOnly").html(options);	

		//Display contributors
		var listContributors = "";

		for( var i = 0; i < file.contributors.length; i++){
			listContributors += "<tr><td>"+file.contributors[i]+"</td></tr>";
		}

		$('#contributors').html(listContributors);

		
	});

	//Display changelog
	$.post( "/node", { country: country, name: country+".json", action: 'commits' } )
		.done(function( data ) {
		var tf = new TimeFormatter();
		var listCommits = "";
		for( var i = 0; i < data.length; i++){
			var message = data[i].commit.message;
			var date = tf.format(data[i].commit.author.date,
        'dd/LL/yyyy HH:mm:ss');
			listCommits += '\
			<div class="col-sm-12">\
				<div class="row">\
	                <div class="row">\
	                    <div class="col-sm-2" >\
	                        <i class="fa fa-clock-o fa-lg"></i>\
	                    </div>\
	                    <div class="col-sm-10 text-left">\
	                        '+date+'\
	                    </div>\
	                </div>\
	                <div class="row">\
	                    <div class="col-sm-2" style="height: 50px;">\
	                    <div class="lineChangelog" style="height: 100%; width: 3px; background: rgb(216, 216, 216); margin-left: 6px;"></div>\
	                    </div>\
	                    <div class="col-sm-10">\
	                        <p>'+message+'</p>\
	                    </div>\
	                </div>\
	            </div>\
            </div>';
		}

		$("#changeLog").html(listCommits);
	});
}

function download(filename, text) {
  var pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  pom.setAttribute('download', filename);
  pom.click();
}

function readSingleFile(evt) {
    //Retrieve the first (and only!) File from the FileList object
    var f = evt.target.files[0]; 

    if (f) {
      	var r = new FileReader();
      	r.onload = function(e) { 
	      	var contents = e.target.result;
        	contentFile = contents;
      	}
      	r.readAsText(f);
    } else { 
      	alert("Failed to load file");
    }
  }
