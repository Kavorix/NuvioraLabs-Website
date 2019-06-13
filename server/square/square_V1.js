/*
*	SQUARE 
*
*	This module serves as the connection between Ah-Nuts Server and SquareUp.com.
*/

//	DEFINE DEPENDENCIES
var SquareConnect 	= require('square-connect');
var defaultClient 	= SquareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
var _oauth2 		= defaultClient.authentications['oauth2'];
_oauth2.accessToken = process.env.SQUARE_APP_TOKEN;

//	DEFINE MODULE
var squarv1 = {
	listItems: listItems,
	listCategories: listCategories,
	listModifiers: listModifiers,
	retrievePayment: retrievePayment,
	listEmployees: listEmployees
};

function listModifiers(locationId) {
	//	DEFINE LOCAL VARIABLES
	var apiInstance = new SquareConnect.V1ItemsApi();

	var body = new SquareConnect.UpdateItemModifierListsRequest(); // UpdateItemModifierListsRequest | An object containing the fields to POST for the request.  See the corresponding object definition for field details.

	//	RETURN ASYNC WORK
	return new Promise(function retrieveModifersListPromise(resolve, reject) {
		apiInstance.listModifierLists(locationId).then(function(data) {
			resolve(data);
		}, function(error) {
			reject(error);
		});
	});
}

/*
*	RETRIEVE TRANSACTION
*/
function listItems(locationId, opts) {
	//	DEFINE LOCAL VARIABLES
	var apiInstance = new SquareConnect.V1ItemsApi();
	//console.log('got these ids', locationId);

	var opts = { 
		//'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
	};

	//	RETURN ASYNC WORK
	return new Promise(function retrieveTransactionPromise(resolve, reject) {
		apiInstance.listItems(locationId, opts).then(function success(s) {
			resolve(s);
		}, function error(e) {
			reject(e);
		});

	});
};

/*
*	RETRIEVE TRANSACTION
*/
function listCategories(locationId) {
	//	DEFINE LOCAL VARIABLES
	var apiInstance = new SquareConnect.V1ItemsApi();
	console.log('got these ids', locationId);

	//	RETURN ASYNC WORK
	return new Promise(function retrieveTransactionPromise(resolve, reject) {
		apiInstance.listCategories(locationId).then(function success(s) {
			resolve(s);
		}, function error(e) {
			reject(e);
		});

	});
};

/*
*	RETRIEVE TRANSACTION
*/
function retrievePayment(locationId, transactionId) {
	//	DEFINE LOCAL VARIABLES
	var apiInstance = new SquareConnect.V1TransactionsApi();
	console.log('got these ids', locationId, transactionId);

	//	RETURN ASYNC WORK
	return new Promise(function retrieveTransactionPromise(resolve, reject) {
		apiInstance.retrievePayment(locationId, transactionId).then(function success(s) {
			resolve(s);
		}, function error(e) {
			reject(e);
		});

	});
};

/*
*	LIST EMPLOYEES
*/
function listEmployees() {
	//	DECLARE LOCAL VARIABLES
	var api = new SquareConnect.V1EmployeesApi();
	var opts = { 
	  'order': "ASC", // String | The order in which employees are listed in the response, based on their created_at field.      Default value: ASC 
	  //'beginUpdatedAt': "beginUpdatedAt_example", // String | If filtering results by their updated_at field, the beginning of the requested reporting period, in ISO 8601 format
	  //'endUpdatedAt': "endUpdatedAt_example", // String | If filtering results by there updated_at field, the end of the requested reporting period, in ISO 8601 format.
	  //'beginCreatedAt': "beginCreatedAt_example", // String | If filtering results by their created_at field, the beginning of the requested reporting period, in ISO 8601 format.
	  //'endCreatedAt': "endCreatedAt_example", // String | If filtering results by their created_at field, the end of the requested reporting period, in ISO 8601 format.
	  //'status': "status_example", // String | If provided, the endpoint returns only employee entities with the specified status (ACTIVE or INACTIVE).
	  //'externalId': "externalId_example", // String | If provided, the endpoint returns only employee entities with the specified external_id.
	  'limit': 200, // Number | The maximum integer number of employee entities to return in a single response. Default 100, maximum 200.
	  //'batchToken': "batchToken_example" // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
	};

	//	RETURN ASYNC WORK
	return new Promise(function(resolve, reject) {
		
		//calling the endpoint
		api.listEmployees(opts).then(function(data) {
				
			//notifying successful call
			console.log('listEmployees called successfully. Returning data');
		  	
		  	//returning data
			resolve(data)
			//resolve('roles success');

		}, function(error) {

			//returning error on unsucessful call
			reject(error);
		});

	});
	
};

//  RETURN THE MODULE
module.exports = squarv1;
