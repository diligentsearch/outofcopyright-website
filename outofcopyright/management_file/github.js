var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

eval(fs.readFileSync('../librairie/library.js')+'');
eval(fs.readFileSync('../librairie/credential_github.js')+'');
eval(fs.readFileSync('../librairie/github/github.js')+'');
eval(fs.readFileSync('../librairie/github.js')+'');

var router = express.Router();

app.get('/', function (req, res) {
  res.send('Github management');
})

router.route('/').post(function (req, res) {
	if(req.param('branch') == 'master'){
		BRANCH = 'master';
	}else{
		BRANCH = req.param('country');
	}
	

	switch(req.param('action')){
		case 'read': 
					readFile(req.param('country'), req.param('name'), function(data){
						parseJSON(data);
						res.json(file);
					});
					break;
		case 'update':
					updateFile(req.param('country'), req.param('name'), req.param('file'), req.param('message'));
					res.send('Update successful');
					break;
		case 'write':
					writeFile(req.param('country'), req.param('name'), req.param('file'), req.param('message'));
					res.send('Write successful');
					break;
		case 'getCountries':
					getCountries(function(data){
						res.json(data);
					});
					break;
		case 'commits':
					commits(req.param('country'), req.param('name'), function(data){
						res.json(data);
					});
					break;
		case 'merge':
					merge(req.param('branch'),req.param('child_branch'),req.param('message'));
					res.send('Merge successful');
					break;
		default : 	res.send('action : read, write, update');
					break;
	}
})

module.exports = router;

app.use('/', router);

var server = app.listen(8000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log('Example app listening at http://%s:%s', host, port)

})