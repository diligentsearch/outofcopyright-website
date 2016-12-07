// 
// 
// 
// This file is used to enable connection with the Github API
// a custom route based on localhost is provided and allow connection to API via HTTP POST Request
// it also demonstrates the capacity of the api
// 
// 

var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

eval(fs.readFileSync('./library.js')+'');
eval(fs.readFileSync('./github_interface.js')+'');

var router = express.Router();

app.get('/', function (req, res) {
	var hint = "<h2>Github management</h2>";
	hint += "<br>To test it, try a tool like POSTMAN, and forge some POST requests to this current URL page";
	hint += "<br>";
	hint += "<br>First try with the following key - value :";
	hint += "<br>&nbsp;&nbsp;&nbsp; 	action	some_text_not_known";
	hint += "<br>Result : action : read, write, update";

	hint += "<br><br>";

	hint += "<br>Then, try to get with the following : 	";
	hint += "<br>&nbsp;&nbsp;&nbsp; 	action	read";
	hint += "<br>&nbsp;&nbsp;&nbsp; 	country	Netherlands";
	hint += "<br>&nbsp;&nbsp;&nbsp; 	name	Netherlands.json";
	hint += "<br>	You will get the content of the copyright decision process for the Netherlands";
	
	res.send(hint);
});

router.route('/').post(function (req, res) {
        if(req.param('repo') == 'map'){
                REPONAME = 'outofcopyright-maps';
                BRANCH = 'master';
                USERNAME = 'outofcopyright';
        }else{
                REPONAME = 'outofcopyright-files';
                BRANCH = req.param('branch') == 'master' ? 'master' : req.param('country');
        }
	

	switch(req.param('action')){
		case 'read': 
					readFile(req.param('country'), req.param('name'), function(data){
						parseJSON(data);
						res.json(file);
					});
					break;
		case 'readOnly': 
					readFileOnly(REPONAME, req.param('name'), function(data){
						parseJSON(data);
						res.json(file);
					});
					break;
		case 'update':
					updateFile(req.param('country'), req.param('name'), req.param('file'), req.param('message'));
					saveFile(req.param('country'), req.param('name'), req.param('file'), req.param('message'));
					res.send('Update successful');
					break;
		case 'write':
					writeFile(req.param('country'), req.param('name'), req.param('file'), req.param('message'));
					saveFile(req.param('country'), req.param('name'), req.param('file'), req.param('message'));
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
});

// REGISTER OUR ROUTES
// ===================
app.use('/', router);

function saveFile(country, name, file, message){

	var string = "----------------------------------\r\n"
	string += "country : " + country + "\r\n";
	string += "name : " + name + "\r\n";
	string += "message : " + message + "\r\n";
	string += file;


	fs.writeFile("logfile/log-" + getDateTime()+ Math.floor((Math.random() * 100000) + 1), string, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	}); 
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + "-" + min + "-" + sec;
}


// START THE SERVER
// ===================
var server = app.listen(8000, function () {
  var host = server.address().address
  var port = server.address().port  

  host = host == '::' ? 'localhost': host;
  console.log('Github test api listening on http://%s:%s', host, port);
  console.log('NB : your apache configuration should reference a "/node" url matching http://%s:%s', host, port);
});