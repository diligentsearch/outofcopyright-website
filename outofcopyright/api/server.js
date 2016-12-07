// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express'); 		// call express
var app        = express(); 				// define our app using express
var bodyParser = require('body-parser');
var fs 		   = require('fs');

eval(fs.readFileSync('../librairie/library.js')+'');
eval(fs.readFileSync('../librairie/node.js')+'');
eval(fs.readFileSync('../librairie/control.js')+'');
eval(fs.readFileSync('../librairie/datapoints.js')+'');
eval(fs.readFileSync('../librairie/walk.js')+'');
eval(fs.readFileSync('../librairie/credential_github.js')+'');
eval(fs.readFileSync('../librairie/github/github.js')+'');
eval(fs.readFileSync('../librairie/github_interface.js')+'');
eval(fs.readFileSync('../librairie/traduction.js')+'');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// Retourne la liste des pays disponible
router.get('/', function(req, res) {
	changeBranch(req);
	var callback = function(countries){
		var resultCountries = [];
		for (var i = 0 ; countries.length > i ; i ++) {
			resultCountries.push({ name: countries[i],
									url: "http://api.outofcopyright.eu/"+encodeURIComponent(countries[i])});
		}
		res.json({ countries: resultCountries});
    }

	getCountries(callback);	
});
router.post('/', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 4, message : 'Post is not supported'});
	});
router.put('/', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 5, message : 'Put is not supported'});
	});
router.delete('/', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 6, message : 'Delete is not supported'});
	});
router.patch('/', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 7, message : 'Patch is not supported'});
	});

//Retourne la liste des pays type of work
router.route('/:pays')

	.get(function(req, res) {
		changeBranch(req);
		req.params.pays = capitaliseFirstLetter(req.params.pays);
		readFile(req.params.pays, req.params.pays+'.json', function(data){
			//Read file json
			parseJSON(data);
			var resultPays = new Object;
			var resultPaysa = [];
			
			if(file !== null){
				for (var i = 0 ; file.subgraph.length > i ; i ++) {
					resultPaysa.push({ name: file.subgraph[i].graphName,
									url: 'http://api.outofcopyright.eu/'+encodeURIComponent(req.params.pays)+'/'+encodeURIComponent(file.subgraph[i].graphName)});
				};

				res.json({ categories : resultPaysa});
			}
			else{
				res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 8, message : 'Country not found'});
			}

			
		});
		
		
		
	});
router.post('/:pays', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 4, message : 'Post is not supported'});
	});
router.put('/:pays', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 5, message : 'Put is not supported'});
	});
router.delete('/:pays', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 6, message : 'Delete is not supported'});
	});
router.patch('/:pays', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 7, message : 'Patch is not supported'});
	});

//Résolution pas à pas du type of work
router.route('/:pays/:typeofwork')

	.post(function(req, res) {
		changeBranch(req);
		req.params.pays = capitaliseFirstLetter(req.params.pays);
		readFile(req.params.pays, req.params.pays+'.json', function(data){
			//Read file json
			parseJSON(data);
			
			req.params.typeofwork = capitaliseFirstLetter(req.params.typeofwork);
			if(file !== null){
				readFile(req.params.pays, file.default_language+'.json', function(dataTrad){
					traductionData = dataTrad;
					if(getListSubgraphByName(req.params.typeofwork) !== undefined){
						var inputs = getInputs(getListSubgraphByName(req.params.typeofwork));

						var responses = new Object();
						var responsesParameters = new Object();
						var errors = [];
						
						for(var i = 0; i < inputs.length; i++){
							eval("var valueQuery = req.body."+inputs[i]);
							if(valueQuery !== undefined && valueQuery !== ''){
								var response = valueQuery;
								
								if(isNaN(response)){
									eval("responses."+inputs[i]+" = '"+getKeyByTrad(response)+"';");
									eval("responsesParameters."+inputs[i]+" = '"+response+"';");
								}else{
									eval("responses."+inputs[i]+" = "+response+";");
									eval("responsesParameters."+inputs[i]+" = "+response+";");
								}
							}
							//var trad = getTraduction('EN', inputs[i]);
							//errors[inputs[i]] = trad+' missing';
						}

						var stringResponses = JSON.stringify(responses);
			   			var result = walk(getListSubgraphByName(req.params.typeofwork), stringResponses, true);

			   			commits('', '', function(data){

							res.json({ 	URL: 	'http://api.outofcopyright.eu/'+encodeURIComponent(req.params.pays)+'/'+req.params.typeofwork,
									version : data[0].sha,
									parameters : 	responsesParameters,
									result : 		result});
						});

						
					}
					else{
						res.status(400)        // HTTP status 404: NotFound
		   				.json({ error : 9, message : 'Type of work not found'});
					}
				});
			}
			else{
				res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 8, message : 'Country not found'});
			}
		
		});
	});

//variable nécessaire pour la résolution du pas à pas
router.route('/:pays/:typeofwork')

	.get(function(req, res) {
		if(req.params.pays == 'wip'){
			wipCountry(req, res);
		}else{
			changeBranch(req);
			req.params.pays = capitaliseFirstLetter(req.params.pays);
			readFile(req.params.pays, req.params.pays+'.json', function(data){
				//Read file json
				parseJSON(data);
				if(file !== null){
					req.params.typeofwork = capitaliseFirstLetter(req.params.typeofwork);
					readFile(req.params.pays, file.default_language+'.json', function(dataTrad){
						traductionData = dataTrad;
						if(getListSubgraphByName(req.params.typeofwork) !== undefined){
							var inputs = getInputs(getListSubgraphByName(req.params.typeofwork));
							var responses = [];
							for(var i = 0; i < inputs.length; i++){
								var input = getResponseById(inputs[i])
								input.question = getTraduction(file.default_language, 'question_'+input.id, true);
								if(input.set != null && typeof input == 'object'){
									input.items = [];
									for(var j = 0; j < input.set.length; j++){
										input.items.push(getTraduction(file.default_language, input.set[j], true));
									}
								}else{
									input.items = input.set;
								}
								input.additional_information = input.hint;
								delete input.set;
								delete input.hint;
								responses.push(getResponseById(inputs[i]));
							}
							if(responses.length > 0){
								res.json({ parameters : responses});
							}else{
								res.json({ error : 10, message : 'No possible result, the diagram is empty'});
							}
							
						}
						else{
							res.status(400)        // HTTP status 404: NotFound
			   				.json({ error : 9, message : 'Type of work not found'});
						}
					});
				}
				else{
					res.status(400)        // HTTP status 404: NotFound
	   				.json({ error : 8, message : 'Country not found'});
				}
				
			});
		}
	});

router.put('/:pays/:typeofwork', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 5, message : 'Put is not supported'});
	});
router.delete('/:pays/:typeofwork', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 6, message : 'Delete is not supported'});
	});
router.patch('/:pays/:typeofwork', function(req, res) {
		res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 7, message : 'Patch is not supported'});
	});

//variable nécessaire pour la résolution du pas à pas
router.route('/wip/:pays/:typeofwork')

	.get(function(req, res) {
			req.params.pays = capitaliseFirstLetter(req.params.pays);
			BRANCH = req.params.pays;
			readFile(req.params.pays, req.params.pays+'.json', function(data){
				//Read file json
				parseJSON(data);
				if(file !== null){
					req.params.typeofwork = capitaliseFirstLetter(req.params.typeofwork);
					readFile(req.params.pays, file.default_language+'.json', function(dataTrad){
						traductionData = dataTrad;
						if(getListSubgraphByName(req.params.typeofwork) !== undefined){
							var inputs = getInputs(getListSubgraphByName(req.params.typeofwork));
							var responses = [];
							for(var i = 0; i < inputs.length; i++){
								var input = getResponseById(inputs[i])
								input.question = getTraduction(file.default_language, 'question_'+input.id, true);
								if(input.set != null && typeof input == 'object'){
									input.items = [];
									for(var j = 0; j < input.set.length; j++){
										input.items.push(getTraduction(file.default_language, input.set[j], true));
									}
								}else{
									input.items = input.set;
								}
								input.additional_information = input.hint;
								delete input.set;
								delete input.hint;
								responses.push(getResponseById(inputs[i]));
							}
							if(responses.length > 0){
								res.json({ parameters : responses});
							}else{
								res.json({ error : 10, message : 'No possible result, the diagram is empty'});
							}
							
						}
						else{
							res.status(400)        // HTTP status 404: NotFound
			   				.json({ error : 9, message : 'Type of work not found'});
						}
					});
				}
				else{
					res.status(400)        // HTTP status 404: NotFound
	   				.json({ error : 8, message : 'Country not found'});
				}
				
			});
	});

router.route('/wip/:pays/:typeofwork')

	.post(function(req, res) {
		req.params.pays = capitaliseFirstLetter(req.params.pays);
		BRANCH = req.params.pays;
		readFile(req.params.pays, req.params.pays+'.json', function(data){
			//Read file json
			parseJSON(data);
			
			req.params.typeofwork = capitaliseFirstLetter(req.params.typeofwork);
			if(file !== null){
				readFile(req.params.pays, file.default_language+'.json', function(dataTrad){
					traductionData = dataTrad;
					if(getListSubgraphByName(req.params.typeofwork) !== undefined){
						var inputs = getInputs(getListSubgraphByName(req.params.typeofwork));

						var responses = new Object();
						var responsesParameters = new Object();
						var errors = [];
						
						for(var i = 0; i < inputs.length; i++){
							eval("var valueQuery = req.body."+inputs[i]);
							if(valueQuery !== undefined && valueQuery !== ''){
								var response = valueQuery;
								
								if(isNaN(response)){
									eval("responses."+inputs[i]+" = '"+getKeyByTrad(response)+"';");
									eval("responsesParameters."+inputs[i]+" = '"+response+"';");
								}else{
									eval("responses."+inputs[i]+" = "+response+";");
									eval("responsesParameters."+inputs[i]+" = "+response+";");
								}
								
							}
							//var trad = getTraduction('EN', inputs[i]);
							//errors[inputs[i]] = trad+' missing';
						}

						var stringResponses = JSON.stringify(responses);
			   			var result = walk(getListSubgraphByName(req.params.typeofwork), stringResponses, true);

			   			commits('', '', function(data){

							res.json({ 	URL: 	'http://api.outofcopyright.eu/'+encodeURIComponent(req.params.pays)+'/'+req.params.typeofwork,
									version : data[0].sha,
									parameters : 	responsesParameters,
									result : 		result});
						});

						
					}
					else{
						res.status(400)        // HTTP status 404: NotFound
		   				.json({ error : 9, message : 'Type of work not found'});
					}
				});
			}
			else{
				res.status(400)        // HTTP status 404: NotFound
   				.json({ error : 8, message : 'Country not found'});
			}
		
		});
	});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/', router);

function changeBranch(req){
	if(req.query.ref !== undefined){
		BRANCH = req.query.ref;
	}else{
		BRANCH = "master";
	}
}

function wipCountry(req, res){
	req.params.pays = capitaliseFirstLetter(req.params.typeofwork);
	BRANCH = req.params.pays;
	readFile(req.params.pays, req.params.pays+'.json', function(data){
		//Read file json
		parseJSON(data);
		var resultPays = new Object;
		var resultPaysa = [];
		
		if(file !== null){
			for (var i = 0 ; file.subgraph.length > i ; i ++) {
				resultPaysa.push({ name: file.subgraph[i].graphName,
								url: 'http://api.outofcopyright.eu/wip/'+encodeURIComponent(req.params.pays)+'/'+encodeURIComponent(file.subgraph[i].graphName)});
			};

			res.json({ categories : resultPaysa});
		}
		else{
			res.status(400)        // HTTP status 404: NotFound
				.json({ error : 8, message : 'Country not found'});
		}
	});
}

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
