/*
*       AWE SWEET SERVER
*
*       This is where the Awe Sweet server is run from.
*
*/

//  Declare all dependencies
var express		= require('express');
var bodyParser 	= require('body-parser');

//	DECLARE PROPRIATRY DEPENDENCIES
var cldb 		= require('./dbScripts/db-team-checklists.js');
var asprop 		= require('./asprop.js'); 

//  Return the express object
var serverApp = express();

//  Environment variables
var port = process.env.PORT || 3000;

//  Get the URL encoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var jsonParser = bodyParser.json();

/*
*	USE Declarations
*
*/
//  Define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//  Serve up a static asset
serverApp.use(express.static('dist'));

//  Define our body parsers
serverApp.use(jsonParser); // for parsing application/json
serverApp.use(urlencodedParser); // for parsing application/x-www-form-urlencoded

//  Track URL requests
serverApp.use('/', function(req, res, next) {
	//log the url to the console
	console.log('Request Url: ' + req.url);

	next();
});

/*
*	GET Declarations
*/
//	GET: ROOT 
serverApp.get('/', function(req, res) {
	//return an affirmative status code
	res.sendStatus(200);
});

//	GET: API/data/allChecklists
serverApp.get('/API/data/allChecklists', function(req, res) {
	
	//run the requird function
	cldb.getAllChecklists().then(function success(s) {
		
		//return an affirmative status code
		res.setHeader('Content-Type', 'application/json');
    	res.status(200);
    	res.send(JSON.stringify(s));

	}).catch(function error(e) {
		
		//return an error status code
		res.sendStatus(550);

	});
	
});

//	GET: API/data/aChecklist/:listId
serverApp.get('/API/data/aChecklist/:listId', function(req, res) {
	
	//run the requird function
	cldb.getAChecklist(req.params.listId).then(function success(s) {
		
		//return an affirmative status code
		res.setHeader('Content-Type', 'application/json');
    	res.status(200);
    	res.send(JSON.stringify(s));

	}).catch(function error(e) {
		
		//return an error status code
		res.sendStatus(550);

	});
	
});


/*
*	POST Declarations
*/
//	POST: /sqrwebhook
serverApp.post('/sqrwebhook', function(req, res) {
	
	//advise of the post body
	console.log(req.body);

	if(req.params.event_type == 'TEST_NOTIFICATION') { console.log('confirming test'); res.sendStatus(200); }
	else if(req.params.event_type == 'PAYMENT_UPDATED') { 
	
	//	NOTIFY PROGRESS
	console.log('testing payment');

	//run the requird function
	asprop.sqPushUpdates(req.body).then(function success(s) {
		
		//return an affirmative status code
		res.sendStatus(200);

	}).catch(function error(e) {

		//return an error status code
		res.sendStatus(550);
		
	});


	}

});

/*
*	Running the server
*/
//  Open the port for local development
serverApp.listen(port,function() {
	//display the port
	console.log('Express server is up and running on port ' + port);
	//identify the environment
	if(process.env.IS_PROUDCTION == 'true') console.log('is production')
		else console.log('is development')
});