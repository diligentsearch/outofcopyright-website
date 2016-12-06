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
eval(fs.readFileSync('../librairie/interface_to_github')+'');
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
router.post('/', function(req, res) {

	var callback = function(countries){
		res.json({ countries: countries });
    }

	getCountries(callback);


		
});

//Retourne la liste des pays type of work
router.route('/:pays')

	.post(function(req, res) {
		readFile(req.params.pays, req.params.pays+'.json', function(data){
			//Read file json
			parseJSON(data);
			var result = [];
			for (var i = 0 ; file.subgraph.length > i ; i ++) {
				result.push(file.subgraph[i].graphName);
			};

			res.json({ typeofwork : result});
		});
		
		
		
	});

//Résolution pas à pas du type of work
router.route('/:pays/:typeofwork/decision')

	.post(function(req, res) {
		readFile(req.params.pays, req.params.pays+'.json', function(data){
			//Read file json
			parseJSON(data);

			readFile(req.params.pays, file.default_language+'.json', function(dataTrad){
				traductionData = dataTrad;
				var inputs = getInputs(getListSubgraphByName(req.params.typeofwork));

				var responses = new Object();
				var errors = [];

				for(var i = 0; i < inputs.length; i++){
					eval("var valueQuery = req.body."+inputs[i]);
					if(valueQuery !== undefined && valueQuery !== ''){
						var response = valueQuery;
						eval("responses."+inputs[i]+" = response;");
					}
					//var trad = getTraduction('EN', inputs[i]);
					//errors[inputs[i]] = trad+' missing';
				}

				responses = JSON.stringify(responses);
	   			var result = walk(getListSubgraphByName(req.params.typeofwork), responses);

				res.json({ result : result});
			});
		});
	});

//variable nécessaire pour la résolution du pas à pas
router.route('/:pays/:typeofwork')

	.post(function(req, res) {
		readFile(req.params.pays, req.params.pays+'.json', function(data){
			//Read file json
			parseJSON(data);
			readFile(req.params.pays, file.default_language+'.json', function(dataTrad){
				traductionData = dataTrad;
				var inputs = getInputs(getListSubgraphByName(req.params.typeofwork));
				var responses = [];
				for(var i = 0; i < inputs.length; i++){
					var input = getResponseById(inputs[i])
					input.question = getTraduction(file.default_language, 'question_'+input.id);
					input.responses = input.set;
					delete input.set;
					responses.push(getResponseById(inputs[i]));
				}

				res.json({ inputs : responses});
			});
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);