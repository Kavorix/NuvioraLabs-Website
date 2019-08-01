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
	listEmployees: listEmployees,
	listTransactions: listTransactions,
	listPayments: listPayments
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

/*
*	LIST TRANSACTIONS
* 	
*	This provides a limited colection of transactions that focus on amount, time, and type of payment, not who collected it or what the item was
*/
function listTransactions(locationId, start, end, cursor) {
	//	DECLARE LOCAL VARIABLES
	var transactionlist = [];
	var apiInstance = new SquareConnect.TransactionsApi();
	var opts = { 
		'beginTime': start, // String | The beginning of the requested reporting period, in RFC 3339 format.  See [Date ranges](#dateranges) for details on date inclusivity/exclusivity.  Default value: The current time minus one year.
		'endTime': end, // String | The end of the requested reporting period, in RFC 3339 format.  See [Date ranges](#dateranges) for details on date inclusivity/exclusivity.  Default value: The current time.
		//'sortOrder': "sortOrder_example", // String | The order in which results are listed in the response (`ASC` for oldest first, `DESC` for newest first).  Default value: `DESC`
		'cursor': cursor // String | A pagination cursor returned by a previous call to this endpoint. Provide this to retrieve the next set of results for your original query.  See [Pagination](/basics/api101/pagination) for more information.
	};
	
	//	return async work
	return new Promise(function(resolve, reject) {
		apiInstance.listTransactions(locationId, opts).then(function(data) {
			//	CHECK FOR PAGINATION
			if(data.cursor != undefined) {
				listTransactions(locationId, start, end, data.cursor)
				.then(function success(s) {
					//iterate over list
					for(var i = data.transactions.length -1; i >= 0; i--) {
						s.push(data.transactions[i]);
					}
					
					resolve(s);
				}).catch(function error(e) {
					console.log(e);
				});
			} else {
				
				//iterate over list
				for(var i = data.transactions.length -1; i >= 0; i--) {
					transactionlist.push(data.transactions[i]);
				}
				resolve(transactionlist);
			}
			//console.log('API called successfully. Returned data: ' + data);
			//resolve(data);
		}, function(error) {
			reject(error);
		});
	});

};

/*
*	LIST PAYMENTS
*/
function listPayments(locationId, order, beginTime, endTime, batchToken) {
	//	DECLARE LOCAL VARIABLES
	var transactionlist = [];
	var apiInstance = new SquareConnect.V1TransactionsApi();
	var opts = { 
		'order': order, // String | The order in which payments are listed in the response.
		'beginTime': beginTime, // String | The beginning of the requested reporting period, in ISO 8601 format. If this value is before January 1, 2013 (2013-01-01T00:00:00Z), this endpoint returns an error. Default value: The current time minus one year.
		'endTime': endTime, // String | The end of the requested reporting period, in ISO 8601 format. If this value is more than one year greater than begin_time, this endpoint returns an error. Default value: The current time.
		//'limit': 56, // Number | The maximum number of payments to return in a single response. This value cannot exceed 200.
		'batchToken': batchToken, // String | A pagination cursor to retrieve the next set of results for your original query to the endpoint.
		'includePartial': true // Boolean | Indicates whether or not to include partial payments in the response. Partial payments will have the tenders collected so far, but the itemizations will be empty until the payment is completed.
	};
	//console.log('getting payments')

	//	return async work
	return new Promise(function(resolve, reject) {
		apiInstance.listPaymentsWithHttpInfo(locationId, opts).then(function(data) {
			//resolve(data.response.links);
			//console.log('batch token', data.response.links.net);
			//	CHECK FOR PAGINATION
			if(data.response.links.next != undefined) {
				var nextLink = data.response.links.next;
				var splitpath = 'https://connect.squareup.com/v1/' + locationId + '/payments?batch_token='
				var rawToken = nextLink.split(splitpath);
				var isolateToken = rawToken[1].split('&begin_time');
				var batch_token = isolateToken[0];

				console.log('got this token', batch_token);

				listPayments(locationId, order, beginTime, endTime, batch_token)
				.then(function success(s) {
					//iterate over list
					for(var i = data.data.length -1; i >= 0; i--) {
						s.push(data.data[i]);
					}
					
					resolve(s);
				}).catch(function error(e) {
					console.log(e);
				});
			} else {
				console.log('got to the end of the list');
				//iterate over list
				for(var i = data.data.length -1; i >= 0; i--) {
					transactionlist.push(data.data[i]);
				}
				resolve(transactionlist);
			}
			//console.log('API called successfully. Returned data: ' + data);
			//resolve(data);
		}, function(error) {
			reject(error);
		});
	});
}

//  RETURN THE MODULE
module.exports = squarv1;
