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
	retrievePayment: retrievePayment
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

//  RETURN THE MODULE
module.exports = squarv1;
