/*
*   AWE SWEET PROPRIATORY METHODS
*
*   These are the methods that allow us to run our business
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var cldb = require('./dbScripts/db-team-checklists.js');
var squareV1 = require('./square/square_V1.js');
var fs 		= require('fs');
var path 	= require('path');

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
            
            //  IN SUCCESS ITERATE OVER ALL THE ITEMIZATIONS
            s.itemizations.forEach(function(item) {
                
                //  IF DATA ITEMS ARE PRESENT PROCESS THEM
                if(item.item_detail.category_name == 'Data') {
                    
                    console.log('found a data point', item.item_detail.item_id);

                    // end
                    resolve('good test');

                } else {
                    console.log('item was not a data point');
                };
            });

        }).catch(function error(e) {

            //  NOTIFY PROGRESS
            console.log('ERROR:');
            console.log(e);

            reject();

        });

        
    });
};

//  TEST
function test() { console.log('good test for asprop'); }

//  RETURN THE MODULE
module.exports = asprop;
