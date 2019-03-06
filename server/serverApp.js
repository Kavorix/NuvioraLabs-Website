/*
*       AWE SWEET SERVER
*
*       This is where the Awe Sweet server is run from.
*
*/

//  Declare all dependencies
var express		= require('express');
var bodyParser 	= require('body-parser');

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


/*
*	POST Declarations
*/


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