/*
*   AWE SWEET PROPRIATORY METHODS
*
*   These are the methods that allow us to run our business
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var cldb        = require('./dbScripts/db-team-checklists.js');
var squareV1    = require('./square/square_V1.js');
var fs 		    = require('fs');
var path 	    = require('path');

//  DEFINE MODULE
var asprop = {
    sqPushUpdates: sqPushUpdates,
    test: test
};

/*
*   SQUARE PUSH UPDATES
*
*   This function accepts square push updates, retrieves the transactions.  If necessary it updates the database
*   then it returns a response
*/
function sqPushUpdates(pushObject) {
    //  NOTIFY PROGRESS
    console.log("sqPushUpdates got this notification:"); console.log(pushObject);

    //  DEFINE LOCAL VARIABLES

    //  RETURN ASYNC WORK
    return new Promise(function sqPushUpdatesPromise(resolve, reject) {

        //  DOWNLOAD SQUARE TRANSACTION
        squareV1.retrievePayment(pushObject.location_id, pushObject.entity_id)
        .then(function success(s) {
            
            cldb.processPushTx.checkItems(s).then(function success(s) {
                Response(s);
            }).catch(function error(e) {
                reject(e);
            });

        }).catch(function error(e) {

            //  NOTIFY PROGRESS
            console.log('ERROR:');
            console.log(e);

            reject(e);

        });

        
    });
};

//  TEST
function test() { console.log('good test for asprop'); }

//  RETURN THE MODULE
module.exports = asprop;
