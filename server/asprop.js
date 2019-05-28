/*
*   AWE SWEET PROPRIATORY METHODS
*
*   These are the methods that allow us to run our business
*/

//  DEFINE PROPRIATARY DEPENDENCIES
var cldb        = require('./dbScripts/db-team-checklists.js');
var ivdb        = require('./dbScripts/db-inventory.js');
var squareV1    = require('./square/square_V1.js');
var fs 		    = require('fs');
var path 	    = require('path');

//  DEFINE MODULE
var asprop = {
    retreiveTemplate: retreiveTemplate,
    sqPushUpdates: sqPushUpdates,
    test: test
};


/*
*   RETREIVE TEMPLATE
*
*   This function returns the requested template
*/
function retreiveTemplate(readpath) {
    return fs.readFileSync(readpath, 'utf8')
};

/*
*   SQUARE PUSH UPDATES
*
*   This function accepts square push updates, retrieves the transactions.  If necessary it updates the database
*   then it returns a response
*/
function sqPushUpdates(pushObject) {
    //  NOTIFY PROGRESS
    console.log("sqPushUpdates got this notification:"); 
    console.log(pushObject);

    //  DEFINE LOCAL VARIABLES

    //  RETURN ASYNC WORK
    return new Promise(function sqPushUpdatesPromise(resolve, reject) {

        //  DOWNLOAD SQUARE TRANSACTION
        squareV1.retrievePayment(pushObject.location_id, pushObject.entity_id)
        .then(function success(s) {
            
            //  AFTER THE TRANSACTION HAS BEEN OBTAINED COLLECT THE INVENTORY INSTANCES
            ivdb.read.instanceId(s.created_at, s.tender[0].employee_id).then(function success(ss) {

                resolve(ss);

            }).catch(function error(e) {
                reject(e);
            });

            //  TODO: take this out later, was being used for pushes, but not anymore
            /*cldb.processPushTx.checkItems(s).then(function success(ss) {
                response(ss);
            }).catch(function error(e) {
                reject(e);
            });*/

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
